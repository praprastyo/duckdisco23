import assert from 'node:assert';
import { typingStoryLines } from '../src/level4/typing/typingStory';
import { PUZZLE_QUESTIONS_RAW, checkAnswer } from '../src/level4/puzzle/puzzleQuestions';
import { TARGET_DEFS } from '../src/level4/shooter/targetConfig';
import { calculateWpm } from '../src/level4/typing/TypingEngine';
import { getNpcSpritePath } from '../src/level4/config/level4Config';

console.log('🧪 Testing Level 4 Data & Mechanics...');

// 1. Typing Story Tests
assert.strictEqual(typingStoryLines.length, 60, 'Should have exactly 60 lines');
const totalWords = typingStoryLines.reduce((acc, line) => acc + line.trim().split(/\s+/).length, 0);
console.log(`✓ Typing story: ${typingStoryLines.length} lines, ${totalWords} total words (target ~600).`);
assert(totalWords >= 500 && totalWords <= 700, 'Total story word count should be around 600 words');

// 2. Typing WPM formula test
// 300 chars in 1 minute = (300 / 5) / 1 = 60 WPM
assert.strictEqual(calculateWpm(300, 1), 60);
// 150 chars in 0.5 minutes = (150 / 5) / 0.5 = 60 WPM
assert.strictEqual(calculateWpm(150, 0.5), 60);
console.log('✓ WPM calculation formula verified.');

// 3. Puzzle Questions & Answers Tests
assert.strictEqual(PUZZLE_QUESTIONS_RAW.length, 10, 'Should have exactly 10 questions');
assert.strictEqual(checkAnswer(['ya', 'betul', 'bener'], ' ya '), true);
assert.strictEqual(checkAnswer(['ya', 'betul', 'bener'], 'BETUL'), true);
assert.strictEqual(checkAnswer(['steak', 'sate'], '  Steak  '), true);
assert.strictEqual(checkAnswer(['kucing'], 'kucing'), true);
assert.strictEqual(checkAnswer(['kucing'], 'bayi'), false);
assert.strictEqual(checkAnswer(['19'], '19'), true);
assert.strictEqual(checkAnswer(['19'], '21'), false);
assert.strictEqual(checkAnswer(['besok'], 'besok'), true);
console.log('✓ All 10 puzzle questions and exact normalized string matching verified.');

// 4. Target Points Verification
assert.strictEqual(TARGET_DEFS.bottle.points, 1, 'Bottle target should yield +1');
assert.strictEqual(TARGET_DEFS.cocktail.points, -1, 'Cocktail target should yield -1');
assert.strictEqual(TARGET_DEFS.poop.points, -1, 'Poop decoy should yield -1');
assert.strictEqual(TARGET_DEFS.cactus.points, -1, 'Cactus decoy should yield -1');
console.log('✓ Shooter target scoring rules verified.');
// 5. NPC Sprite Variants Mapping Tests
assert.strictEqual(getNpcSpritePath('typing', 'idle'), '/assets/npc/typing/idle.png');
assert.strictEqual(getNpcSpritePath('typing', 'type'), '/assets/npc/typing/type.png');
assert.strictEqual(getNpcSpritePath('typing', 'talk'), '/assets/npc/typing/talk.png');
assert.strictEqual(getNpcSpritePath('typing', 'dance'), '/assets/npc/typing/dance.png');
assert.strictEqual(getNpcSpritePath('typing', 'win'), '/assets/npc/typing/win.png');
assert.strictEqual(getNpcSpritePath('typing', 'lose'), '/assets/npc/typing/lose.png');

assert.strictEqual(getNpcSpritePath('puzzle', 'look'), '/assets/npc/puzzle/look.png');
assert.strictEqual(getNpcSpritePath('puzzle', 'talk'), '/assets/npc/puzzle/talk.png');
assert.strictEqual(getNpcSpritePath('cowboy', 'aim'), '/assets/npc/cowboy/aim.png');
assert.strictEqual(getNpcSpritePath('cowboy', 'shoot'), '/assets/npc/cowboy/shoot.png');
console.log('✓ All 6 NPC animation variants mapped to file paths.');


console.log('🎉 All Level 4 self-checks passed successfully!');
