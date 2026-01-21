import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { User } from './useUsers';

export interface Subject {
    id: string;
    name: string;
    code: string;
    classId: string;
    teacherId: string;
    teacher?: {
        id: string;
        user: User;
    };
    createdAt: string;
}

export interface CreateSubjectRequest {
    name: string;
    code: string;
    teacherId: string;
}

export function useSubjects() {
    return useQuery({
        queryKey: ['subjects'],
        queryFn: async () => {
            const { data } = await api.get('/subjects');
            return data.data as Subject[];
        },
    });
}

export function useSubject(id: string) {
    return useQuery({
        queryKey: ['subjects', id],
        queryFn: async () => {
            const { data } = await api.get(`/subjects/${id}`);
            return data.data as Subject;
        },
        enabled: !!id,
    });
}

export function useCreateSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateSubjectRequest) => {
            const { data } = await api.post('/subjects', {
                name: payload.name,
                code: payload.code,
                teacher_id: payload.teacherId
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
    });
}

export function useUpdateSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateSubjectRequest> }) => {
            const { data } = await api.put(`/subjects/${id}`, {
                name: payload.name,
                code: payload.code
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
    });
}

export function useDeleteSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/subjects/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
        },
    });
}
