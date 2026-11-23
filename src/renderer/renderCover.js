import { FONTS, roundRectPath, drawSubtleGrid, drawAirplane } from './themes.js';
import { renderMobileLockScreen } from './renderMobile.js';
import { renderDesktopLockScreen } from './renderDesktop.js';

export const COVER_W = 1600;
export const COVER_H = 1000;

export function renderHandshakeCover(canvas, state) {
  canvas.width = COVER_W;
  canvas.height = COVER_H;
  const ctx = canvas.getContext('2d');

  // 1. Deep editorial backdrop
  const bg = ctx.createLinearGradient(0, 0, COVER_W, COVER_H);
  bg.addColorStop(0, '#07090D');
  bg.addColorStop(0.55, '#0D121A');
  bg.addColorStop(1, '#111824');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, COVER_W, COVER_H);

  drawSubtleGrid(ctx, COVER_W, COVER_H, 48, 'rgba(255, 255, 255, 0.032)');

  // Warm aviation orange radial glow behind phone
  const glow = ctx.createRadialGradient(1180, 500, 40, 1180, 500, 520);
  glow.addColorStop(0, 'rgba(255, 77, 26, 0.24)');
  glow.addColorStop(0.55, 'rgba(255, 77, 26, 0.06)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(600, 0, 1000, COVER_H);

  // Subtle teal secondary glow bottom-left
  const glow2 = ctx.createRadialGradient(240, 880, 20, 240, 880, 380);
  glow2.addColorStop(0, 'rgba(56, 217, 169, 0.12)');
  glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 450, 700, 550);

  // 2. Render offscreen desktop & mobile lock screens using the exact same engines
  const deskCanvas = document.createElement('canvas');
  renderDesktopLockScreen(deskCanvas, { ...state, theme: 'dark' });

  const mobCanvas = document.createElement('canvas');
  renderMobileLockScreen(mobCanvas, { ...state, theme: 'dark' });

  // 3. Recessed Desktop Preview Card (back-right)
  ctx.save();
  const dX = 950;
  const dY = 175;
  const dW = 580;
  const dH = 326;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = 45;
  ctx.shadowOffsetY = 24;
  roundRectPath(ctx, dX, dY, dW, dH, 20);
  ctx.fillStyle = '#0A0D12';
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, dX, dY, dW, dH, 20);
  ctx.clip();
  ctx.drawImage(deskCanvas, dX, dY, dW, dH);
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, dX, dY, dW, dH, 20);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Small label under desktop preview
  ctx.save();
  ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
  ctx.font = `600 15px ${FONTS.mono}`;
  ctx.textAlign = 'right';
  ctx.fillText('4K DESKTOP 16:9 INCLUDED', dX + dW - 8, dY + dH + 26);
  ctx.restore();

  // 4. Hero iPhone 16 Pro Hardware Mockup (center-right)
  const phoneW = 394;
  const phoneH = 854;
  const phoneX = 870;
  const phoneY = 73;
  const bezel = 12;
  const outerR = 54;
  const innerR = 44;

  // Phone outer drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.78)';
  ctx.shadowBlur = 65;
  ctx.shadowOffsetY = 30;
  roundRectPath(ctx, phoneX, phoneY, phoneW, phoneH, outerR);
  ctx.fillStyle = '#1A202B';
  ctx.fill();
  ctx.restore();

  // Titanium frame border
  ctx.save();
  roundRectPath(ctx, phoneX, phoneY, phoneW, phoneH, outerR);
  const frameGrad = ctx.createLinearGradient(phoneX, phoneY, phoneX + phoneW, phoneY + phoneH);
  frameGrad.addColorStop(0, '#475569');
  frameGrad.addColorStop(0.5, '#1E2530');
  frameGrad.addColorStop(1, '#334155');
  ctx.strokeStyle = frameGrad;
  ctx.lineWidth = 3.5;
  ctx.stroke();
  ctx.restore();

  // Screen interior clipped
  const sX = phoneX + bezel;
  const sY = phoneY + bezel;
  const sW = phoneW - bezel * 2;
  const sH = phoneH - bezel * 2;

  ctx.save();
  roundRectPath(ctx, sX, sY, sW, sH, innerR);
  ctx.clip();

  // Draw actual 1290x2796 lock screen wallpaper
  ctx.drawImage(mobCanvas, sX, sY, sW, sH);

  // Realistic iOS 18 Lock Screen Overlay integrated cleanly in Top 28% Safe Zone
  // Dynamic Island
  roundRectPath(ctx, sX + sW / 2 - 46, sY + 14, 92, 24, 12);
  ctx.fillStyle = '#000000';
  ctx.fill();

  // Date & Clock
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.font = `600 16px ${FONTS.sans}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Monday, November 23', sX + sW / 2, sY + 76);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 76px ${FONTS.display}`;
  ctx.fillText('9:41', sX + sW / 2, sY + 136);

  // Subtle iOS Lock Screen Widget Pill Row
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  roundRectPath(ctx, sX + sW / 2 - 96, sY + 180, 192, 26, 13);
  ctx.fill();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.font = `600 11px ${FONTS.mono}`;
  ctx.fillText('GEMINI · 8:30 AM CHECK-IN', sX + sW / 2, sY + 193);

  // Bottom iOS Flashlight & Camera circles + Home Indicator (inside bottom 16% safe zone!)
  const btnY = sY + sH - 54;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.beginPath();
  ctx.arc(sX + 46, btnY, 20, 0, Math.PI * 2);
  ctx.arc(sX + sW - 46, btnY, 20, 0, Math.PI * 2);
  ctx.fill();

  // Tiny icons inside bottom circles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillRect(sX + 43, btnY - 7, 6, 14);
  ctx.beginPath();
  ctx.arc(sX + sW - 46, btnY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Home bar
  roundRectPath(ctx, sX + sW / 2 - 58, sY + sH - 16, 116, 5, 2.5);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.fill();

  ctx.restore();

  // 5. Left Editorial Column (starts at y = 215 to keep Top-Left 340x130 clear for Handshake's view badge!)
  const leftX = 88;

  // Badge pill
  ctx.save();
  roundRectPath(ctx, leftX, 212, 336, 40, 20);
  ctx.fillStyle = 'rgba(255, 77, 26, 0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 77, 26, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#FF4D1A';
  ctx.beginPath();
  ctx.arc(leftX + 22, 232, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFD4C7';
  ctx.font = `700 15px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('HANDSHAKE × GOOGLE GEMINI', leftX + 38, 233);
  ctx.restore();

  // Main Display Headline
  ctx.save();
  ctx.fillStyle = '#F8FAFC';
  ctx.font = `700 84px ${FONTS.display}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Boarding Pass', leftX, 286);

  ctx.fillStyle = '#FF4D1A';
  ctx.fillText('to Launch.', leftX, 376);

  // Subtitle
  ctx.fillStyle = '#94A3B8';
  ctx.font = `400 26px ${FONTS.sans}`;
  ctx.fillText('A 30-day countdown lock screen designed around', leftX, 498);
  ctx.fillText('real iOS & Android clock safe zones — plus a live', leftX, 536);
  ctx.fillText('interactive generator & Gemini reminder pack.', leftX, 574);
  ctx.restore();

  // 3 Spec Chips
  const chips = ['1290×2796 MOBILE', '4K DESKTOP 16:9', 'LIVE GENERATOR'];
  let chipX = leftX;
  const chipY = 656;
  ctx.save();
  ctx.font = `700 15px ${FONTS.mono}`;
  ctx.textBaseline = 'middle';
  chips.forEach((label) => {
    const w = ctx.measureText(label).width + 34;
    roundRectPath(ctx, chipX, chipY, w, 40, 10);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.fillText(label, chipX + w / 2, chipY + 21);
    chipX += w + 14;
  });
  ctx.restore();

  // Bottom-left route telemetry strip
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(leftX, 766);
  ctx.lineTo(leftX + 660, 766);
  ctx.stroke();

  ctx.fillStyle = '#64748B';
  ctx.font = `600 15px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('FLIGHT ROUTE', leftX, 804);
  ctx.fillText('COUNTDOWN', leftX + 360, 804);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = `700 30px ${FONTS.display}`;
  const originTxt = (state.originLabel || 'NOV 23').toUpperCase();
  const destTxt = (state.destLabel || 'DEC 23').toUpperCase();
  ctx.fillText(originTxt, leftX, 846);
  const originWidth = ctx.measureText(originTxt).width;
  const planeX = leftX + originWidth + 32;
  drawAirplane(ctx, planeX, 845, 24, '#FF4D1A');
  ctx.fillText(destTxt, planeX + 32, 846);

  ctx.fillStyle = '#38D9A9';
  ctx.font = `700 30px ${FONTS.mono}`;
  ctx.fillText('T-30 → T-00', leftX + 360, 846);
  ctx.restore();
}
