import React from 'react';
import { ALLOWED_USERS } from '../../constants/allowedUsers';

interface AuthorizedUsersDisplayProps {
  onClose: () => void;
}

export const AuthorizedUsersDisplay: React.FC<AuthorizedUsersDisplayProps> = ({ onClose }) => {
  return (
    <div className="mb-6 p-4 bg-[rgb(var(--bgCards))] rounded-lg border border-gray-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-[rgb(var(--text))]">
          Authorized Team Members ({ALLOWED_USERS.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-600 font-bold"
        >
          ✕
        </button>
      </div>
      <p className="text-sm text-[rgb(var(--text))] opacity-70 mb-4">
        The dashboard only displays leads belonging to these authorized users:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {ALLOWED_USERS.map((user, index) => (
          <div 
            key={index}
            className="p-3 bg-[rgb(var(--bg))] rounded-md border border-gray-200"
          >
            <div className="font-medium text-[rgb(var(--text))] text-sm">{user.name}</div>
            <div className="text-xs text-[rgb(var(--text))] opacity-50 font-mono">
              {user.id.length > 40 ? `${user.id.substring(0, 20)}...${user.id.slice(-10)}` : user.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};