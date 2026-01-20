import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { User } from './useUsers';

export interface ClassEntity {
    id: string;
    name: string;
    gradeLevel: number;
    academicYear: string;
    homeroomTeacherId?: string;
    homeroomTeacher?: {
        id: string;
        nip: string;
        specialization: string;
        user: User;
    };
    students?: {
        id: string;
        user: User;
    }[];
    createdAt: string;
}

export interface CreateClassRequest {
    name: string;
    gradeLevel: number;
    academicYear: string;
    homeroomTeacherId?: string;
}

export function useClasses() {
    return useQuery({
        queryKey: ['classes'],
        queryFn: async () => {
            const { data } = await api.get('/classes');
            return data.data as ClassEntity[];
        },
    });
}

export function useClass(id: string) {
    return useQuery({
        queryKey: ['classes', id],
        queryFn: async () => {
            const { data } = await api.get(`/classes/${id}`);
            return data.data as ClassEntity;
        },
        enabled: !!id,
    });
}

export function useCreateClass() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateClassRequest) => {
            const { data } = await api.post('/classes', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
    });
}

export function useDeleteClass() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/classes/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
        },
    });
}
