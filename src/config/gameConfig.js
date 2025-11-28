// src/config/gameConfig.js - UPDATED TIMING
export const GAME_CONFIG = {
  // Game Settings
  TOTAL_ROUNDS: 3,
  CHECKING_DELAY: 3000, // 3 seconds for checking phase
  RESULT_DISPLAY_TIME: 4000,

  // Animation Settings - REDUCED FOR BETTER FLOW
  ANIMATION_DURATION: 9000, // 3 seconds for animation
  AUTO_NEXT_ROUND_DELAY: 2000,
  CHECKING_DURATION: 2000,

  CHOICES: {
    DEAD: 'dead',
    ALIVE: 'alive'
  },

  RESULTS: {
    WIN: 'win',
    LOSE: 'lose'
  },

  ANIMATIONS: {
    MOUSE: 'mouse',
    BUTTON_PRESS: 'button press'
  },

  // Sound Settings
  SOUND: {
    enabled: true,
    volume: 0.5,
    files: {
      win: `${import.meta.env.BASE_URL}sounds/387232__steaq__badge-coin-win.wav`,
      lose: `${import.meta.env.BASE_URL}sounds/350980__cabled_mess__lose_c_08.wav`,
      buttonClick: `${import.meta.env.BASE_URL}sounds/buttonClick.wav`
    }
  },

  // UI Settings
  POPUP_ANIMATION_DURATION: 300,
  TOOLTIP_DURATION: 3000
};