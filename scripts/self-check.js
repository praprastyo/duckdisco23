import assert from 'node:assert';

// 1. Test Scoring Logic
import { SCORING_WINDOWS, SCORING_WINDOWS_L1, getScoringWindows, JUDGEMENT_SCORES, getGradeTier } from '../src/config/scoring.ts';
import { ScoringEngine } from '../src/game/ScoringEngine.ts';

console.log('Running self-check tests...');

// Scoring windows validation
assert.strictEqual(SCORING_WINDOWS.perfect, 0.060, 'Perfect window must be 60ms');
assert.strictEqual(SCORING_WINDOWS.great, 0.110, 'Great window must be 110ms');
assert.strictEqual(SCORING_WINDOWS.good, 0.170, 'Good window must be 170ms');

// Level 1 dance tutorial uses more forgiving windows
assert.strictEqual(SCORING_WINDOWS_L1.perfect, 0.080, 'L1 Perfect window must be 80ms');
assert.strictEqual(SCORING_WINDOWS_L1.great, 0.160, 'L1 Great window must be 160ms');
assert.strictEqual(SCORING_WINDOWS_L1.good, 0.250, 'L1 Good window must be 250ms');
assert.deepStrictEqual(getScoringWindows('level1'), SCORING_WINDOWS_L1, 'level1 must resolve to L1 windows');
assert.deepStrictEqual(getScoringWindows('level3'), SCORING_WINDOWS, 'level3 must resolve to default windows');

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

console.log('All assert checks passed successfully! (10/10)');
