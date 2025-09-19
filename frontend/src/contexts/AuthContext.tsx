import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  level: number;
  experience: number;
  coins: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  createdAt: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcı bilgilerini kontrol et
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      console.log('Checking auth status:', { token: !!token, userData: !!userData });
      
      if (token && userData) {
        // Token geçerliliğini kontrol et (basit bir kontrol)
        const parsedUser = JSON.parse(userData);
        
        // Son giriş tarihini güncelle
        const updatedUser = {
          ...parsedUser,
          lastLogin: new Date().toISOString()
        };
        
        console.log('User found in localStorage:', updatedUser);
        setUser(updatedUser);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
      } else {
        console.log('No auth data found');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Login attempt:', email, password);
      setIsLoading(true);
      
      // Basit demo kullanıcıları (gerçek uygulamada backend API kullanılacak)
      const demoUsers = [
        {
          id: '1',
          username: 'ogrenci1',
          email: 'ogrenci1@example.com',
          password: '123456',
          fullName: 'Ahmet Yılmaz',
          level: 3,
          experience: 340,
          coins: 1250,
          gems: 45,
          currentStreak: 7,
          longestStreak: 15,
          createdAt: '2024-01-01',
          lastLogin: new Date().toISOString()
        },
        {
          id: '2',
          username: 'ogrenci2',
          email: 'ogrenci2@example.com',
          password: '123456',
          fullName: 'Ayşe Demir',
          level: 2,
          experience: 180,
          coins: 800,
          gems: 25,
          currentStreak: 3,
          longestStreak: 8,
          createdAt: '2024-01-05',
          lastLogin: new Date().toISOString()
        },
        {
          id: '3',
          username: 'ogretmen1',
          email: 'ogretmen1@example.com',
          password: '123456',
          fullName: 'Mehmet Öğretmen',
          level: 5,
          experience: 890,
          coins: 2500,
          gems: 120,
          currentStreak: 12,
          longestStreak: 25,
          createdAt: '2023-12-15',
          lastLogin: new Date().toISOString()
        }
      ];

      // Kullanıcıyı bul
      const foundUser = demoUsers.find(u => u.email === email && u.password === password);
      console.log('Found user:', foundUser);
      
      if (foundUser) {
        // Şifreyi user objesinden çıkar
        const { password: _, ...userWithoutPassword } = foundUser;
        
        // Token oluştur (basit bir demo token)
        const token = `demo_token_${foundUser.id}_${Date.now()}`;
        
        // LocalStorage'a kaydet
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
        
        console.log('User logged in successfully:', userWithoutPassword);
        setUser(userWithoutPassword);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Yeni kullanıcı oluştur
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        level: 1,
        experience: 0,
        coins: 100, // Başlangıç bonusu
        gems: 10,   // Başlangıç bonusu
        currentStreak: 0,
        longestStreak: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Token oluştur
      const token = `demo_token_${newUser.id}_${Date.now()}`;
      
      // LocalStorage'a kaydet
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser
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
