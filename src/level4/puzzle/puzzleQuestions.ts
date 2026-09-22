import { PuzzleQuestion } from '../types/level4Types';

export const PUZZLE_QUESTIONS_RAW: PuzzleQuestion[] = [
  {
    id: 1,
    question: "Apakah punyo ganteng dan tinggi?",
    answers: ["ya", "betul", "bener"],
  },
  {
    id: 2,
    question: "Apakah punyo suami widut?",
    answers: ["ya", "betul", "bener"],
  },
  {
    id: 3,
    question: "Punyo suka makan apa?",
    answers: ["steak", "sate"],
  },
  {
    id: 4,
    question: "Nupet itu kucing atau bayi?",
    answers: ["kucing"],
  },
  {
    id: 5,
    question: "9+10?",
    answers: ["19"],
  },
  {
    id: 6,
    question: "Kapan punyo pernah marah?",
    answers: ["ga pernah", "ga"],
  },
  {
    id: 7,
    question: "Tempat di bandung yang punyo suka?",
    answers: ["lembang"],
  },
  {
    id: 8,
    question: "Iga Bakar?",
    answers: ["si jangkung"],
  },
  {
    id: 9,
    question: "Sepertinya?",
    answers: ["sama"],
  },
  {
    id: 10,
    question: "Kapan punyo ngurus KK?",
    answers: ["besok"],
  },
];

export function shuffleQuestions(questions: PuzzleQuestion[]): PuzzleQuestion[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function checkAnswer(expectedAnswers: string[], rawInput: string): boolean {
  const normalized = rawInput.trim().toLowerCase();
  return expectedAnswers.some((ans) => ans.trim().toLowerCase() === normalized);
}
