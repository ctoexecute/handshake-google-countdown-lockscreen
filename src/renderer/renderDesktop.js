import {
  THEMES,
  FONTS,
  roundRectPath,
  drawHorizontalTicketPath,
  drawAirplane,
  drawBarcode,
  drawSplitFlapPill,
  drawSubtleGrid,
} from './themes.js';
import { diffDays } from '../data/presets.js';

export const DESKTOP_W = 3840;
export const DESKTOP_H = 2160;

function fitText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 3 && ctx.measureText(trimmed + '…').width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed + '…';
}

function wrapTwoLines(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
      if (lines.length === 1) break;
    }
  }
  if (lines.length === 0) {
    lines.push(fitText(ctx, current, maxWidth));
  } else if (lines.length === 1) {
    const usedWordCount = lines[0].split(/\s+/).length;
    const rest = words.slice(usedWordCount).join(' ');
    if (rest) lines.push(fitText(ctx, rest, maxWidth));
  }
  return lines;
}

export function renderDesktopLockScreen(canvas, state, options = {}) {
  const { showSafeZones = false } = options;
  const theme = THEMES[state.theme] || THEMES.dark;

  canvas.width = DESKTOP_W;
  canvas.height = DESKTOP_H;
  const ctx = canvas.getContext('2d');

  // 1. Background
  const bgGrad = ctx.createLinearGradient(0, 0, DESKTOP_W, DESKTOP_H);
  bgGrad.addColorStop(0, theme.bgTop);
  bgGrad.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, DESKTOP_W, DESKTOP_H);

  drawSubtleGrid(ctx, DESKTOP_W, DESKTOP_H, 96, theme.gridLine);

  // Ambient subtle glow behind panoramic ticket
  const glow = ctx.createRadialGradient(2260, 1180, 100, 2260, 1180, 1500);
  glow.addColorStop(0, state.theme === 'dark' ? 'rgba(255, 77, 26, 0.08)' : 'rgba(255, 77, 26, 0.06)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, DESKTOP_W, DESKTOP_H);

  // Subtle registration mark above ticket (below top clock safe zone)
  ctx.save();
  ctx.fillStyle = theme.headerCaption;
  ctx.font = `600 28px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('BOARDING PASS TO LAUNCH  ·  DEPARTURE BOARD', 900, 480);
  ctx.textAlign = 'right';
  ctx.fillText(`${state.flightCode || 'BP-2027'}  ·  GEMINI BACKWARD PLAN`, 3620, 480);
  ctx.restore();

  // 2. Panoramic Horizontal Ticket Card (respects left 22%, top 23%, bottom 13%)
  const cardX = 890;
  const cardY = 520;
  const cardW = 2740;
  const cardH = 1320;
  const notchX = 1690;
  const notchR = 36;

  ctx.save();
  ctx.shadowColor = theme.shadow;
  ctx.shadowBlur = 70;
  ctx.shadowOffsetY = 28;
  drawHorizontalTicketPath(ctx, cardX, cardY, cardW, cardH, 44, notchX, notchR);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();
  ctx.restore();

  ctx.save();
  drawHorizontalTicketPath(ctx, cardX, cardY, cardW, cardH, 44, notchX, notchR);
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Left edge orange accent stripe
  ctx.save();
  drawHorizontalTicketPath(ctx, cardX, cardY, cardW, cardH, 44, notchX, notchR);
  ctx.clip();
  ctx.fillStyle = theme.accent;
  ctx.fillRect(cardX, cardY, 16, cardH);
  ctx.restore();

  // Vertical perforation line
  ctx.save();
  ctx.strokeStyle = theme.perforation;
  ctx.lineWidth = 3.5;
  ctx.setLineDash([14, 14]);
  ctx.beginPath();
  ctx.moveTo(notchX, cardY + notchR + 16);
  ctx.lineTo(notchX, cardY + cardH - notchR - 16);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 3. Left Stub (x: 960 -> 1630)
  const stubL = cardX + 76;
  const stubR = notchX - 58;
  const stubW = stubR - stubL;

  const totalDays = diffDays(state.startDate, state.targetDate);
  const activeMilestone = state.milestones[state.activeIndex] || state.milestones[0];
  const countdownText = activeMilestone ? `${activeMilestone.tMinus} DAYS` : `T-${totalDays} DAYS`;

  ctx.save();
  ctx.fillStyle = theme.inkMuted;
  ctx.font = `600 28px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`FLIGHT ${state.flightCode || 'BP-2027'}`, stubL, cardY + 86);

  drawSplitFlapPill(ctx, stubL, cardY + 136, 320, 84, countdownText, theme, true);

  // Origin -> Dest stacked route
  ctx.fillStyle = theme.inkPrimary;
  ctx.font = `700 108px ${FONTS.display}`;
  ctx.fillText((state.originCode || 'NOW').toUpperCase(), stubL, cardY + 332);

  drawAirplane(ctx, stubL + 36, cardY + 422, 48, theme.accent);
  ctx.fillStyle = theme.inkSecondary;
  ctx.font = `600 28px ${FONTS.mono}`;
  ctx.fillText(`${(state.originLabel || 'NOV 23').toUpperCase()}  →  ${(state.destLabel || 'DEC 23').toUpperCase()}`, stubL + 84, cardY + 422);

  ctx.fillStyle = theme.inkPrimary;
  ctx.font = `700 108px ${FONTS.display}`;
  ctx.fillText((state.destCode || '2027').toUpperCase(), stubL, cardY + 518);

  // Mission title box
  roundRectPath(ctx, stubL, cardY + 610, stubW, 134, 20);
  ctx.fillStyle = theme.cardBgElevated;
  ctx.fill();
  ctx.fillStyle = theme.inkMuted;
  ctx.font = `600 24px ${FONTS.mono}`;
  ctx.fillText('MISSION TARGET', stubL + 28, cardY + 650);
  ctx.fillStyle = theme.inkPrimary;
  ctx.font = `700 34px ${FONTS.display}`;
  ctx.fillText(fitText(ctx, (state.missionTitle || 'CAREER & PORTFOLIO LAUNCH').toUpperCase(), stubW - 56), stubL + 28, cardY + 704);

  // Gate / Seat / Status metadata
  const metaY = cardY + 818;
  const cols = [
    ['GATE', state.gate || 'G-27'],
    ['SEAT', state.seat || '01A'],
    ['STATUS', 'ON TRACK'],
  ];
  cols.forEach(([label, val], i) => {
    const cx = stubL + i * (stubW / 3);
    ctx.fillStyle = theme.inkMuted;
    ctx.font = `600 24px ${FONTS.mono}`;
    ctx.fillText(label, cx, metaY);
    ctx.fillStyle = i === 2 ? theme.done : theme.inkPrimary;
    ctx.font = `700 36px ${FONTS.mono}`;
    ctx.fillText(val, cx, metaY + 48);
  });

  // Barcode at bottom of stub
  drawBarcode(ctx, stubL, cardY + 1090, stubW, 96, `${state.targetDate}-${state.flightCode}-DESKTOP`, theme.barcode);
  ctx.fillStyle = theme.inkMuted;
  ctx.font = `600 24px ${FONTS.mono}`;
  ctx.fillText(`${state.targetDate || '2026-12-23'}  //  BOARDING PASS`, stubL, cardY + 1234);
  ctx.restore();

  // 4. Right Departure Board (x: 1756 -> 3560) — 2×3 Chronological Grid
  const boardL = notchX + 68;
  const boardR = cardX + cardW - 68;
  const boardW = boardR - boardL;

  ctx.save();
  ctx.fillStyle = theme.inkMuted;
  ctx.font = `600 28px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('FLIGHT SEQUENCE  ·  6 CHRONOLOGICAL MILESTONES', boardL, cardY + 86);

  const completedCount = state.milestones.filter((_, i) => i < state.activeIndex).length;
  ctx.textAlign = 'right';
  ctx.fillStyle = theme.inkSecondary;
  ctx.fillText(`${completedCount}/${state.milestones.length} CLEARED`, boardR, cardY + 86);

  // Progress bar across top of board
  const progY = cardY + 132;
  const progH = 12;
  roundRectPath(ctx, boardL, progY, boardW, progH, 6);
  ctx.fillStyle = theme.railTrack;
  ctx.fill();

  const progressRatio = Math.max(0.08, (state.activeIndex + 0.5) / state.milestones.length);
  roundRectPath(ctx, boardL, progY, boardW * progressRatio, progH, 6);
  ctx.fillStyle = theme.accent;
  ctx.fill();
  ctx.restore();

  // 2 columns × 3 rows grid of milestone cards
  const gridTop = cardY + 190;
  const colGap = 40;
  const rowGap = 36;
  const tileW = (boardW - colGap) / 2;
  const tileH = 310;

  state.milestones.forEach((m, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const tx = boardL + col * (tileW + colGap);
    const ty = gridTop + row * (tileH + rowGap);

    const isDone = idx < state.activeIndex;
    const isActive = idx === state.activeIndex;
    const isDest = idx === state.milestones.length - 1;

    ctx.save();
    roundRectPath(ctx, tx, ty, tileW, tileH, 26);
    ctx.fillStyle = isActive ? theme.accentSoft : theme.cardBgElevated;
    ctx.fill();
    ctx.strokeStyle = isActive ? theme.accentBorder : theme.cardBorder;
    ctx.lineWidth = isActive ? 3.5 : 2;
    ctx.stroke();

    // Top row: split-flap T-XX + Date + Status
    drawSplitFlapPill(ctx, tx + 32, ty + 32, 142, 58, m.tMinus, theme, isActive);

    ctx.fillStyle = isActive ? theme.accent : isDone ? theme.done : theme.inkMuted;
    ctx.font = `700 28px ${FONTS.mono}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(m.date.toUpperCase(), tx + 198, ty + 62);

    const tag = isActive ? '● ACTIVE' : isDone ? '✓ DONE' : isDest ? '◆ LAUNCH' : `STAGE 0${idx + 1}`;
    ctx.textAlign = 'right';
    ctx.fillStyle = isActive ? theme.accent : isDone ? theme.done : theme.inkMuted;
    ctx.fillText(tag, tx + tileW - 32, ty + 62);

    // Title
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.inkPrimary;
    ctx.font = `700 44px ${FONTS.display}`;
    ctx.fillText(fitText(ctx, m.title, tileW - 64), tx + 32, ty + 144);

    // Short detail / done criteria (clean 2-line wrap, zero awkward truncation)
    ctx.fillStyle = theme.inkSecondary;
    ctx.font = `500 26px ${FONTS.sans}`;
    const detailLines = wrapTwoLines(ctx, m.detail || m.doneCriteria || '', tileW - 64);
    detailLines.forEach((line, lineIdx) => {
      ctx.fillText(line, tx + 32, ty + 200 + lineIdx * 36);
    });

    // Stage progress indicator bar at bottom of tile
    roundRectPath(ctx, tx + 32, ty + tileH - 28, tileW - 64, 6, 3);
    ctx.fillStyle = isDone ? theme.done : isActive ? theme.accent : theme.railTrack;
    ctx.fill();
    ctx.restore();
  });

  if (showSafeZones) {
    drawDesktopSafeZoneOverlay(ctx);
  }
}

function drawDesktopSafeZoneOverlay(ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(56, 217, 169, 0.14)';
  // Left 22% icons zone
  ctx.fillRect(0, 0, 845, DESKTOP_H);
  // Top 23% clock zone
  ctx.fillRect(845, 0, DESKTOP_W - 845, 500);
  // Bottom 13% dock zone
  ctx.fillRect(845, 1880, DESKTOP_W - 845, DESKTOP_H - 1880);

  ctx.strokeStyle = '#38D9A9';
  ctx.lineWidth = 4;
  ctx.setLineDash([18, 12]);
  ctx.beginPath();
  ctx.moveTo(845, 0);
  ctx.lineTo(845, DESKTOP_H);
  ctx.moveTo(845, 500);
  ctx.lineTo(DESKTOP_W, 500);
  ctx.moveTo(845, 1880);
  ctx.lineTo(DESKTOP_W, 1880);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.font = `700 36px ${FONTS.mono}`;
  ctx.fillStyle = '#38D9A9';
  ctx.textAlign = 'center';
  ctx.fillText('LEFT 22% · DESKTOP ICONS', 422, DESKTOP_H / 2);
  ctx.fillText('TOP 23% · MACOS / WINDOWS LOCK CLOCK', 2340, 260);
  ctx.fillText('BOTTOM 13% · DOCK / TASKBAR', 2340, 2020);
  ctx.restore();
}
