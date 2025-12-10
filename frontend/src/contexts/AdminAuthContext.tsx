import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAdminAdminControllerMe } from '../api/generate/hooks/AdminService.hooks';

interface AdminData {
  id: number;
  name: string;
  email: string;
}

interface AdminAuthContextType {
  admin: AdminData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data, isLoading: queryLoading, error, refetch } = useAdminAdminControllerMe(
    undefined,
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!queryLoading) {
      if (data && !error) {
        setAdmin(data as AdminData);
      } else {
        setAdmin(null);
      }
      setIsLoading(false);
    }
  }, [data, error, queryLoading]);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        refetch,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
