export const PRESETS = {
  career: {
    id: 'career',
    name: 'Career & Portfolio Launch',
    subtitle: '30-Day Backward Plan · Flagship',
    flightCode: 'BP-2027',
    originCode: 'NOW',
    originLabel: 'NOV 23',
    destCode: '2027',
    destLabel: 'DEC 23',
    gate: 'G-27',
    seat: '01A',
    missionTitle: 'CAREER & PORTFOLIO LAUNCH',
    startDate: '2026-11-23',
    targetDate: '2026-12-23',
    activeIndex: 0,
    milestones: [
      {
        tMinus: 'T-30',
        date: 'NOV 23',
        title: 'Lock scope & target list',
        detail: 'Define measurable launch goal, 15 target roles, and backward calendar with Gemini.',
        doneCriteria: 'Shortlist of 15 roles + 3 flagship case studies selected.',
        status: 'active',
      },
      {
        tMinus: 'T-24',
        date: 'NOV 29',
        title: 'Ship core draft v1',
        detail: 'Publish working v1 of portfolio, tailored resume, and flagship project write-ups.',
        doneCriteria: 'Live URL + ATS-ready 1-page resume draft complete.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-18',
        date: 'DEC 05',
        title: 'Audit & tighten proof',
        detail: 'Run critical Gemini review: quantify metrics, sharpen stories, and cut visual friction.',
        doneCriteria: 'Every bullet has measurable impact; zero broken links.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-12',
        date: 'DEC 11',
        title: 'Dry run & stress-test',
        detail: 'Run 2 timed mock interviews and collect peer feedback on portfolio clarity.',
        doneCriteria: '60-second pitch + 3 behavioral stories rehearsed.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-06',
        date: 'DEC 17',
        title: 'Final polish & freeze',
        detail: 'Freeze major edits; finalize outreach templates, LinkedIn, and Handshake profile.',
        doneCriteria: 'All profiles synced; outreach batch pre-drafted.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-00',
        date: 'DEC 23',
        title: 'BOARDING · LAUNCH DAY',
        detail: 'Submit priority applications and publish portfolio with 24h safety buffer.',
        doneCriteria: 'First wave of tailored applications live.',
        status: 'destination',
      },
    ],
  },
  capstone: {
    id: 'capstone',
    name: 'Finals & Capstone Sprint',
    subtitle: '25-Day Academic Sprint',
    flightCode: 'CS-499',
    originCode: 'NOV',
    originLabel: 'NOV 23',
    destCode: 'FIN',
    destLabel: 'DEC 18',
    gate: 'A-18',
    seat: '04F',
    missionTitle: 'CAPSTONE & FINALS SPRINT',
    startDate: '2026-11-23',
    targetDate: '2026-12-18',
    activeIndex: 0,
    milestones: [
      {
        tMinus: 'T-25',
        date: 'NOV 23',
        title: 'Map rubric & study plan',
        detail: 'Break down syllabus weights and capstone rubric with Gemini into daily blocks.',
        doneCriteria: 'Weighted study & build schedule locked.',
        status: 'active',
      },
      {
        tMinus: 'T-20',
        date: 'NOV 28',
        title: 'Freeze core feature build',
        detail: 'Complete end-to-end working prototype and core data pipeline.',
        doneCriteria: 'Happy path runs cleanly from start to finish.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-15',
        date: 'DEC 03',
        title: 'Draft report & figures',
        detail: 'Write methodology, results tables, and clean visual diagrams.',
        doneCriteria: 'Full 1st draft ready for advisor feedback.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-10',
        date: 'DEC 08',
        title: 'Timed practice exams',
        detail: 'Complete two full past-exam simulations under real time limits.',
        doneCriteria: 'Weakest 2 topics identified and patched.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-04',
        date: 'DEC 14',
        title: 'Slide deck & rehearsal',
        detail: 'Finalize 8-minute capstone demo deck and record backup video.',
        doneCriteria: 'Zero live-demo single points of failure.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-00',
        date: 'DEC 18',
        title: 'SUBMIT & DEFEND',
        detail: 'Upload final repository, PDF report, and deliver capstone presentation.',
        doneCriteria: 'Submission receipt confirmed 4h early.',
        status: 'destination',
      },
    ],
  },
  newyear: {
    id: 'newyear',
    name: '2027 New Year Launchpad',
    subtitle: '39-Day Year-End Reset',
    flightCode: 'NY-2027',
    originCode: '2026',
    originLabel: 'NOV 23',
    destCode: '2027',
    destLabel: 'JAN 01',
    gate: 'T-01',
    seat: '12A',
    missionTitle: '2027 PERSONAL LAUNCHPAD',
    startDate: '2026-11-23',
    targetDate: '2027-01-01',
    activeIndex: 0,
    milestones: [
      {
        tMinus: 'T-39',
        date: 'NOV 23',
        title: 'Audit 2026 wins & gaps',
        detail: 'Run a 20-minute Gemini retrospective to extract top 3 lessons and drop dead weight.',
        doneCriteria: '3 clear 2027 pillars defined.',
        status: 'active',
      },
      {
        tMinus: 'T-31',
        date: 'DEC 01',
        title: 'Close open loops',
        detail: 'Clear lingering admin, finances, and unfinished tasks before December peaks.',
        doneCriteria: 'Inbox & open commitments cleared.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-23',
        date: 'DEC 09',
        title: 'Build Q1 habit system',
        detail: 'Design realistic weekly routines, cues, and Gemini daily check-ins.',
        doneCriteria: 'Calendar blocks + habit tracker live.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-15',
        date: 'DEC 17',
        title: 'Ship one 2026 artifact',
        detail: 'Finish and publish one meaningful personal project before the year ends.',
        doneCriteria: 'Public link or completed artifact shipped.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-07',
        date: 'DEC 25',
        title: 'Rest & review Q1 map',
        detail: 'Unplug, recharge, and sanity-check Week 1 priorities for January.',
        doneCriteria: 'Jan 2–8 top 3 tasks pre-scheduled.',
        status: 'upcoming',
      },
      {
        tMinus: 'T-00',
        date: 'JAN 01',
        title: 'DEPARTURE · 2027',
        detail: 'Start Day 1 already in motion with zero January guesswork.',
        doneCriteria: 'First morning ritual completed.',
        status: 'destination',
      },
    ],
  },
};

export function formatShortDate(isoDate) {
  if (!isoDate) return 'TBD';
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dt = new Date(Date.UTC(y, m - 1, d));
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${months[dt.getUTCMonth()]} ${String(dt.getUTCDate()).padStart(2, '0')}`;
}

export function diffDays(fromIso, toIso) {
  if (!fromIso || !toIso) return 30;
  const [y1, m1, d1] = fromIso.split('-').map(Number);
  const [y2, m2, d2] = toIso.split('-').map(Number);
  const t1 = Date.UTC(y1, m1 - 1, d1);
  const t2 = Date.UTC(y2, m2 - 1, d2);
  return Math.max(0, Math.round((t2 - t1) / 86400000));
}

export function recalculateTimelineDates(state) {
  const totalDays = Math.max(5, diffDays(state.startDate, state.targetDate));
  const [sy, sm, sd] = state.startDate.split('-').map(Number);
  const startUtc = Date.UTC(sy, sm - 1, sd);
  const count = state.milestones.length;

  state.originLabel = formatShortDate(state.startDate);
  state.destLabel = formatShortDate(state.targetDate);

  state.milestones.forEach((m, idx) => {
    const ratio = count > 1 ? idx / (count - 1) : 1;
    const offsetDays = Math.round(ratio * totalDays);
    const remaining = Math.max(0, totalDays - offsetDays);
    const dt = new Date(startUtc + offsetDays * 86400000);
    const iso = dt.toISOString().slice(0, 10);
    m.tMinus = `T-${String(remaining).padStart(2, '0')}`;
    m.date = formatShortDate(iso);
  });
}

export function buildGeminiPrompts(state) {
  const totalDays = diffDays(state.startDate, state.targetDate);
  const active = state.milestones[state.activeIndex] || state.milestones[0];
  const milestoneList = state.milestones
    .map((m, i) => `${i + 1}. ${m.tMinus} (${m.date}) — ${m.title}`)
    .join('\n');

  return {
    backwardPlan: `You are my strategic launch planner. My target deadline is "${state.missionTitle}" on ${state.destLabel} (${state.targetDate}), which is ${totalDays} days from ${state.originLabel} (${state.startDate}).

Work backward from ${state.targetDate} and create a realistic 6-milestone flight plan:
- Format each milestone as: T-XX Days | Short Date | 3–5 Word Lock-Screen Action | Concrete Deliverable | 1-line "Definition of Done"
- Space milestones evenly from T-${totalDays} to T-00 so they fit cleanly in chronological order on a phone lock screen.
- Build a 24-hour safety buffer before launch day and flag the single highest-risk bottleneck I should eliminate first.`,

    multimodalDesign: `Design a Swiss-aviation inspired "Boarding Pass to Launch" countdown lock screen wallpaper (9:19.5 aspect ratio, 1290x2796 px) for my deadline "${state.missionTitle}" (${state.originLabel} → ${state.destLabel}, T-${totalDays} Days).

Strict layout & safe-zone rules:
1. Top 28% (0–783 px): Clean, dark matte negative space (#07090C) with ZERO text or clutter so the native iOS/Android clock, date, and lock screen widgets sit cleanly as the boarding pass's "LOCAL TIME" display.
2. Perforated tear line with semicircular ticket notches at 28% height separating the clock header from the ticket body.
3. Active middle zone (29%–82%): High-contrast tabular monospace countdowns (T-XX), vertical flight-path progress rail with international orange (#FF4D1A) active marker, and these 6 chronological milestones:
${milestoneList}
4. Bottom 17% (83%–100%): Completely clear of text so flashlight, camera, notifications, and home indicator never overlap.
5. Style: Dieter Rams / Swiss editorial minimalism, ultra-crisp legibility at a 2-second glance.`,

    dailyReminders: `Set up a Gemini Scheduled Action for my "${state.missionTitle}" countdown (target date: ${state.targetDate}):

1. DAILY 8:30 AM CHECK-IN (every day until ${state.targetDate}):
"Calculate my exact T-XX days remaining until ${state.targetDate}. Identify my current active milestone (currently: ${active.tMinus} · ${active.title}) and give me ONE concrete 25-minute micro-task I can complete before noon, plus a 1-sentence progress nudge."

2. MILESTONE GATE AUDIT (every 6 days at 7:00 PM):
"Ask me whether I met the Definition of Done for my current milestone. If I am behind, automatically re-balance the remaining milestones toward ${state.targetDate} without slipping the final deadline."

3. FINAL COUNTDOWN LOCK (T-3, T-2, T-1 at 9:00 AM):
"Send a concise 5-point pre-flight verification checklist so I launch on ${state.destLabel} with zero last-minute errors."`,
  };
}
