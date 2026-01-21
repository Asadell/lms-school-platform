import React, { useState } from 'react';
import { useSubjects, useCreateSubject, useDeleteSubject, useUpdateSubject, type Subject } from '../../hooks/useSubjects';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { Plus, BookOpen, Trash2, ArrowRight, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function SubjectsPage() {
    const { user } = useAuth();
    const { data: subjects = [], isLoading } = useSubjects();
    const createMutation = useCreateSubject();
    const updateMutation = useUpdateSubject();
    const deleteMutation = useDeleteSubject();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    // Filter subjects for this teacher if they are logged in as teacher
    // Admin sees all.
    const mySubjects = user?.role === 'admin'
        ? subjects
        : subjects.filter(s => s.teacherId === user?.profileId);

    const onCreateSubmit = async (data: any) => {
        console.log('Current User State:', user);

        // We need TeacherId.
        let teacherId = user?.role === 'teacher' ? user.profileId : null;
        console.log('Resolved TeacherID:', teacherId);

        if (!teacherId && user?.role === 'teacher') {
            alert("Error: Profil guru tidak ditemukan. Silakan login ulang.");
            return;
        }

        if (user?.role === 'admin' && !teacherId) {
            alert("Admin: Fitur pilih guru belum tersedia. Login sebagai guru untuk membuat mata pelajaran.");
            return;
        }

        try {
            if (editingSubject) {
                // Update subject - Note: Backend doesn't have PUT endpoint for subjects yet
                // So we'll show an alert for now
                alert("Fitur edit belum tersedia di backend. Silakan hubungi admin untuk menambahkan endpoint PUT /api/subjects/{id}");
                setEditingSubject(null);
                reset();
            } else {
                await createMutation.mutateAsync({
                    name: data.name,
                    code: data.code,
                    teacherId: teacherId!
                });
                setIsCreateModalOpen(false);
                reset();
            }
        } catch (error) {
            console.error("Failed to save subject:", error);
            alert("Gagal menyimpan mata pelajaran. Cek input atau koneksi.");
        }
    };

    const handleEdit = (e: React.MouseEvent, subject: Subject) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingSubject(subject);
        setValue('name', subject.name);
        setValue('code', subject.code);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm('Yakin ingin menghapus mata pelajaran ini?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setEditingSubject(null);
        reset();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-500">Memuat mata pelajaran...</div>
            </div>
        );
    }

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

            {mySubjects.length === 0 ? (
                <Card className="p-12 text-center">
                    <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">Belum Ada Mata Pelajaran</h3>
                    <p className="text-slate-500 mb-4">Mulai dengan membuat mata pelajaran pertama Anda.</p>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus size={18} className="mr-2" />
                        Buat Mata Pelajaran
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mySubjects.map((subject) => (
                        <Link key={subject.id} to={`/subjects/${subject.id}`} className="block group">
                            <Card className="h-full hover:shadow-md transition-shadow border-brand-100">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600">
                                            <BookOpen size={24} />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-400 hover:text-brand-600"
                                                onClick={(e) => handleEdit(e, subject)}
                                            >
                                                <Edit size={18} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-400 hover:text-red-500"
                                                onClick={(e) => handleDelete(e, subject.id)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
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
            )}

            <Modal
                isOpen={isCreateModalOpen || !!editingSubject}
                onClose={closeModal}
                title={editingSubject ? "Edit Mata Pelajaran" : "Buat Mata Pelajaran Baru"}
            >
                <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
                    <Input
                        label="Nama Mata Pelajaran"
                        placeholder="Contoh: Matematika Wajib"
                        error={errors.name?.message as string}
                        {...register('name', { required: 'Nama mata pelajaran wajib diisi' })}
                    />
                    <Input
                        label="Kode Mapel (5 karakter, huruf besar)"
                        placeholder="MAT01"
                        maxLength={5}
                        error={errors.code?.message as string}
                        {...register('code', {
                            required: 'Kode wajib diisi',
                            pattern: {
                                value: /^[A-Z0-9]{5}$/,
                                message: 'Kode harus 5 karakter (A-Z, 0-9)'
                            },
                            minLength: {
                                value: 5,
                                message: 'Kode harus pas 5 karakter'
                            }
                        })}
                    />

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={closeModal}>Batal</Button>
                        <Button type="submit" isLoading={createMutation.isPending}>
                            {editingSubject ? 'Simpan Perubahan' : 'Buat Mata Pelajaran'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
