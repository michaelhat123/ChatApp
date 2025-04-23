import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api.ts';

interface User {
  id: string;
  username: string;
  fullName: string;
  profileImage: string;
  email: string;
  bio?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, fullName: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error: any) { // ✅ Added : any to error
        localStorage.removeItem('token');
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error: any) { // ✅ Added : any to error
      console.error('Login failed:', error);
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.'); // ✅ Extract message
    }
  };

  const register = async (email: string, fullName: string, username: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, fullName, username, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error: any) { // ✅ Added : any to error
      console.error('Registration failed:', error);
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Registration failed. Please try again.'); // ✅ Extract message
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error: any) { // ✅ Added : any to error
      console.error('Logout error:', error);
      throw new Error(error.response?.data?.message || 'Logout failed. Please try again.');
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};