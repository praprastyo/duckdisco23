import { GiftDimensions, GiftTexturesConfig, FinalLetterConfig, DuckNpcId, DuckNpcVariant } from '../types/level4Types';

export const LEVEL4_AUDIO_CONFIG = {
  ballroomSoundtrack: '/audio/level-4-ballroom.mp3',
  ballroomFallback: '/audio/level-4.mp3',
  volume: {
    hub: 1.0,
    minigame: 0.25,
    reveal: 0.75,
  },
  fadeDurationMs: 600,
};

export const DEFAULT_GIFT_DIMENSIONS: GiftDimensions = {
  width: 2.4,
  height: 1.5,
  depth: 2.0,
};

export const DEFAULT_GIFT_TEXTURES: GiftTexturesConfig = {
  front: '/textures/gift/front.jpeg',
  back: '/textures/gift/back.jpeg',
  left: '/textures/gift/left.jpeg',
  right: '/textures/gift/right.jpeg',
  top: '/textures/gift/top.jpeg',
  bottom: '/textures/gift/bottom.jpeg',
};

export const FINAL_LETTER_DEFAULT: FinalLetterConfig = {
  title: 'Happy 27th Birthday, Widut! 🎂',
  subtitle: 'Surat Spesial Dari Punyo',
  paragraphs: [
    'Pagi, siang, sore atau malam dimanapun kamu berada widut. Makasih banyak dan selamat udh bisa nyelesain gamenya, punyo seneng banget.',
    'Ini surat dibuat buat kamu yang baru ultah ke 27, ga tau kenapa punyo seneng banget kalo tiap ulang tahun bisa ngasih game ke widut yang pendek itu.',
    'Pesennya buat umur ke 27 ini semoga makin cantik, semoga sehat terus, semoga punyo makin ganteng, semoga nupet bisa sekola. Widut yang udah umur 27 ini harusnya bisa makin tinggi kayak punyo.',
    'Oia jangan lupa lanjut lagi HSK 5 supaya nanti dapet beasiswa lebih gampang makin cepet pergi ke china nya, karna widut cita-citanya jadi chindo kan ya. Semoga apa yang dipengenin widut bisa punyo usahakan.',
  ],
  signature: 'Salam hangat — Suamimu tercinta, Punyo 💖',
};
export function getNpcSpritePath(npcId: DuckNpcId, variant: DuckNpcVariant): string {
  // 1. Idle -> idle.png
  // 2. Type/Look/Aim -> type.png / look.png / aim.png
  // 3. Talk/Shoot -> talk.png / shoot.png
  // 4. Dance -> dance.png
  // 5. Win -> win.png
  // 6. Lose -> lose.png
  let filename: string = variant;
  if (variant === 'type' && npcId !== 'typing') filename = npcId === 'puzzle' ? 'look' : 'aim';
  if (variant === 'shoot' && npcId !== 'cowboy') filename = 'talk';
  if (variant === 'happy') filename = 'happy';
  return `/assets/npc/${npcId}/${filename}.png`;
}

