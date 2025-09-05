import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Simple in-memory storage for demo purposes
// In production, this would be replaced with secure server-side authentication
const STORAGE_KEY = 'sneaker_inventory_user';
const USERS_KEY = 'sneaker_inventory_users';

// Helper functions for localStorage
const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

const getUser = (): User | null => {
  const userData = localStorage.getItem(STORAGE_KEY);
  return userData ? JSON.parse(userData) : null;
};

const clearUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const getUsers = (): User[] => {
  const usersData = localStorage.getItem(USERS_KEY);
  return usersData ? JSON.parse(usersData) : [];
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check for existing user on mount
  useEffect(() => {
    const user = getUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    const { email, password } = credentials;
    
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Get all users
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, you'd verify the password hash here
    // For demo purposes, we'll just check if the user exists
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date(user.createdAt),
    };

    saveUser(userData);
    setAuthState({
      user: userData,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (credentials: SignupCredentials): Promise<void> => {
    const { name, email, password, confirmPassword } = credentials;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      throw new Error('All fields are required');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user already exists
    const users = getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date(),
    };

    // Save user to users list
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Log in the new user
    saveUser(newUser);
    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    clearUser();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
