import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserUserControllerLogout } from '../api/generate/hooks/UserService.hooks';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UserLogout() {
  const navigate = useNavigate();
  const logoutMutation = useUserUserControllerLogout();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutMutation.mutateAsync({});
      } catch (error) {
        // Even if logout fails, clear client state and redirect
        console.error('Logout error:', error);
      } finally {
        // Always redirect to root (user login) after logout attempt
        navigate('/', { replace: true });
      }
    };

    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingSpinner />;
}
