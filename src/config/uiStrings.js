// src/config/uiStrings.js - CENTRALIZED UI STRINGS & MESSAGES

export const UIStrings = {
  // ========================
  // GENERAL & COMMON STRINGS
  // ========================
  GENERAL: {
    APP_NAME: "Schrödinger's cat",
    LOADING: "Loading...",
    ERROR: "Error",
    SUCCESS: "Success",
    ANONYMOUS: "Anonymous",
    UNKNOWN: "Unknown",
    YOU: "You"
  },

  // ========================
  // AUTHENTICATION STRINGS
  // ========================
  AUTH: {
    SIGN_IN: "🔐 Sign In",
    SIGN_OUT: "Sign Out",
    WELCOME: "Welcome",
    GUEST: "Guest"
  },

  // ========================
  // HOW IT WORKS SECTION
  // ========================
  HOW_IT_WORKS: {
    TITLE: "✨ Help is heaven !! 🌟",
    HEADER_TITLE: "🎯 NuNu's Epic Adventure to Heaven ⚡",
    SUBHEADER: "Every donation brings us closer to the magical door!",
    
    STEPS: {
      STEP1: {
        TITLE: "Magic Conversion",
        DESCRIPTION: "Every <strong>$1</strong> magically transforms into <strong>1 stair</strong> for NuNu to climb!",
        EMOJI: "💰"
      },
      STEP2: {
        TITLE: "Heartfelt Impact", 
        DESCRIPTION: "<strong>50%</strong> of all received donations directly support Humans, Animals, and Trees in need.",
        EMOJI: "🌍"
      },
      STEP3: {
        TITLE: "Pay It Forward",
        DESCRIPTION: "When NuNu reaches heaven, <strong>YOU</strong> could be next! NuNu will help donors raise funds for their chosen causes.",
        EMOJI: "🔄"
      },
      STEP4: {
        TITLE: "Give with Joy",
        DESCRIPTION: "Donate only what feels light and joyful. Let love flow through you effortlessly.",
        EMOJI: "💖"
      }
    },
    
    CALL_TO_ACTION: {
      TITLE: "🚀 Join the Magical Journey! 🌈",
      SUBTITLE: "Every step brings magic to the world"
    }
  },


  // ========================
  // ANIMATION & RIVE STRINGS
  // ========================
  ANIMATION: {
    LOADING: "⚡ Loading Animation...",
    ANIMATION_COMPLETED: "Animation completed"
  },

  // ========================
  // PAYMENT & PAYPAL STRINGS
  // ========================
  PAYMENT: {
    PAYPAL_LOADING: "Loading PayPal...",
    PAYPAL_FAILED: "PayPal failed to load",
    CURRENCY: "USD",
    CURRENCY_CODE: "USD"
  },

  // ========================
  // ATTRIBUTION STRINGS
  // ========================
  ATTRIBUTION: {
    ANIMATION: "🎨 Animation:",
    BY: "by",
    CREATOR: "alex_t",
    LICENSE: "CC BY 4.0",
    VIEW_ON_RIVE: "View on Rive",
    RIVE_URL: "https://rive.app/marketplace/19556-36763-cat-in-a-box/",
    LICENSE_URL: "https://creativecommons.org/licenses/by/4.0/"
  }
};

// Helper function to get username from email
export const getUsername = (email) => {
  if (!email) return UIStrings.GENERAL.ANONYMOUS;
  return email.split('@')[0];
};

// Helper function to format time ago
export const formatTimeAgo = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  
  if (diffMins < 1) return UIStrings.HISTORY.TIME_AGO.JUST_NOW;
  if (diffMins < 60) return UIStrings.HISTORY.TIME_AGO.MINUTES_AGO(diffMins);
  if (diffHours < 24) return UIStrings.HISTORY.TIME_AGO.HOURS_AGO(diffHours);
  return date.toLocaleDateString();
};

// Make strings globally accessible for debugging
if (typeof window !== 'undefined') {
  window.SchrodingersCatStrings = UIStrings;
}