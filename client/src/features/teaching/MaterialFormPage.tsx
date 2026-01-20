import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCreateMaterial } from '../../hooks/useMaterials';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export default function MaterialFormPage() {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const createMutation = useCreateMaterial();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        if (!subjectId) return;

        // Hardcoded MaterialType=0 (Document) for now, extend later
        await createMutation.mutateAsync({
            subjectId,
            title: data.title,
            content: data.content,
            type: 0 // Document
        });

        navigate(`/subjects/${subjectId}`);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent">
                <ArrowLeft size={18} className="mr-2" /> Kembali
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Buat Materi Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Judul Materi"
                            placeholder="Contoh: Pengenalan Aljabar"
                            error={errors.title?.message as string}
                            {...register('title', { required: 'Judul wajib diisi' })}
                        />

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Konten / Deskripsi</label>
                            <textarea
                                className="w-full min-h-[150px] px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400"
                                placeholder="Tulis materi di sini..."
                                {...register('content', { required: 'Konten wajib diisi' })}
                            />
                            {errors.content && <span className="text-sm text-red-500">{errors.content.message as string}</span>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" variant="ghost" className="mr-2" onClick={() => navigate(-1)}>
                                Batal
                            </Button>
                            <Button type="submit" isLoading={createMutation.isPending}>
                                Simpan Materi
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
