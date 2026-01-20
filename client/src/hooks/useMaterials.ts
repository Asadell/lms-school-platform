import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface Material {
    id: string;
    subjectId: string;
    title: string;
    content: string; // URL or text
    publishDate: string;
    createdAt: string;
}

export interface CreateMaterialRequest {
    subjectId: string;
    title: string;
    content: string;
    publishDate: string;
}

export function useMaterials(subjectId?: string) {
    return useQuery({
        queryKey: ['materials', subjectId],
        queryFn: async () => {
            // Backend currently doesn't filter by subject in GetAll via query param, 
            // but usually we want to filter on client or update backend. 
            // For now assuming GetAll returns all, we might filter client side if needed 
            // OR assuming the endpoint /api/materials/subject/{id} based on docs.
            // Checking controller... Controller has `GetById` and `GetAll`. 
            // It DOES NOT have `GetBySubjectId`. 
            // REVISION: I will use GetAll and filter client side for now, 
            // as changing backend is out of scope unless necessary.
            const { data } = await api.get('/materials');
            const allMaterials = data.data as Material[];
            if (subjectId) {
                return allMaterials.filter(m => m.subjectId === subjectId);
            }
            return allMaterials;
        },
    });
}

export function useCreateMaterial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateMaterialRequest) => {
            const { data } = await api.post('/materials', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materials'] });
        },
    });
}

export function useDeleteMaterial() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/materials/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materials'] });
        },
    });
}
