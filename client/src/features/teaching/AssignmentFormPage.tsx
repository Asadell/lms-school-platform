import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCreateAssignment } from '../../hooks/useAssignments';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { ArrowLeft } from 'lucide-react';

export default function AssignmentFormPage() {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const createMutation = useCreateAssignment();

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        if (!subjectId) return;

        await createMutation.mutateAsync({
            subjectId,
            title: data.title,
            description: data.description,
            dueDate: new Date(data.dueDate).toISOString(),
            maxScore: parseInt(data.maxScore)
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
                    <CardTitle>Buat Tugas Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Judul Tugas"
                            placeholder="Contoh: Latihan Soal Bab 1"
                            error={errors.title?.message as string}
                            {...register('title', { required: 'Judul wajib diisi' })}
                        />

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Deskripsi / Instruksi</label>
                            <textarea
                                className="w-full min-h-[120px] px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400"
                                placeholder="Jelaskan instruksi tugas..."
                                {...register('description', { required: 'Deskripsi wajib diisi' })}
                            />
                            {errors.description && <span className="text-sm text-red-500">{errors.description.message as string}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="datetime-local"
                                label="Batas Pengumpulan (Deadline)"
                                error={errors.dueDate?.message as string}
                                {...register('dueDate', { required: 'Deadline wajib diisi' })}
                            />

                            <Input
                                type="number"
                                label="Nilai Maksimal"
                                placeholder="100"
                                defaultValue={100}
                                error={errors.maxScore?.message as string}
                                {...register('maxScore', { required: 'Nilai maksimal wajib diisi', min: 1 })}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" variant="ghost" className="mr-2" onClick={() => navigate(-1)}>
                                Batal
                            </Button>
                            <Button type="submit" isLoading={createMutation.isPending}>
                                Simpan Tugas
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
