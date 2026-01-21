import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

interface RoleGuardProps {
    roles: string[];
}

export function RoleGuard({ roles }: RoleGuardProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    if (!user || !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
