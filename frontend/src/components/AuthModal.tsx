import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  SparklesIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';

interface AuthModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isVisible, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Handle login called with:', loginData);
    setIsLoading(true);
    setError('');

    try {
      const success = await login(loginData.email, loginData.password);
      console.log('Login success:', success);
      
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('E-posta veya şifre hatalı!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş yapılırken bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Şifreler eşleşmiyor!');
      setIsLoading(false);
      return;
    }

    try {
      const success = await register({
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        fullName: registerData.fullName
      });
      
      if (success) {
        onSuccess();
        onClose();
      } else {
        setError('Kayıt olurken bir hata oluştu!');
      }
    } catch (error) {
      console.error('Register error:', error);
      setError('Kayıt olurken bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'ogrenci1@example.com', password: '123456', name: 'Öğrenci 1' },
    { email: 'ogrenci2@example.com', password: '123456', name: 'Öğrenci 2' },
    { email: 'ogretmen1@example.com', password: '123456', name: 'Öğretmen' }
  ];

  const useDemoAccount = (email: string, password: string) => {
    console.log('Using demo account:', email, password);
    setLoginData({ email, password });
    setIsLogin(true);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </h2>
              <p className="text-gray-600 text-xs">
                Gelişmiş özelliklere erişim için
              </p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            ✕
          </Button>
        </div>

        {/* Demo Accounts */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Demo Hesaplar</h3>
          <div className="space-y-2">
            {demoAccounts.map((account, index) => (
              <Button
                key={index}
                onClick={() => useDemoAccount(account.email, account.password)}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left h-auto py-2"
              >
                <div className="flex items-center space-x-2">
                  <UserIcon className="w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    placeholder="Şifrenizi girin"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="pl-10"
                    placeholder="Adınız Soyadınız"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kullanıcı Adı
                </label>
                <Input
                  type="text"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="kullaniciadi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre
                </label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    placeholder="En az 6 karakter"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <LockClosedIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="pl-10"
                    placeholder="Şifrenizi tekrar girin"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
              </Button>
            </form>
          )}

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin ? 'Kayıt olun' : 'Giriş yapın'}
              </button>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Giriş Yapınca Neler Kazanırsınız?</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Kişisel ilerleme takibi</span>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">İnteraktif not alma sistemi</span>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Oyunlaştırma ve rozetler</span>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Tarihi olay bağlantı haritası</span>
            </div>
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">Karşılaştırmalı analiz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
