
import React from 'react';
import { User } from '../types';

interface UserSelectorProps {
  onSelectUser: (user: User) => void;
}

const UserButton: React.FC<{ user: User, color: string, onClick: (user: User) => void }> = ({ user, color, onClick }) => (
    <button
      onClick={() => onClick(user)}
      className={`w-full md:w-52 py-4 px-6 text-2xl font-bold text-white rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out ${color}`}
    >
      Ich bin {user}
    </button>
);

const UserSelector: React.FC<UserSelectorProps> = ({ onSelectUser }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-8 animate-fade-in">
      <UserButton user={User.Markus} color="bg-blue-500 hover:bg-blue-600" onClick={onSelectUser} />
      <UserButton user={User.Diana} color="bg-pink-500 hover:bg-pink-600" onClick={onSelectUser} />
    </div>
  );
};

export default UserSelector;
