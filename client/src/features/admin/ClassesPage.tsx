import React, { useState } from 'react';
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass, type ClassEntity } from '../../hooks/useClasses';
import { useUsers } from '../../hooks/useUsers';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function ClassesPage() {
    const { data: classes = [], isLoading } = useClasses();
    const { data: users = [] } = useUsers();
    const createMutation = useCreateClass();
    const updateMutation = useUpdateClass();
    const deleteMutation = useDeleteClass();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassEntity | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassEntity | null>(null);

    const { register, handleSubmit, reset, setValue } = useForm();

    // Filter only teachers for dropdown
    const teachers = users.filter(u => u.role === 'teacher');

    const handleEditClick = (cls: ClassEntity) => {
        setEditingClass(cls);
        setValue('name', cls.name);
        setValue('gradeLevel', cls.gradeLevel);
        setValue('academicYear', cls.academicYear);
        // Map Teacher ID. Note: homeroomTeacher has User which has ID.
        // We need to set the SELECT value that matches option value.
        // Backend now expects UserID for homeroomTeacherUserId.
        // cls.homeroomTeacher?.user?.id is the USER ID.
        // The Select Options use t.id which is USER ID.
        // So this matches perfectly now!
        if (cls.homeroomTeacher?.user?.id) {
            setValue('homeroomTeacherId', cls.homeroomTeacher.user.id);
        } else {
            setValue('homeroomTeacherId', '');
        }
        setIsCreateModalOpen(true);
    };

    const handleDeleteClick = (cls: ClassEntity) => {
        setSelectedClass(cls);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedClass) {
            await deleteMutation.mutateAsync(selectedClass.id);
            setIsDeleteModalOpen(false);
            setSelectedClass(null);
        }
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setEditingClass(null);
        reset();
    };

    const onCreateSubmit = async (data: any) => {
        try {
            if (editingClass) {
                await updateMutation.mutateAsync({
                    id: editingClass.id,
                    payload: {
                        name: data.name,
                        gradeLevel: parseInt(data.gradeLevel),
                        academicYear: data.academicYear,
                        homeroomTeacherId: data.homeroomTeacherId || null
                    }
                });
            } else {
                await createMutation.mutateAsync({
                    name: data.name,
                    gradeLevel: parseInt(data.gradeLevel),
                    academicYear: data.academicYear,
                    homeroomTeacherId: data.homeroomTeacherId || null
                });
            }
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save class", error);
            alert("Gagal menyimpan kelas.");
        }
    };

    const columns = [
        { header: 'Nama Kelas', accessorKey: 'name' as keyof ClassEntity },
        { header: 'Tingkat', accessorKey: 'gradeLevel' as keyof ClassEntity },
        { header: 'Tahun Ajaran', accessorKey: 'academicYear' as keyof ClassEntity },
        {
            header: 'Wali Kelas',
            cell: (cls: ClassEntity) => cls.homeroomTeacher?.user?.username || '-'
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manajemen Kelas</h1>
                    <p className="text-slate-500">Buat dan atur kelas serta wali kelas.</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus size={18} className="mr-2" />
                    Buat Kelas
                </Button>
            </div>

            <Table
                data={classes}
                columns={columns}
                isLoading={isLoading}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
            />

            {/* CREATE/EDIT MODAL */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                title={editingClass ? "Edit Kelas" : "Buat Kelas Baru"}
            >
                <form onSubmit={handleSubmit(onCreateSubmit)} className="space-y-4">
                    <Input
                        label="Nama Kelas"
                        placeholder="Contoh: 10A"
                        {...register('name', { required: true })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Tingkat"
                            type="number"
                            placeholder="10"
                            {...register('gradeLevel', { required: true })}
                        />
                        <Input
                            label="Tahun Ajaran"
                            placeholder="2024/2025"
                            {...register('academicYear', { required: true })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">Wali Kelas</label>
                        <select
                            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            {...register('homeroomTeacherId')}
                        >
                            <option value="">Pilih Wali Kelas</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.username}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>Batal</Button>
                        <Button type="submit" isLoading={createMutation.isPending || updateMutation.isPending}>
                            {editingClass ? 'Simpan Perubahan' : 'Buat Kelas'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* DELETE MODAL */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus Kelas"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Apakah Anda yakin ingin menghapus kelas <strong>{selectedClass?.name}</strong>?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
                        <Button
                            variant="danger"
                            onClick={confirmDelete}
                            isLoading={deleteMutation.isPending}
                        >
                            Hapus
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
