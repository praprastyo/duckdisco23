import { typingStoryLines } from './typingStory';

export const TOTAL_STORY_CHARS = typingStoryLines.reduce((acc, line) => acc + line.length, 0);

export function calculateWpm(correctChars: number, elapsedMinutes: number): number {
  if (elapsedMinutes <= 0.001) return 0;
  return Math.round((correctChars / 5) / elapsedMinutes);
}

export interface TypingCheckResult {
  isCorrectChar: boolean;
  isLineFinished: boolean;
  needsEnterCommit: boolean;
  mistakeRegistered: boolean;
}

export class TypingEngine {
  public static totalLines = typingStoryLines.length;

  public static getLine(index: number): string {
    return typingStoryLines[index] || '';
  }

  public static testInput(
    currentLineText: string,
    currentInput: string,
    nextChar: string
  ): {
    accepted: boolean;
    mistake: boolean;
    isLineComplete: boolean;
  } {
    const expectedChar = currentLineText[currentInput.length];
    if (nextChar === expectedChar) {
      const isComplete = currentInput.length + 1 === currentLineText.length;
      return { accepted: true, mistake: false, isLineComplete: isComplete };
    }
    // Wrong character -> counts as mistake
    return { accepted: false, mistake: true, isLineComplete: false };
  }
}
