import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAdminControllerLogout } from '../api/generate/hooks/AdminService.hooks';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminLogout() {
  const navigate = useNavigate();
  const logoutMutation = useAdminAdminControllerLogout();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutMutation.mutateAsync({});
      } catch (error) {
        // Even if logout fails, clear client state and redirect
        console.error('Logout error:', error);
      } finally {
        // Always redirect to login after logout attempt
        navigate('/admin/login', { replace: true });
      }
    };

    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingSpinner />;
}
