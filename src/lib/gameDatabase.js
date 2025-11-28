// src/lib/gameDatabase.js - FIREBASE VERSION
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Track pending requests to prevent race conditions
const pendingRequests = new Map();

// Create a new game with single result
export const createNewGame = async (userId, gameData) => {
  try {
    console.log('🔄 Creating new game for user:', userId);

    // Validate user ID
    if (!userId || typeof userId !== 'string') {
      console.error('❌ Invalid user ID:', userId);
      return getMockGame(userId, gameData);
    }

    const gameRef = await addDoc(collection(db, 'games'), {
      user_id: userId,
      user_choice: gameData.userChoice,
      computer_choice: gameData.computerChoice,
      user_won: gameData.userWon,
      created_at: serverTimestamp()
    });

    // Get the created document
    const gameDoc = await getDoc(gameRef);
    
    if (gameDoc.exists()) {
      const gameData = {
        id: gameDoc.id,
        ...gameDoc.data()
      };
      console.log('✅ Game created with ID:', gameData.id);
      return gameData;
    } else {
      throw new Error('Failed to create game - document does not exist');
    }
  } catch (error) {
    console.error('❌ FIREBASE INSERT ERROR:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      userId: userId,
      gameData: gameData
    });
    return getMockGame(userId, gameData);
  }
};

// Mock game fallback
const getMockGame = (userId, gameData = {}) => {
  return {
    id: 'mock-game-' + Date.now(),
    user_id: userId,
    user_choice: gameData.userChoice || null,
    computer_choice: gameData.computerChoice || null,
    user_won: gameData.userWon || false,
    created_at: new Date().toISOString()
  };
};

// Get user game history
export const getUserGameHistory = async (userId, gamesLimit = 10) => {
  try {
    console.log('📚 Getting game history for user:', userId);
    
    const gamesQuery = query(
      collection(db, 'games'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(gamesLimit)
    );

    const querySnapshot = await getDocs(gamesQuery);
    const games = [];
    
    querySnapshot.forEach((doc) => {
      games.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('✅ Game history loaded, count:', games.length);
    return games;
  } catch (error) {
    console.error('❌ Error getting user game history:', error);
    return [];
  }
};

// Get user statistics - CALCULATED FROM user_won
export const getUserStatistics = async (userId) => {
  try {
    console.log('📊 Getting user statistics for:', userId);
    
    const gamesQuery = query(
      collection(db, 'games'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(gamesQuery);
    const games = [];
    
    querySnapshot.forEach((doc) => {
      games.push(doc.data());
    });

    const totalGames = games.length;
    const totalWins = games.filter(game => game.user_won).length;
    const totalLosses = totalGames - totalWins;
    const winRate = totalGames > 0 ? (totalWins / totalGames * 100).toFixed(1) : 0;

    const stats = {
      totalGames,
      totalWins,
      totalLosses,
      winRate,
      recentGames: games.slice(0, 5)
    };
    
    console.log('✅ User statistics loaded:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error getting user statistics:', error);
    return {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      winRate: 0,
      recentGames: []
    };
  }
};

// Get win streak (consecutive wins)
export const getWinStreak = async (userId) => {
  try {
    const gamesQuery = query(
      collection(db, 'games'),
      where('user_id', '==', userId),
      orderBy('created_at', 'desc')
    );

    const querySnapshot = await getDocs(gamesQuery);
    const games = [];
    
    querySnapshot.forEach((doc) => {
      games.push(doc.data());
    });

    let streak = 0;
    for (const game of games) {
      if (game.user_won) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('❌ Error getting win streak:', error);
    return 0;
  }
};


// Improved ensureUserProfile for Firebase
export const ensureUserProfile = async (user) => {
  if (!user) {
    console.error('❌ ensureUserProfile: No user provided');
    return null;
  }

  try {
    console.log('🔍 Checking user profile for:', user.id);
    
    // Check if profile exists
    const userDoc = await getDoc(doc(db, 'user_profiles', user.id));
    
    // If profile exists → return it
    if (userDoc.exists()) {
      const profile = userDoc.data();
      console.log('✅ User profile already exists:', profile.username);
      return {
        id: userDoc.id,
        ...profile
      };
    }

    // If profile does NOT exist → create it
    console.log('📝 Creating new user profile for:', user.id);
    
    // Generate a better username
    const username = user.email || 
                    user.displayName ||
                    user.user_metadata?.name || 
                    user.user_metadata?.full_name ||
                    user.user_metadata?.user_name ||
                    `quantum_user_${user.id.slice(0, 8)}`;
    
    const userProfile = {
      id: user.id,
      username: username,
      email: user.email || '',
      created_at: serverTimestamp(),
      sound_enabled: true
    };

    await setDoc(doc(db, 'user_profiles', user.id), userProfile);
    
    console.log('✅ User profile created successfully:', username);
    return userProfile;
  } catch (err) {
    console.error('❌ Unexpected error ensuring user profile:', err);
    return null; // Always return to avoid breaking auth flow
  }
};

// Get leaderboard (top players by win rate)
export const getLeaderboard = async (limit = 10) => {
  try {
    console.log('🏆 Getting leaderboard');
    
    // Note: Firebase doesn't support complex aggregations like Supabase
    // This is a simplified version - for production you might want to use
    // a cloud function for complex queries
    
    const gamesQuery = query(
      collection(db, 'games'),
      orderBy('created_at', 'desc'),
      limit(1000) // Limit for performance
    );

    const querySnapshot = await getDocs(gamesQuery);
    const userStats = new Map();
    
    // Calculate stats for each user
    querySnapshot.forEach((doc) => {
      const game = doc.data();
      const userId = game.user_id;
      
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          userId,
          totalGames: 0,
          totalWins: 0,
          username: `user_${userId.slice(0, 8)}` // Default username
        });
      }
      
      const stats = userStats.get(userId);
      stats.totalGames++;
      if (game.user_won) {
        stats.totalWins++;
      }
    });
    
    // Convert to array and calculate win rates
    const leaderboard = Array.from(userStats.values())
      .map(stats => ({
        ...stats,
        winRate: stats.totalGames > 0 ? (stats.totalWins / stats.totalGames * 100).toFixed(1) : 0
      }))
      .sort((a, b) => b.winRate - a.winRate || b.totalWins - a.totalWins)
      .slice(0, limit);
    
    // Try to get usernames for top players
    for (let player of leaderboard) {
      try {
        const userDoc = await getDoc(doc(db, 'user_profiles', player.userId));
        if (userDoc.exists()) {
          player.username = userDoc.data().username || player.username;
        }
      } catch (error) {
        console.log('Could not fetch username for:', player.userId);
      }
    }
    
    console.log('✅ Leaderboard loaded with', leaderboard.length, 'players');
    return leaderboard;
  } catch (error) {
    console.error('❌ Error getting leaderboard:', error);
    return [];
  }
};