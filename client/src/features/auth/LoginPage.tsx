import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/axios';
import { useAuth } from './AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

interface LoginResponse {
    data: {
        token: string;
        user: {
            id: string;
            username: string;
            email: string;
            role: 'student' | 'teacher' | 'admin';
        };
    };
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const mutation = useMutation({
        mutationFn: async (credentials: any) => {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: (response: any) => {
            // Backend returns: { success: true, data: { token, user } }
            if (response.success && response.data) {
                login(response.data.token, response.data.user);
                navigate('/');
            } else {
                throw new Error('Format respons tidak valid');
            }
        },
        onError: (error: any) => {
            console.error('Login failed', error);
            const errorMessage = error.response?.data?.message || 'Login gagal. Periksa email dan password Anda.';
            alert(errorMessage);
        }
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    return (
        <Card className="w-full shadow-lg border-t-4 border-t-brand-500">
            <CardHeader>
                <CardTitle className="text-center">Masuk ke Akun</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Email"
                        placeholder="nama@sekolah.sch.id"
                        type="email"
                        {...register('email', { required: 'Email wajib diisi' })}
                        error={errors.email?.message as string}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password', { required: 'Password wajib diisi' })}
                        error={errors.password?.message as string}
                    />

                    <Button
                        className="w-full mt-2"
                        isLoading={mutation.isPending}
                        type="submit"
                    >
                        Masuk
                    </Button>

                    <div className="text-center text-sm text-slate-500 mt-4">
                        <p>Belum punya akun? Hubungi Admin Sekolah.</p>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
