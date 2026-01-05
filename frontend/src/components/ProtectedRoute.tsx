// components/ProtectedRoute.tsx
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    
  const { token } = useSelector((state: RootState) => state.persistedSlice);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;