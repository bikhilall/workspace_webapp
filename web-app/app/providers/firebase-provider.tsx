'use client';

import { createContext, useContext, ReactNode } from 'react';
import { firebaseApp, db, storage, functions } from '../firebase/config';
import { firestoreUtils } from '../firebase/utils/firestore';
import { storageUtils } from '../firebase/utils/storage';
import { functionUtils } from '../firebase/utils/functions';

interface FirebaseContextType {
  app: typeof firebaseApp;
  db: typeof db;
  storage: typeof storage;
  functions: typeof functions;
  firestore: typeof firestoreUtils;
  storageUtils: typeof storageUtils;
  functionUtils: typeof functionUtils;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const value = {
    app: firebaseApp,
    db,
    storage,
    functions,
    firestore: firestoreUtils,
    storageUtils,
    functionUtils,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}