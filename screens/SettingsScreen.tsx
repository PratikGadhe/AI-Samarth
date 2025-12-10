import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Contact } from '../types';
import { getContacts, saveContacts, getUserName, saveUserName } from '../services/storageService';

interface Props {
  onBack: () => void;
}

const SettingsScreen: React.FC<Props> = ({ onBack }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [userName, setUserName] = useState('');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  useEffect(() => {
    setContacts(getContacts());
    setUserName(getUserName());
  }, []);

  const handleAddContact = () => {
    if (!newName || !newPhone) return;
    const newContact: Contact = {
      id: Date.now().toString(),
      name: newName,
      phone: newPhone
    };
    const updated = [...contacts, newContact];
    setContacts(updated);
    saveContacts(updated);
    setNewName('');
    setNewPhone('');
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    saveContacts(updated);
  };

  const handleSaveName = (val: string) => {
    setUserName(val);
    saveUserName(val);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <button onClick={onBack} className="text-gray-400 hover:text-white font-bold text-lg">← Back</button>
        <h2 className="text-2xl font-bold text-white">Emergency Settings</h2>
      </div>

      {/* User Info */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-yellow-400 font-bold mb-4 uppercase text-sm tracking-wider">Your Info</h3>
        <div>
          <label className="block text-gray-400 text-sm mb-2">Your Name (Included in SOS)</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => handleSaveName(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
            placeholder="e.g. John Doe"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
        <h3 className="text-red-400 font-bold mb-4 uppercase text-sm tracking-wider">Emergency Contacts</h3>
        
        <div className="space-y-4 mb-6">
          {contacts.map(contact => (
            <div key={contact.id} className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-700">
              <div>
                <p className="font-bold text-white">{contact.name}</p>
                <p className="text-gray-400 font-mono text-sm">{contact.phone}</p>
              </div>
              <button 
                onClick={() => handleDeleteContact(contact.id)}
                className="text-red-500 hover:text-red-400 font-bold px-3 py-1"
              >
                REMOVE
              </button>
            </div>
          ))}
          
          {contacts.length === 0 && (
            <p className="text-gray-500 text-center italic py-2">No contacts added yet.</p>
          )}
        </div>

        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-300 mb-3 font-medium">Add New Contact</p>
          <div className="grid grid-cols-1 gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
              placeholder="Contact Name"
            />
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-yellow-400 outline-none"
              placeholder="Phone Number"
            />
            <Button variant="primary" onClick={handleAddContact} disabled={!newName || !newPhone} className="py-2">
              ADD CONTACT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;