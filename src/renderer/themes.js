export const THEMES = {
  dark: {
    id: 'dark',
    label: 'Midnight OLED',
    bgTop: '#06080B',
    bgBottom: '#0C1016',
    gridLine: 'rgba(255, 255, 255, 0.032)',
    headerCaption: 'rgba(186, 198, 214, 0.45)',
    cardBg: '#11161E',
    cardBgElevated: '#171E29',
    cardBorder: '#242E3D',
    perforation: '#2B3647',
    notchFill: '#080B0F',
    inkPrimary: '#F5F7FA',
    inkSecondary: '#94A3B8',
    inkMuted: '#64748B',
    accent: '#FF4D1A',
    accentSoft: 'rgba(255, 77, 26, 0.14)',
    accentBorder: 'rgba(255, 77, 26, 0.48)',
    done: '#38D9A9',
    doneSoft: 'rgba(56, 217, 169, 0.14)',
    railTrack: '#253041',
    barcode: 'rgba(245, 247, 250, 0.72)',
    flapBg: '#0B0F15',
    flapBorder: '#2A3546',
    flapDivider: 'rgba(0, 0, 0, 0.55)',
    shadow: 'rgba(0, 0, 0, 0.55)',
  },
  light: {
    id: 'light',
    label: 'Warm Archival Paper',
    // Top safe zone stays deep graphite so native iOS/Android white lock screen clock stays 100% crisp
    bgTop: '#14171D',
    bgBottom: '#1C2028',
    gridLine: 'rgba(255, 255, 255, 0.035)',
    headerCaption: 'rgba(226, 232, 240, 0.5)',
    cardBg: '#F4EFE4',
    cardBgElevated: '#EBE4D5',
    cardBorder: '#D5CCB9',
    perforation: '#B8AE9A',
    notchFill: '#181C23',
    inkPrimary: '#14171C',
    inkSecondary: '#4B5563',
    inkMuted: '#727B88',
    accent: '#E04010',
    accentSoft: 'rgba(224, 64, 16, 0.12)',
    accentBorder: 'rgba(224, 64, 16, 0.45)',
    done: '#0F8A62',
    doneSoft: 'rgba(15, 138, 98, 0.12)',
    railTrack: '#CFC6B4',
    barcode: 'rgba(20, 23, 28, 0.8)',
    flapBg: '#161A20',
    flapBorder: '#2B313C',
    flapDivider: 'rgba(0, 0, 0, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
};

export const FONTS = {
  display: '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
};

export function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export function drawTicketCardPath(ctx, x, y, w, h, r, notchY, notchR) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  // Right edge down to notch
  ctx.lineTo(x + w, notchY - notchR);
  ctx.arc(x + w, notchY, notchR, -Math.PI / 2, Math.PI / 2, true);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  // Left edge up to notch
  ctx.lineTo(x, notchY + notchR);
  ctx.arc(x, notchY, notchR, Math.PI / 2, -Math.PI / 2, true);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawHorizontalTicketPath(ctx, x, y, w, h, r, notchX, notchR) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(notchX - notchR, y);
  ctx.arc(notchX, y, notchR, Math.PI, 0, true);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(notchX + notchR, y + h);
  ctx.arc(notchX, y + h, notchR, 0, Math.PI, true);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawAirplane(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  const s = size / 24;
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(11, 0);
  ctx.lineTo(3, -1.8);
  ctx.lineTo(-2.5, -10.5);
  ctx.lineTo(-5.2, -10.5);
  ctx.lineTo(-2.5, -1.8);
  ctx.lineTo(-8.2, -1.5);
  ctx.lineTo(-10.5, -4.8);
  ctx.lineTo(-12.2, -4.8);
  ctx.lineTo(-10.8, 0);
  ctx.lineTo(-12.2, 4.8);
  ctx.lineTo(-10.5, 4.8);
  ctx.lineTo(-8.2, 1.5);
  ctx.lineTo(-2.5, 1.8);
  ctx.lineTo(-5.2, 10.5);
  ctx.lineTo(-2.5, 10.5);
  ctx.lineTo(3, 1.8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawBarcode(ctx, x, y, w, h, seedStr, color) {
  ctx.save();
  ctx.fillStyle = color;
  // Deterministic pseudo-random barcode bars based on seed string
  let hash = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    hash ^= seedStr.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  let cursor = x;
  const unit = Math.max(2, w / 118);
  let step = 0;
  while (cursor < x + w - unit * 2) {
    hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
    const barUnits = (hash % 3) + 1;
    const gapUnits = ((hash >>> 4) % 2) + 1;
    // Guard bars at start & end
    const isGuard = step < 2 || cursor > x + w - unit * 10;
    const barW = (isGuard ? 1.5 : barUnits) * unit;
    if (cursor + barW <= x + w) {
      ctx.fillRect(cursor, y, barW, h);
    }
    cursor += barW + gapUnits * unit;
    step++;
  }
  ctx.restore();
}

export function drawSplitFlapPill(ctx, x, y, w, h, text, theme, accent = false) {
  ctx.save();
  roundRectPath(ctx, x, y, w, h, 14);
  ctx.fillStyle = accent ? theme.accent : theme.flapBg;
  ctx.fill();
  if (!accent) {
    ctx.strokeStyle = theme.flapBorder;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Split-flap horizontal mechanical seam
  ctx.beginPath();
  ctx.moveTo(x + 2, y + h / 2);
  ctx.lineTo(x + w - 2, y + h / 2);
  ctx.strokeStyle = accent ? 'rgba(0, 0, 0, 0.22)' : theme.flapDivider;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${Math.round(h * 0.48)}px ${FONTS.mono}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2 + 1);
  ctx.restore();
}

export function drawSubtleGrid(ctx, w, h, step, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = step; x < w; x += step) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, h);
  }
  for (let y = step; y < h; y += step) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(w, y + 0.5);
  }
  ctx.stroke();
  ctx.restore();
}
