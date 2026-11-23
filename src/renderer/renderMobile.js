import {
  THEMES,
  FONTS,
  roundRectPath,
  drawTicketCardPath,
  drawAirplane,
  drawBarcode,
  drawSplitFlapPill,
  drawSubtleGrid,
} from './themes.js';
import { diffDays } from '../data/presets.js';

export const MOBILE_W = 1290;
export const MOBILE_H = 2796;

function fitText(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 3 && ctx.measureText(trimmed + '…').width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed + '…';
}

export function renderMobileLockScreen(canvas, state, options = {}) {
  const { showSafeZones = false } = options;
  const theme = THEMES[state.theme] || THEMES.dark;

  canvas.width = MOBILE_W;
  canvas.height = MOBILE_H;
  const ctx = canvas.getContext('2d');

  // 1. Background gradient (deep OLED-friendly top safe zone)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, MOBILE_H);
  bgGrad.addColorStop(0, theme.bgTop);
  bgGrad.addColorStop(0.32, theme.bgTop);
  bgGrad.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, MOBILE_W, MOBILE_H);

  // Subtle architectural dot/line grid in lower 72% only (keep top clock zone ultra-clean)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 740, MOBILE_W, MOBILE_H - 740);
  ctx.clip();
  drawSubtleGrid(ctx, MOBILE_W, MOBILE_H, 64, theme.gridLine);
  ctx.restore();

  // Subtle radial ambient glow behind ticket top edge
  const glow = ctx.createRadialGradient(MOBILE_W / 2, 820, 40, MOBILE_W / 2, 820, 680);
  glow.addColorStop(0, state.theme === 'dark' ? 'rgba(255, 77, 26, 0.09)' : 'rgba(255, 77, 26, 0.07)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 400, MOBILE_W, 900);

  // Micro-registration line right at bottom edge of top safe zone (y = 748)
  ctx.save();
  ctx.fillStyle = theme.headerCaption;
  ctx.font = `600 22px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('LOCAL TIME  ·  BOARDING CALL', 78, 746);

  ctx.textAlign = 'right';
  ctx.fillText(`${state.flightCode || 'BP-2027'}`, MOBILE_W - 78, 746);
  ctx.restore();

  // 2. Boarding Pass Ticket Card (y: 788 -> 2342, strictly between top 28% and bottom 16.2% safe zones)
  const cardX = 72;
  const cardW = MOBILE_W - cardX * 2; // 1146px
  const cardY = 788;
  const cardH = 1554;
  const notchY = 1144;
  const notchR = 26;

  ctx.save();
  ctx.shadowColor = theme.shadow;
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 20;
  drawTicketCardPath(ctx, cardX, cardY, cardW, cardH, 36, notchY, notchR);
  ctx.fillStyle = theme.cardBg;
  ctx.fill();
  ctx.restore();

  // Card hairline border
  ctx.save();
  drawTicketCardPath(ctx, cardX, cardY, cardW, cardH, 36, notchY, notchR);
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Accent top bar inside card
  ctx.save();
  drawTicketCardPath(ctx, cardX, cardY, cardW, cardH, 36, notchY, notchR);
  ctx.clip();
  ctx.fillStyle = theme.accent;
  ctx.fillRect(cardX, cardY, cardW, 10);
  ctx.restore();

  const innerLeft = cardX + 52;
  const innerRight = cardX + cardW - 52;
  const innerW = innerRight - innerLeft;

  // 3. Flight Route Header (y: 828 -> 1118)
  const totalDays = diffDays(state.startDate, state.targetDate);
  const activeMilestone = state.milestones[state.activeIndex] || state.milestones[0];
  const countdownText = activeMilestone ? `${activeMilestone.tMinus} DAYS` : `T-${totalDays} DAYS`;

  // Metadata top strip
  ctx.save();
  ctx.fillStyle = theme.inkMuted;
  ctx.font = `600 24px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`GATE ${state.gate || 'G-27'}   ·   SEAT ${state.seat || '01A'}`, innerLeft, 854);

  // Split-flap T-XX DAYS badge on top right
  drawSplitFlapPill(ctx, innerRight - 248, 822, 248, 64, countdownText, theme, true);
  ctx.restore();

  // Origin -> Destination big aviation codes
  const routeY = 964;
  ctx.save();
  ctx.fillStyle = theme.inkPrimary;
  ctx.font = `700 84px ${FONTS.display}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText((state.originCode || 'NOW').toUpperCase(), innerLeft, routeY);

  ctx.textAlign = 'right';
  ctx.fillText((state.destCode || '2027').toUpperCase(), innerRight, routeY);

  // Flight path dotted line + airplane glyph between codes
  const originW = ctx.measureText((state.originCode || 'NOW').toUpperCase()).width;
  const destW = ctx.measureText((state.destCode || '2027').toUpperCase()).width;
  const lineStart = innerLeft + originW + 38;
  const lineEnd = innerRight - destW - 38;
  if (lineEnd - lineStart > 80) {
    const midX = (lineStart + lineEnd) / 2;
    ctx.strokeStyle = theme.perforation;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 10]);
    ctx.beginPath();
    ctx.moveTo(lineStart, routeY);
    ctx.lineTo(midX - 36, routeY);
    ctx.moveTo(midX + 36, routeY);
    ctx.lineTo(lineEnd, routeY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Small endpoint dots
    ctx.fillStyle = theme.inkMuted;
    ctx.beginPath();
    ctx.arc(lineStart, routeY, 5, 0, Math.PI * 2);
    ctx.arc(lineEnd, routeY, 5, 0, Math.PI * 2);
    ctx.fill();

    drawAirplane(ctx, midX, routeY, 44, theme.accent);
  }

  // Departure & Arrival date sub-labels
  ctx.fillStyle = theme.inkSecondary;
  ctx.font = `600 24px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.fillText(`DEPART  ${(state.originLabel || 'NOV 23').toUpperCase()}`, innerLeft, 1026);
  ctx.textAlign = 'right';
  ctx.fillText(`ARRIVE  ${(state.destLabel || 'DEC 23').toUpperCase()}`, innerRight, 1026);

  // Mission title bar
  ctx.fillStyle = theme.cardBgElevated;
  roundRectPath(ctx, innerLeft, 1058, innerW, 52, 12);
  ctx.fill();
  ctx.fillStyle = theme.inkPrimary;
  ctx.font = `700 25px ${FONTS.mono}`;
  ctx.textAlign = 'center';
  ctx.fillText(
    fitText(ctx, (state.missionTitle || 'CAREER & PORTFOLIO LAUNCH').toUpperCase(), innerW - 36),
    cardX + cardW / 2,
    1085
  );
  ctx.restore();

  // 4. Perforated Tear Line across notches
  ctx.save();
  ctx.strokeStyle = theme.perforation;
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(cardX + notchR + 12, notchY);
  ctx.lineTo(cardX + cardW - notchR - 12, notchY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 5. Milestones Section Header
  const listHeaderY = 1192;
  ctx.save();
  ctx.fillStyle = theme.inkMuted;
  ctx.font = `600 22px ${FONTS.mono}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('FLIGHT SEQUENCE  ·  6 MILESTONES', innerLeft, listHeaderY);

  const completedCount = state.milestones.filter((_, i) => i < state.activeIndex).length;
  ctx.textAlign = 'right';
  ctx.fillStyle = theme.inkSecondary;
  ctx.fillText(`${completedCount}/${state.milestones.length} CLEARED`, innerRight, listHeaderY);
  ctx.restore();

  // 6. Vertical Flight-Path Rail + 6 Milestones (y: 1236 -> 2158)
  const listTop = 1236;
  const rowCount = state.milestones.length;
  const rowHeight = 152;
  const railX = innerLeft + 24;

  // Continuous rail line
  const firstCenterY = listTop + rowHeight / 2;
  const lastCenterY = listTop + (rowCount - 1) * rowHeight + rowHeight / 2;

  ctx.save();
  ctx.strokeStyle = theme.railTrack;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(railX, firstCenterY);
  ctx.lineTo(railX, lastCenterY);
  ctx.stroke();

  // Progress segment along rail up to active milestone
  if (state.activeIndex > 0) {
    const activeCenterY = listTop + state.activeIndex * rowHeight + rowHeight / 2;
    ctx.strokeStyle = theme.done;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(railX, firstCenterY);
    ctx.lineTo(railX, activeCenterY);
    ctx.stroke();
  }
  ctx.restore();

  state.milestones.forEach((m, idx) => {
    const rowY = listTop + idx * rowHeight;
    const cy = rowY + rowHeight / 2;
    const isDone = idx < state.activeIndex;
    const isActive = idx === state.activeIndex;
    const isDest = idx === rowCount - 1;

    // Active row highlight box
    if (isActive) {
      ctx.save();
      roundRectPath(ctx, innerLeft - 14, rowY + 10, innerW + 28, rowHeight - 20, 22);
      ctx.fillStyle = theme.accentSoft;
      ctx.fill();
      ctx.strokeStyle = theme.accentBorder;
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();
    } else if (idx < rowCount - 1 && idx !== state.activeIndex - 1) {
      // Subtle row separator
      ctx.save();
      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(railX + 46, rowY + rowHeight);
      ctx.lineTo(innerRight, rowY + rowHeight);
      ctx.stroke();
      ctx.restore();
    }

    // Waypoint marker on rail
    ctx.save();
    if (isActive) {
      // Outer halo
      ctx.fillStyle = theme.accentSoft;
      ctx.beginPath();
      ctx.arc(railX, cy, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.accent;
      ctx.beginPath();
      ctx.arc(railX, cy, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(railX, cy, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (isDone) {
      ctx.fillStyle = theme.done;
      ctx.beginPath();
      ctx.arc(railX, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      // Checkmark
      ctx.strokeStyle = '#06110D';
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(railX - 6, cy + 1);
      ctx.lineTo(railX - 1.5, cy + 5.5);
      ctx.lineTo(railX + 6.5, cy - 4.5);
      ctx.stroke();
    } else if (isDest) {
      // Destination diamond
      ctx.translate(railX, cy);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = 4;
      ctx.fillRect(-11, -11, 22, 22);
      ctx.strokeRect(-11, -11, 22, 22);
    } else {
      ctx.fillStyle = theme.cardBg;
      ctx.strokeStyle = theme.inkMuted;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(railX, cy, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Split-flap T-XX pill
    const pillX = railX + 46;
    const pillW = 122;
    const pillH = 52;
    drawSplitFlapPill(ctx, pillX, cy - pillH / 2, pillW, pillH, m.tMinus, theme, isActive);

    // Date + Action text
    const textX = pillX + pillW + 28;
    const statusTagW = 112;
    const textMaxW = innerRight - textX - statusTagW - 12;

    ctx.save();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Date micro-label
    ctx.fillStyle = isActive ? theme.accent : isDone ? theme.done : theme.inkMuted;
    ctx.font = `700 22px ${FONTS.mono}`;
    ctx.fillText(m.date.toUpperCase(), textX, cy - 26);

    // Milestone short action title
    ctx.fillStyle = isDone ? theme.inkSecondary : theme.inkPrimary;
    ctx.font = `${isActive || isDest ? '700' : '600'} 38px ${FONTS.sans}`;
    ctx.fillText(fitText(ctx, m.title, textMaxW), textX, cy + 20);

    // Right status pill
    const tagText = isActive ? 'NOW' : isDone ? 'DONE' : isDest ? 'GOAL' : `0${idx + 1}`;
    ctx.textAlign = 'right';
    ctx.font = `700 22px ${FONTS.mono}`;
    ctx.fillStyle = isActive ? theme.accent : isDone ? theme.done : theme.inkMuted;
    ctx.fillText(tagText, innerRight - 4, cy);
    ctx.restore();
  });

  // 7. Barcode Footer Strip inside card (y: 2178 -> 2314)
  ctx.save();
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(innerLeft, 2178);
  ctx.lineTo(innerRight, 2178);
  ctx.stroke();

  drawBarcode(
    ctx,
    innerLeft,
    2202,
    innerW,
    56,
    `${state.targetDate}-${state.missionTitle}-${state.flightCode}`,
    theme.barcode
  );

  ctx.fillStyle = theme.inkMuted;
  ctx.font = `600 21px ${FONTS.mono}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `${state.targetDate || '2026-12-23'}  //  GEMINI BACKWARD PLAN  //  BOARDING PASS TO LAUNCH`,
    cardX + cardW / 2,
    2292
  );
  ctx.restore();

  // 8. Optional Safe Zone Guides Overlay (ONLY for simulator inspection, never in exported PNG)
  if (showSafeZones) {
    drawMobileSafeZoneOverlay(ctx);
  }
}

function drawMobileSafeZoneOverlay(ctx) {
  ctx.save();
  // Top 28% Safe Zone (0 -> 783px)
  ctx.fillStyle = 'rgba(56, 217, 169, 0.14)';
  ctx.fillRect(0, 0, MOBILE_W, 783);
  ctx.strokeStyle = '#38D9A9';
  ctx.lineWidth = 3;
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.moveTo(0, 783);
  ctx.lineTo(MOBILE_W, 783);
  ctx.stroke();

  // Bottom 16.2% Safe Zone (2342 -> 2796px)
  ctx.fillStyle = 'rgba(56, 217, 169, 0.14)';
  ctx.fillRect(0, 2342, MOBILE_W, MOBILE_H - 2342);
  ctx.beginPath();
  ctx.moveTo(0, 2342);
  ctx.lineTo(MOBILE_W, 2342);
  ctx.stroke();

  // Side 72px Safe Margins
  ctx.fillStyle = 'rgba(255, 77, 26, 0.10)';
  ctx.fillRect(0, 783, 72, 2342 - 783);
  ctx.fillRect(MOBILE_W - 72, 783, 72, 2342 - 783);
  ctx.setLineDash([]);

  // Labels
  ctx.font = `700 26px ${FONTS.mono}`;
  ctx.fillStyle = '#38D9A9';
  ctx.textAlign = 'center';
  ctx.fillText('TOP SAFE ZONE: 28% (0–783px) · OS CLOCK & WIDGETS', MOBILE_W / 2, 712);
  ctx.fillText('BOTTOM SAFE ZONE: 16.2% (2342–2796px) · FLASHLIGHT / CAMERA / HOME BAR', MOBILE_W / 2, 2406);
  ctx.restore();
}
