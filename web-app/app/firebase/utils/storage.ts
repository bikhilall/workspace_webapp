import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll
} from 'firebase/storage';
import { storage } from '../config';

export const storageUtils = {
  // Upload a file
  uploadFile: async (path: string, file: File) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { snapshot, downloadURL };
  },

  // Get download URL
  getFileURL: async (path: string) => {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  },

  // Delete a file
  deleteFile: async (path: string) => {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  // List all files in a directory
  listFiles: async (path: string) => {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return result;
  }
};