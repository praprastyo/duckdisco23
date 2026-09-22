export const CORRECT_REACTIONS = [
  "Of course! The ancient clues agree.",
  "Correct. Suspiciously correct.",
  "Spot on. Impressive memory.",
  "Aha! Exactly as written in the scrolls.",
  "Excellent! You remembered that.",
];

export const WRONG_REACTIONS = [
  "Hmm... My notes strongly disagree.",
  "Are you sure about that?",
  "The ancient artifact disagrees with that answer.",
  "Careful. Think back carefully.",
  "That answer belongs in a different timeline.",
];

export const LEAD_IN_PHRASES = [
  "Let's start with something simple.",
  "Hmm... I've been thinking about something.",
  "Let me consult my expedition notes:",
  "Now, think back carefully on this one:",
  "The duck scroll mentions a curious detail:",
  "A classic mystery from the archives:",
];

export function getLeadInPhrase(idx: number): string {
  return LEAD_IN_PHRASES[idx % LEAD_IN_PHRASES.length];
}

export function getRandomReaction(type: 'correct' | 'wrong'): string {
  const pool = type === 'correct' ? CORRECT_REACTIONS : WRONG_REACTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

