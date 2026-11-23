import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOWNLOADS_DIR = path.join(ROOT, 'public', 'downloads');
const SCRATCH_DIR =
  '/Users/zhac-m1/.gemini/antigravity/brain/24c66d0c-1918-4c78-992a-1ba7c45a8699/scratch';
const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 4173;
const CDP_PORT = 9233;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
    });
    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'JS eval error');
    }
    return res.result?.value;
  }

  close() {
    this.ws.close();
  }
}

async function main() {
  await fs.mkdir(DOWNLOADS_DIR, { recursive: true });
  await fs.mkdir(SCRATCH_DIR, { recursive: true });

  const server = spawn(
    path.join(ROOT, 'node_modules', '.bin', 'vite'),
    ['preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'],
    {
      cwd: ROOT,
      stdio: 'ignore',
    }
  );

  const chrome = spawn(
    CHROME_BIN,
    [
      '--headless=new',
      `--remote-debugging-port=${CDP_PORT}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1440,1080',
      `--user-data-dir=/tmp/chrome-lockscreen-gen-${Date.now()}`,
      `http://127.0.0.1:${PORT}/`,
    ],
    { stdio: 'ignore' }
  );

  try {
    await waitForHttp(`http://127.0.0.1:${PORT}/`);
    await waitForHttp(`http://127.0.0.1:${CDP_PORT}/json/list`);

    const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
    const page = targets.find((t) => t.type === 'page');
    if (!page) throw new Error('No Chrome page target found');

    const cdp = new CDPClient(page.webSocketDebuggerUrl);
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1080,
      deviceScaleFactor: 2,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await sleep(2500);
    await cdp.eval('document.fonts.ready.then(() => true)');
    await sleep(600);

    // Export all 4 high-resolution PNG assets
    const exports = [
      ['mobile-dark', 'lockscreen-mobile-dark-1290x2796.png'],
      ['mobile-light', 'lockscreen-mobile-light-1290x2796.png'],
      ['desktop-dark', 'lockscreen-desktop-dark-3840x2160.png'],
      ['cover', 'handshake-cover-1600x1000.png'],
    ];

    for (const [kind, filename] of exports) {
      const dataUrl = await cdp.eval(`window.__renderExportDataUrl(${JSON.stringify(kind)})`);
      const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
      const outPath = path.join(DOWNLOADS_DIR, filename);
      await fs.writeFile(outPath, Buffer.from(base64, 'base64'));
      console.log(`Exported ${filename}`);
    }

    // Screenshot 1: Live Web App Studio (iOS default)
    const shot1 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    await fs.writeFile(
      path.join(SCRATCH_DIR, 'web-studio-ios.png'),
      Buffer.from(shot1.data, 'base64')
    );

    // Screenshot 2: Safe Zone Guides ON
    await cdp.eval(`document.getElementById('toggleSafeZonesBtn').click(); true`);
    await sleep(350);
    const shot2 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    await fs.writeFile(
      path.join(SCRATCH_DIR, 'web-studio-safezones.png'),
      Buffer.from(shot2.data, 'base64')
    );

    // Screenshot 3: Desktop 16:9 Simulator + Warm Paper off / Dark on
    await cdp.eval(`
      document.getElementById('toggleSafeZonesBtn').click();
      document.querySelector('.seg-btn[data-device="desktop"]').click();
      true
    `);
    await sleep(350);
    const shot3 = await cdp.send('Page.captureScreenshot', { format: 'png' });
    await fs.writeFile(
      path.join(SCRATCH_DIR, 'web-studio-desktop.png'),
      Buffer.from(shot3.data, 'base64')
    );

    cdp.close();
    console.log('All assets & verification screenshots generated successfully.');
  } finally {
    chrome.kill('SIGTERM');
    server.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
