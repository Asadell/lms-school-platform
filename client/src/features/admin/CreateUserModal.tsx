import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import api from '../../lib/axios';

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState<string | null>(null);

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/auth/register', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
            reset();
            alert('User berhasil dibuat!');
        },
        onError: (error: any) => {
            console.error('Failed to create user', error);
            setServerError(error.response?.data?.message || 'Gagal membuat user');
        }
    });

    const onSubmit = (data: any) => {
        setServerError(null);
        mutation.mutate(data);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Pengguna Baru"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                        {serverError}
                    </div>
                )}

                <Input
                    label="Username"
                    placeholder="contoh: budi_santoso"
                    {...register('username', {
                        required: 'Username wajib diisi',
                        minLength: { value: 3, message: 'Minimal 3 karakter' }
                    })}
                    error={errors.username?.message as string}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="nama@sekolah.sch.id"
                    {...register('email', {
                        required: 'Email wajib diisi',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email tidak valid"
                        }
                    })}
                    error={errors.email?.message as string}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password', {
                        required: 'Password wajib diisi',
                        minLength: { value: 6, message: 'Minimal 6 karakter' }
                    })}
                    error={errors.password?.message as string}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Role</label>
                    <select
                        className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        {...register('role', { required: 'Role wajib dipilih' })}
                    >
                        <option value="">Pilih Role</option>
                        <option value="student">Siswa (Student)</option>
                        <option value="teacher">Guru (Teacher)</option>
                        <option value="admin">Administrator</option>
                    </select>
                    {errors.role && (
                        <p className="text-sm text-red-500">{errors.role.message as string}</p>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>Batal</Button>
                    <Button type="submit" isLoading={mutation.isPending}>Simpan User</Button>
                </div>
            </form>
        </Modal>
    );
}
