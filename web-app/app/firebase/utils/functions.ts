import { httpsCallable } from 'firebase/functions';
import { functions } from '../config';

export const functionUtils = {
  // Call a Cloud Function
  callFunction: async (functionName: string, data?: any) => {
    try {
      const functionRef = httpsCallable(functions, functionName);
      const result = await functionRef(data);
      return result.data;
    } catch (error) {
      console.error(`Error calling function ${functionName}:`, error);
      throw error;
    }
  }
};