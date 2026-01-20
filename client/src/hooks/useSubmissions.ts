import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { User } from './useUsers';

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    student?: {
        id: string;
        user: User;
        nis: string;
    };
    answerText: string;
    submittedAt: string;
    score?: number;
    feedback?: string;
    gradedAt?: string;
}

export interface CreateSubmissionRequest {
    assignmentId: string;
    answerText: string;
}

export interface GradeSubmissionRequest {
    score: number;
    feedback: string;
}

export function useSubmissions(assignmentId?: string) {
    return useQuery({
        queryKey: ['submissions', assignmentId],
        queryFn: async () => {
            const { data } = await api.get('/submissions');
            const all = data.data as Submission[];
            if (assignmentId) {
                return all.filter(s => s.assignmentId === assignmentId);
            }
            return all;
        },
    });
}

export function useCreateSubmission() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateSubmissionRequest) => {
            const { data } = await api.post('/submissions', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        },
    });
}

export function useGradeSubmission() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: GradeSubmissionRequest }) => {
            const { data } = await api.put(`/submissions/${id}/grade`, payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        },
    });
}
