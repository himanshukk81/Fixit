import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'fixit.session.token';
const PHONE_KEY = 'fixit.session.phone';

const secureSession = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  save: async (token: string, phone: string) =>
    Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, token),
      SecureStore.setItemAsync(PHONE_KEY, phone),
    ]),
  getPhone: () => SecureStore.getItemAsync(PHONE_KEY),
  clear: async () =>
    Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(PHONE_KEY)]),
};

const preferenceStorage = {
  get: (key: string) => AsyncStorage.getItem(`fixit.preference.${key}`),
  set: (key: string, value: string) => AsyncStorage.setItem(`fixit.preference.${key}`, value),
};

export { preferenceStorage, secureSession };
