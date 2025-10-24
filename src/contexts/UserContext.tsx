import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'operator' | 'readonly';

interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  canEdit: () => boolean;
  canAccessConfig: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Default users
const users = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' as UserRole, name: 'Administrator' },
  { id: '2', username: 'operator', password: 'operator123', role: 'operator' as UserRole, name: 'Operator User' },
  { id: '3', username: 'viewer', password: 'viewer123', role: 'readonly' as UserRole, name: 'Viewer User' }
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        username: foundUser.username,
        role: foundUser.role,
        name: foundUser.name
      };
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const canEdit = () => {
    return user?.role === 'admin' || user?.role === 'operator';
  };

  const canAccessConfig = () => {
    return user?.role === 'admin';
  };

  return (
    <UserContext.Provider value={{ user, login, logout, canEdit, canAccessConfig }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};