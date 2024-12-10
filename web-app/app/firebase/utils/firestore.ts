import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../config';

export const firestoreUtils = {
  // Create a new document
  createDocument: async (collectionName: string, docId: string, data: DocumentData) => {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
    return docRef;
  },

  // Read a document
  getDocument: async (collectionName: string, docId: string) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  // Get all documents from a collection
  getAllDocuments: async (collectionName: string) => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Update a document
  updateDocument: async (collectionName: string, docId: string, data: Partial<DocumentData>) => {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return docRef;
  },

  // Delete a document
  deleteDocument: async (collectionName: string, docId: string) => {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  },

  // Query collection
  queryCollection: async (
    collectionName: string,
    fieldPath: string,
    operator: any,
    value: any
  ) => {
    const q = query(
      collection(db, collectionName),
      where(fieldPath, operator, value)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Query collection with ordering
  queryCollectionOrdered: async (
    collectionName: string,
    orderByField: string,
    orderDirection: 'asc' | 'desc' = 'desc'
  ) => {
    const q = query(
      collection(db, collectionName),
      orderBy(orderByField, orderDirection)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};