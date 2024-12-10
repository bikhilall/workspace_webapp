import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  sendEmailVerification
} from 'firebase/auth';
import { auth } from '../config';
import { firestoreUtils } from './firestore';

export const authUtils = {
  // Register new user
  register: async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      await sendEmailVerification(userCredential.user);
      
      // Create user profile document in Firestore
      await firestoreUtils.createDocument('users', userCredential.user.uid, {
        displayName,
        email,
        createdAt: new Date().toISOString(),
        totalPosts: 0,
        totalLikes: 0
      });
      
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Login with email
  login: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Login with Google
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists in Firestore, if not create it
      const userProfile = await firestoreUtils.getDocument('users', result.user.uid);
      if (!userProfile) {
        await firestoreUtils.createDocument('users', result.user.uid, {
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString(),
          totalPosts: 0,
          totalLikes: 0
        });
      }
      
      return result.user;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: (): User | null => {
    return auth.currentUser;
  },

  // Update user profile
  updateUserProfile: async (data: { displayName?: string; photoURL?: string }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    try {
      await updateProfile(user, data);
      // Update Firestore profile
      await firestoreUtils.updateDocument('users', user.uid, data);
      return user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  },

  // Update user email
  updateUserEmail: async (newEmail: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    try {
      await updateEmail(user, newEmail);
      // Update Firestore profile
      await firestoreUtils.updateDocument('users', user.uid, { email: newEmail });
      return user;
    } catch (error) {
      console.error('Email update error:', error);
      throw error;
    }
  },

  // Update user password
  updateUserPassword: async (newPassword: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    try {
      await updatePassword(user, newPassword);
      return user;
    } catch (error) {
      console.error('Password update error:', error);
      throw error;
    }
  }
};