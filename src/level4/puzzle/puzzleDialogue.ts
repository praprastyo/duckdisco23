export const CORRECT_REACTIONS = [
  "Aha! The ancient duck scroll agrees.",
  "Correct. Suspiciously correct.",
  "Excellent! You may proceed.",
  "You remembered that? Impressive.",
  "The artifact vibrates with pure approval!",
];

export const WRONG_REACTIONS = [
  "The artifact says... absolutely not.",
  "Hmm. The ancient duck spirits disagree.",
  "That answer belongs in a different timeline.",
  "Careful. The ruins are judging you.",
  "A false inscription! Try once more.",
];

export const LEAD_IN_PHRASES = [
  "Hmm... I've been thinking about something.",
  "The duck scroll mentions a curious detail:",
  "Let me consult my expedition notes...",
  "The ancient artifacts pose this riddle:",
  "Now, think back carefully on this one:",
  "A classic mystery from the archives:",
];

export function getLeadInPhrase(idx: number): string {
  return LEAD_IN_PHRASES[idx % LEAD_IN_PHRASES.length];
}

export function getRandomReaction(type: 'correct' | 'wrong'): string {
  const pool = type === 'correct' ? CORRECT_REACTIONS : WRONG_REACTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}
