# Implementation Plan

## [Overview]
Build the complete final level (Level 4) of the Disco Duck web experience, providing a connected ballroom hub finale featuring three independent mini-games, persistent unlock progression, a 3D gift box reveal, and a duck-themed celebratory letter.

The experience is centered in a 2D pixel-art disco ballroom where the player interacts with three distinct duck NPCs (Typing Duck, Puzzle Duck, Cowboy Duck) in any order. Completing each mini-game unlocks one of three gem locks on the central ballroom pedestal. When all three are cleared, the pedestal activates, transitioning the player to a dark 3D spotlight scene where a textured gift box opens with particle effects to reveal an envelope that unfolds into a readable 2D romantic/humorous letter.

A central `AudioManager` maintains uninterrupted ballroom disco music across scene transitions with smooth volume ducking (1.0 in hub, 0.25 in mini-games, 0.8 in reveal), while procedural Web Audio synthesizers provide typewriter clicks, retro RPG blips, and cartoon target hit SFX with zero external audio asset dependencies.

---

## [Types]
Type system specifications located in `src/level4/types/level4Types.ts`:
- `Level4Scene`: `'splash' | 'ballroom' | 'typing' | 'puzzle' | 'shooter' | 'giftReveal' | 'letter'`
- `DuckNpcId`: `'typing' | 'puzzle' | 'cowboy'`
- `GameProgress`: typing, puzzle, shooter completion booleans
- `Level4SaveData`: progress, gift unlocked/opened flags, high scores
- `TypingRaceState`: lines, player input, mistakes (max 3), WPM, AI progress, Enter commit
- `PuzzleState`: 10 Indonesian questions, answer normalization, 3 mistakes limit
- `ShooterGameState`: 60s timer, targets (bottles +1, cocktail/poop/cactus -1), Cowboy AI (85% accuracy)
- `GiftTexturesConfig` & `FinalLetterConfig`: 6-face box images with procedural canvas fallbacks, scrollable letter

---

## [Files]
New files:
- `src/level4/Level4.tsx`: Root coordinator
- `src/level4/types/level4Types.ts`: Types
- `src/level4/config/level4Config.ts`: Configurations
- `src/level4/audio/AudioManager.ts`: Music ducking & procedural SFX
- `src/level4/ballroom/BallroomEntrance.tsx`: Doors splash screen
- `src/level4/ballroom/DuckNpc.tsx`: Procedural pixel duck renderer & PNG slot
- `src/level4/ballroom/GiftPedestal.tsx`: 3-lock pedestal
- `src/level4/ballroom/BallroomHub.tsx`: 2D disco ballroom hub
- `src/level4/typing/typingStory.ts`: ~600 words story
- `src/level4/typing/TypingEngine.ts`: Typing validation
- `src/level4/typing/TypingDuckAI.ts`: AI typing simulation
- `src/level4/typing/TypingBattle.tsx`: Typing mini-game UI
- `src/level4/puzzle/puzzleQuestions.ts`: 10 questions dataset & normalization
- `src/level4/puzzle/puzzleDialogue.ts`: NPC dialogue lines
- `src/level4/puzzle/PuzzleGame.tsx`: Retro RPG Q&A modal
- `src/level4/shooter/targetConfig.ts`: Target definitions & trajectory curves
- `src/level4/shooter/ShooterEngine.ts`: Physics & collision loop
- `src/level4/shooter/CowboyDuckAI.ts`: 85% accuracy Cowboy AI
- `src/level4/shooter/ShooterGame.tsx`: 60s bar shooting gallery UI
- `src/level4/reveal/GiftBox.ts`: Three.js box with 6 face textures
- `src/level4/reveal/GiftReveal3D.tsx`: Spotlight 3D scene & lid opening
- `src/level4/reveal/LetterReveal.tsx`: 2D letter panel
- `src/level4/debug/Level4DebugMenu.tsx`: DevMode bypass and controls

Files to modify:
- `src/pages/GamePage.tsx`: Route `level4` to `Level4.tsx`
- `src/services/SaveService.ts`: Persist `Level4SaveData`
- `src/config/levels.ts`: Update Level 4 config
