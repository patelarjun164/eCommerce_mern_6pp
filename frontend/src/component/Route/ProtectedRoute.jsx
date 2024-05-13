import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAdminRoute, children }) => {

    const { isAuthenticated, loading, user } = useSelector((state) => state.user)

    if (!loading) {
        if (isAuthenticated === false) {
            return <Navigate to="/login" />
        }

        if( isAdminRoute === true && user.role !== "admin"){
            return <Navigate to="/login" />
        } 

        return (
            children
        );
    }
}
export default ProtectedRoute;
