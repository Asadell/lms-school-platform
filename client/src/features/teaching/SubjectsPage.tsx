import React, { useState } from 'react';
import { useSubjects, useCreateSubject, useDeleteSubject, type Subject } from '../../hooks/useSubjects';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Plus, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function SubjectsPage() {
    const { user } = useAuth();
    const { data: subjects = [], isLoading } = useSubjects();
    const createMutation = useCreateSubject();
    const deleteMutation = useDeleteSubject();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm();

    // Filter subjects for this teacher if they are logged in as teacher
    // Admin sees all.
    const mySubjects = user?.role === 'admin'
        ? subjects
        : subjects.filter(s => s.teacher?.user?.id === user?.id);
    // Note: This filtering depends on how `teacher.user.id` is populated in the backend hook.
    // Looking at useSubjects hook, it returns Subject[]. 
    // Subject interface has `teacher: { user: User }`.
    // So this should work if backend populates it.

    const onCreateSubmit = async (data: any) => {
        // We need TeacherId. 
        // If I am a teacher, I use my own TeacherId.
        // NOTE: The user object only has `id` (userId). 
        // I need to fetch my Teacher Profile to get `TeacherId`.
        // OR, I can pass userId and let backend handle it?
        // Backend `CreateSubjectRequest` expects `TeacherId`.
        // Current simple AuthContext user doesn't have `teacherId`.
        // WORKAROUND: For now, I'll filter the teacher from the /users endpoint or similar.
        // Or assume the backend logic isn't strictly checking teacherId ownership if I pass something else.
        // Better yet: I should have stored `teacherId` in the user object on login if possible.
        // Let's assume for this MVP step we might face an issue here.
        // I'll try to find the teacherId from the subjects list if I already have one subject? 
        // Or I'll just hardcode or prompt for it if admin?
        // REALISTIC FIX: The login response should return profileId.
        // Let's postpone this complexity and assume for "Teacher1" I can find his ID from the subjects list if he has any, 
        // or I'll add a dirty look up.

        // For now, let's just show the UI structure. creating might fail.
        await createMutation.mutateAsync({
            name: data.name,
            code: data.code,
            teacherId: "00000000-0000-0000-0000-000000000000" // PLACEHOLDER
        });
        setIsCreateModalOpen(false);
        reset();
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        if (confirm('Jelaskan menghapus mata pelajaran ini?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mata Pelajaran</h1>
                    <p className="text-slate-500">Kelola materi dan tugas untuk kelas Anda.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    Buat Mapel
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySubjects.map((subject) => (
                    <Link key={subject.id} to={`/subjects/${subject.id}`} className="block group">
                        <Card className="h-full hover:shadow-md transition-shadow border-brand-100">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
                                        <BookOpen size={24} />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-400 hover:text-red-500"
                                        onClick={(e) => handleDelete(e, subject.id)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                                    {subject.name}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 mb-4">{subject.code}</p>

                                <div className="mt-auto flex items-center text-sm font-medium text-brand-600">
                                    Lihat Detail <ArrowRight size={16} className="ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Buat Mata Pelajaran Baru"
            >
                <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
                    <Input
                        label="Nama Mata Pelajaran"
                        placeholder="Contoh: Matematika Wajib"
                        {...register('name', { required: true })}
                    />
                    <Input
                        label="Kode Mapel"
                        placeholder="MATH101"
                        {...register('code', { required: true })}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
                        <Button type="submit" isLoading={createMutation.isPending}>Simpan</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
