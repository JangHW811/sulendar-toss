/**
 * 토스 로그인 기반 인증 Context
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/auth';

// 앱인토스 SDK에서 제공하는 함수들 (실제 import 경로는 SDK에 따라 다름)
// import { login, getUserInfo } from '@apps-in-toss/framework';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'weight' | 'height'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tossUserId, setTossUserId] = useState<string | null>(null);

  // 앱 시작 시 토스 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    try {
      setIsLoading(true);
      
      // TODO: 실제 토스 SDK의 getUserInfo 사용
      // const tossUser = await getUserInfo();
      // if (tossUser) {
      //   setTossUserId(tossUser.userId);
      //   const userData = await authService.getCurrentUser(tossUser.userId);
      //   setUser(userData);
      // }
      
      // 개발용: 임시로 null 설정 (토스 SDK 연동 전)
      setUser(null);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn() {
    try {
      setIsLoading(true);
      
      // TODO: 실제 토스 SDK의 login 사용
      // const tossUser = await login();
      // setTossUserId(tossUser.userId);
      // const userData = await authService.signInWithToss(tossUser.userId);
      // setUser(userData);
      
      // 개발용: 테스트 유저 생성
      const testUserId = 'test-toss-user-' + Date.now();
      setTossUserId(testUserId);
      const userData = await authService.signInWithToss(testUserId);
      setUser(userData);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  function signOut() {
    setUser(null);
    setTossUserId(null);
  }

  async function updateProfile(updates: Partial<Pick<User, 'name' | 'weight' | 'height'>>) {
    if (!tossUserId) throw new Error('로그인이 필요합니다');
    
    const updatedUser = await authService.updateProfile(tossUserId, updates);
    setUser(updatedUser);
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
