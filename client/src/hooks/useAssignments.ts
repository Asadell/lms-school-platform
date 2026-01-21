import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Assignment {
    id: string;
    subjectId: string;
    title: string;
    description: string;
    dueDate: string;
    maxScore: number;
    createdAt: string;
}

export interface CreateAssignmentRequest {
    subjectId: string;
    title: string;
    description: string;
    dueDate: string;
    maxScore: number;
}

export function useAssignments(subjectId?: string) {
    return useQuery({
        queryKey: ['assignments', subjectId],
        queryFn: async () => {
            const { data } = await api.get('/assignments');
            const all = data.data as Assignment[];
            if (subjectId) {
                return all.filter(a => a.subjectId === subjectId);
            }
            return all;
        },
    });
}

export function useCreateAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateAssignmentRequest) => {
            const { data } = await api.post('/assignments', {
                title: payload.title,
                description: payload.description,
                due_date: payload.dueDate,
                max_score: payload.maxScore,
                subject_id: payload.subjectId
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
        },
    });
}

export function useUpdateAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateAssignmentRequest> }) => {
            const { data } = await api.put(`/assignments/${id}`, {
                title: payload.title,
                description: payload.description,
                due_date: payload.dueDate,
                max_score: payload.maxScore,
            });
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
        },
    });
}

export function useDeleteAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/assignments/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
        },
    });
}
