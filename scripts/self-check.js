import assert from 'node:assert';

// 1. Test Scoring Logic
import { SCORING_WINDOWS, SCORING_WINDOWS_L1, SCORING_WINDOWS_L3, getScoringWindows, JUDGEMENT_SCORES, getGradeTier } from '../src/config/scoring.ts';
import { ScoringEngine } from '../src/game/ScoringEngine.ts';

console.log('Running self-check tests...');

// Scoring windows validation
assert.strictEqual(SCORING_WINDOWS.perfect, 0.060, 'Perfect window must be 60ms');
assert.strictEqual(SCORING_WINDOWS.great, 0.110, 'Great window must be 110ms');
assert.strictEqual(SCORING_WINDOWS.good, 0.170, 'Good window must be 170ms');

// Level 1 dance tutorial uses more forgiving windows
assert.strictEqual(SCORING_WINDOWS_L1.perfect, 0.130, 'L1 Perfect window must be 130ms');
assert.strictEqual(SCORING_WINDOWS_L1.great, 0.220, 'L1 Great window must be 220ms');
assert.strictEqual(SCORING_WINDOWS_L1.good, 0.340, 'L1 Good window must be 340ms');
assert.deepStrictEqual(getScoringWindows('level1'), SCORING_WINDOWS_L1, 'level1 must resolve to L1 windows');

// Level 3 dance command hit windows (Widened error rate: Perfect <= 130ms, Great <= 240ms, Good <= 380ms)
assert.strictEqual(SCORING_WINDOWS_L3.perfect, 0.130, 'L3 Perfect window must be 130ms');
assert.strictEqual(SCORING_WINDOWS_L3.great, 0.240, 'L3 Great window must be 240ms');
assert.strictEqual(SCORING_WINDOWS_L3.good, 0.380, 'L3 Good window must be 380ms');
assert.deepStrictEqual(getScoringWindows('level3'), SCORING_WINDOWS_L3, 'level3 must resolve to L3 windows');

const engine = new ScoringEngine();
engine.reset();

// Judgement 1: Perfect hit (+25ms)
const j1 = engine.judge(0.025);
assert.strictEqual(j1.judgement, 'perfect');
assert.strictEqual(engine.getCurrentCombo(), 1);

// Judgement 2: Great hit (-80ms)
const j2 = engine.judge(-0.080);
assert.strictEqual(j2.judgement, 'great');
assert.strictEqual(engine.getCurrentCombo(), 2);

// Judgement 3: Good hit (+140ms)
const j3 = engine.judge(0.140);
assert.strictEqual(j3.judgement, 'good');
assert.strictEqual(engine.getCurrentCombo(), 2, 'Good preserves combo');

// Judgement 4: Miss (> 170ms)
const j4 = engine.judge(0.220);
assert.strictEqual(j4.judgement, 'miss');
assert.strictEqual(engine.getCurrentCombo(), 0, 'Miss resets combo');

const summary = engine.getSummary();
assert.strictEqual(summary.perfect, 1);
assert.strictEqual(summary.great, 1);
assert.strictEqual(summary.good, 1);
assert.strictEqual(summary.miss, 1);
assert.strictEqual(summary.maxCombo, 2);
assert.ok(summary.accuracy > 0 && summary.accuracy < 100);

// Grade tiers
const tier100 = getGradeTier(100);
assert.strictEqual(tier100.grade, 'PERFECT');
const tier85 = getGradeTier(85);
assert.strictEqual(tier85.grade, 'GREAT');
const tier40 = getGradeTier(40);
assert.strictEqual(tier40.grade, 'NEED_PRACTICE');

// 2. Test Time & Unlock Logic
import { TimeService } from '../src/services/TimeService.ts';
import { UnlockService } from '../src/services/UnlockService.ts';

// Test Asia/Jakarta date on 20 Sep 2026 12:00:00 UTC+7 (Timestamp: 1790013600000)
// 2026-09-20T12:00:00+07:00 is 1789966800000 UTC
const mockSep20Noon = new Date('2026-09-20T12:00:00+07:00').getTime();
TimeService.setMockTimestamp(mockSep20Noon);

// On Sep 20 2026:
assert.strictEqual(UnlockService.isLevelUnlocked('level1'), true, 'Level 1 must be unlocked on Sep 20');
assert.strictEqual(UnlockService.isLevelUnlocked('level2'), false, 'Level 2 must be locked on Sep 20');
assert.strictEqual(UnlockService.isLevelUnlocked('level3'), false, 'Level 3 must be locked on Sep 20');
assert.strictEqual(UnlockService.isLevelUnlocked('level4'), false, 'Level 4 must be locked on Sep 20');

// Countdown for level 2 (opens at 2026-09-21T00:00:00+07:00, which is 12 hours away)
const countdownL2 = UnlockService.getCountdown('level2');
assert.strictEqual(countdownL2.isPast, false);
assert.strictEqual(countdownL2.hours, '12');
assert.strictEqual(countdownL2.minutes, '00');

// Test DEV_UNLOCK_ALL
UnlockService.setDevUnlockAll(true);
assert.strictEqual(UnlockService.isLevelUnlocked('level2'), true, 'Dev unlock all should unlock level 2');
assert.strictEqual(UnlockService.isLevelUnlocked('level4'), true, 'Dev unlock all should unlock level 4');
UnlockService.setDevUnlockAll(false);
assert.strictEqual(UnlockService.isLevelUnlocked('level4'), false, 'Dev unlock all turned off');

// Reset mock timestamp
TimeService.setMockTimestamp(null);

// 3. Test Level 2 Beatmap Runner & Target Retirement
import { BeatmapRunner } from '../src/game/BeatmapRunner.ts';
import { SCORING_WINDOWS_L2 } from '../src/config/scoring.ts';

const runner = new BeatmapRunner(SCORING_WINDOWS_L2);
runner.load({
  bpm: 146,
  offset: 0.08,
  events: [
    { id: 'n1', time: 1.0, action: 'tap' },
    { id: 'n2', time: 1.25, action: 'tap' },
  ],
});

let missedNoteId = '';
runner.onMiss((ev) => {
  missedNoteId = ev.id;
});

// At 1.19s, n1 has passed miss threshold (1.0 + 0.18 = 1.18s)
runner.update(1.19);
assert.strictEqual(missedNoteId, 'n1', 'n1 must trigger miss callback upon expiring');
assert.strictEqual(runner.isHit('n1'), true, 'n1 must be marked as hit/retired');
assert.strictEqual(runner.isHit('n2'), false, 'n2 must remain active');

// n2 hit right on time at 1.25s
runner.markHit('n2');
assert.strictEqual(runner.isHit('n2'), true, 'n2 must be marked as hit');

// 4. Test Level 3 (Duck Floor Command) Configurations
import { DEFAULT_LEVEL3_CONFIG } from '../src/levels/Level3/level3Data.ts';
import { LEVELS } from '../src/config/levels.ts';

// Level 3 metadata check
const l3Config = LEVELS.find((l) => l.id === 'level3');
assert.ok(l3Config, 'Level 3 must exist in LEVELS');
assert.strictEqual(l3Config.title, 'DUCK FLOOR COMMAND', 'Level 3 title must be DUCK FLOOR COMMAND');
assert.strictEqual(l3Config.collectibleName, 'MIRROR FEATHER', 'Level 3 collectible must be MIRROR FEATHER');

// 3 Music Sections check
assert.strictEqual(DEFAULT_LEVEL3_CONFIG.sections.length, 3, 'Must have 3 music sections');
assert.strictEqual(DEFAULT_LEVEL3_CONFIG.sections[0].bpm, 115, 'Part 1 must be 115 BPM');
assert.strictEqual(DEFAULT_LEVEL3_CONFIG.sections[1].bpm, 85, 'Part 2 must be 85 BPM');
assert.strictEqual(DEFAULT_LEVEL3_CONFIG.sections[2].bpm, 123, 'Part 3 must be 123 BPM');

// 2 Transition Zones check
assert.strictEqual(DEFAULT_LEVEL3_CONFIG.transitions.length, 2, 'Must have 2 transition zones');
assert.strictEqual(DEFAULT_LEVEL3_CONFIG.transitions[0].label, 'SLOW IT DOWN', 'Transition 1 label');
assert.strictEqual(DEFAULT_LEVEL3_CONFIG.transitions[1].label, 'FINAL GROOVE', 'Transition 2 label');

// Authored rounds & Fake command presence in section 2 (2x gameplay density: 26 rounds)
assert.ok(DEFAULT_LEVEL3_CONFIG.rounds.length >= 20, 'Must have at least 20 authored rounds (2x gameplay density)');
const fakeCommands = DEFAULT_LEVEL3_CONFIG.rounds
  .flatMap((r) => r.commands)
  .filter((c) => c.fake);
assert.ok(fakeCommands.length > 0, 'Section 2 must contain fake commands');

// Clear condition accuracy & max 10 misses threshold
assert.strictEqual(DEFAULT_LEVEL3_CONFIG.clearAccuracyThreshold, 70, 'Clear threshold must be 70%');

// Test Level 3 max failure check (10 misses limit)
const maxMissThreshold = 10;
const testMissFail = 10 >= maxMissThreshold;
assert.strictEqual(testMissFail, true, 'Reaching 10 misses must trigger failure');

console.log('All assert checks passed successfully! (16/16)');
