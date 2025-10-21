// Firebase Configuration
// Using environment variables for security

const firebaseConfig = {
  apiKey: "AIzaSyB6ho-GUxFGjjQprHHuxCDswIpWy9jtpcU",
  authDomain: "battlearena2dperplexity.firebaseapp.com",
  projectId: "battlearena2dperplexity",
  storageBucket: "battlearena2dperplexity.firebasestorage.app",
  messagingSenderId: "180775815859",
  appId: "1:180775815859:web:23b54f48f1e093ef0f3ec6",
  measurementId: "G-89P0EVPL9X"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot, serverTimestamp, arrayUnion, arrayRemove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Export Firebase instances
export {
  auth,
  db,
  analytics,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove
};

// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  FRIEND_REQUESTS: 'friendRequests',
  GAME_SESSIONS: 'gameSessions',
  MATCH_HISTORY: 'matchHistory'
};

// Utility functions for Firestore
export const FirebaseUtils = {
  // Create or update user profile
  async createUserProfile(user, additionalData = {}) {
    if (!user) return;
    
    const userRef = doc(db, COLLECTIONS.USERS, user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        friends: [],
        stats: {
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          kills: 0,
          deaths: 0,
          favoriteCharacter: null
        },
        settings: {
          soundEffects: true,
          music: true,
          graphicsQuality: 'high',
          cameraShake: true
        },
        status: 'online',
        ...additionalData
      };
      
      await setDoc(userRef, userData);
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        status: 'online'
      });
    }
  },
  
  // Get user profile
  async getUserProfile(uid) {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    return userDoc.exists() ? userDoc.data() : null;
  },
  
  // Update user status
  async updateUserStatus(uid, status) {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      status: status,
      lastSeen: serverTimestamp()
    });
  },
  
  // Send friend request
  async sendFriendRequest(fromUid, toEmail) {
    // Find user by email
    const usersQuery = query(collection(db, COLLECTIONS.USERS), where('email', '==', toEmail));
    const usersSnapshot = await getDocs(usersQuery);
    
    if (usersSnapshot.empty) {
      throw new Error('Usuário não encontrado');
    }
    
    const toUser = usersSnapshot.docs[0];
    const toUid = toUser.id;
    
    if (fromUid === toUid) {
      throw new Error('Você não pode adicionar a si mesmo');
    }
    
    // Check if already friends
    const fromUserDoc = await getDoc(doc(db, COLLECTIONS.USERS, fromUid));
    const fromUserData = fromUserDoc.data();
    
    if (fromUserData.friends && fromUserData.friends.includes(toUid)) {
      throw new Error('Usuário já está em sua lista de amigos');
    }
    
    // Check if request already exists
    const requestId = `${fromUid}_${toUid}`;
    const requestDoc = await getDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId));
    
    if (requestDoc.exists()) {
      throw new Error('Solicitação de amizade já enviada');
    }
    
    // Create friend request
    await setDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId), {
      fromUid,
      toUid,
      fromUser: {
        displayName: fromUserData.displayName,
        email: fromUserData.email,
        photoURL: fromUserData.photoURL
      },
      toUser: {
        displayName: toUser.data().displayName,
        email: toUser.data().email,
        photoURL: toUser.data().photoURL
      },
      status: 'pending',
      createdAt: serverTimestamp()
    });
  },
  
  // Accept friend request
  async acceptFriendRequest(requestId) {
    const requestDoc = await getDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId));
    
    if (!requestDoc.exists()) {
      throw new Error('Solicitação não encontrada');
    }
    
    const requestData = requestDoc.data();
    const { fromUid, toUid } = requestData;
    
    // Add each other as friends
    await updateDoc(doc(db, COLLECTIONS.USERS, fromUid), {
      friends: arrayUnion(toUid)
    });
    
    await updateDoc(doc(db, COLLECTIONS.USERS, toUid), {
      friends: arrayUnion(fromUid)
    });
    
    // Delete the request
    await deleteDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId));
  },
  
  // Reject friend request
  async rejectFriendRequest(requestId) {
    await deleteDoc(doc(db, COLLECTIONS.FRIEND_REQUESTS, requestId));
  },
  
  // Remove friend
  async removeFriend(uid, friendUid) {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      friends: arrayRemove(friendUid)
    });
    
    await updateDoc(doc(db, COLLECTIONS.USERS, friendUid), {
      friends: arrayRemove(uid)
    });
  },
  
  // Get pending friend requests
  async getPendingFriendRequests(uid) {
    const requestsQuery = query(
      collection(db, COLLECTIONS.FRIEND_REQUESTS),
      where('toUid', '==', uid),
      where('status', '==', 'pending')
    );
    
    const snapshot = await getDocs(requestsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  
  // Get friends list with online status
  async getFriendsWithStatus(uid) {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    const userData = userDoc.data();
    
    if (!userData.friends || userData.friends.length === 0) {
      return [];
    }
    
    const friendsData = [];
    for (const friendUid of userData.friends) {
      const friendDoc = await getDoc(doc(db, COLLECTIONS.USERS, friendUid));
      if (friendDoc.exists()) {
        friendsData.push({
          uid: friendUid,
          ...friendDoc.data()
        });
      }
    }
    
    return friendsData;
  },
  
  // Update user stats after match
  async updateUserStats(uid, matchResult) {
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    const currentStats = userData.stats || {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      kills: 0,
      deaths: 0,
      favoriteCharacter: null
    };
    
    const updatedStats = {
      gamesPlayed: currentStats.gamesPlayed + 1,
      wins: currentStats.wins + (matchResult.won ? 1 : 0),
      losses: currentStats.losses + (matchResult.won ? 0 : 1),
      kills: currentStats.kills + matchResult.kills,
      deaths: currentStats.deaths + matchResult.deaths,
      favoriteCharacter: matchResult.character
    };
    
    await updateDoc(userRef, {
      stats: updatedStats
    });
  },
  
  // Save match history
  async saveMatchHistory(matchData) {
    const matchRef = doc(collection(db, COLLECTIONS.MATCH_HISTORY));
    await setDoc(matchRef, {
      ...matchData,
      timestamp: serverTimestamp()
    });
  }
};

console.log('Firebase configured successfully!');