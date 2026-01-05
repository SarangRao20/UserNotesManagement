import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = () => {
    const { user } = useContext(AuthContext);

    // If user is not authenticated, redirect to login
    // Note: In a real app, strict token validation is better
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
