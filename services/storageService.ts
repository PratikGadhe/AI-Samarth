import { Contact } from '../types';

const CONTACTS_KEY = 'ai_samarth_contacts';
const USER_NAME_KEY = 'ai_samarth_username';

export const getContacts = (): Contact[] => {
  try {
    const data = localStorage.getItem(CONTACTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveContacts = (contacts: Contact[]) => {
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
};

export const getUserName = (): string => {
  return localStorage.getItem(USER_NAME_KEY) || '';
};

export const saveUserName = (name: string) => {
  localStorage.setItem(USER_NAME_KEY, name);
};