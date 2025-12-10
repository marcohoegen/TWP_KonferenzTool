import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useUserUserControllerMe } from '../api/generate/hooks/UserService.hooks';

interface UserData {
  id: number;
  email: string;
  conferenceId: number;
  code?: string;
  name?: string;
}

interface UserAuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isLoading: queryLoading, error, refetch } = useUserUserControllerMe(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!queryLoading) {
      if (data && !error) {
        setUser(data as UserData);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [data, error, queryLoading]);

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refetch,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
}
