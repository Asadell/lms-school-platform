import React, { useState } from 'react';
import { useUsers, useDeleteUser, type User } from '../../hooks/useUsers';
import { Table } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { Plus } from 'lucide-react';

export default function UsersPage() {
    const { data: users = [], isLoading } = useUsers();
    const deleteMutation = useDeleteUser();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedUser) {
            await deleteMutation.mutateAsync(selectedUser.id);
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
        }
    };

    const columns = [
        { header: 'Username', accessorKey: 'username' as keyof User },
        { header: 'Email', accessorKey: 'email' as keyof User },
        {
            header: 'Role',
            cell: (user: User) => (
                <Badge
                    variant={user.role === 'admin' ? 'error' : user.role === 'teacher' ? 'warning' : 'outline'}
                    className="capitalize"
                >
                    {user.role}
                </Badge>
            )
        },
        {
            header: 'Status',
            cell: (user: User) => (
                <Badge variant={user.isActive ? 'success' : 'default'} className="lowercase">
                    {user.isActive ? 'active' : 'inactive'}
                </Badge>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
                    <p className="text-slate-500">Kelola akun guru, siswa, dan admin.</p>
                </div>
                <Button>
                    <Plus size={18} className="mr-2" />
                    Tambah User
                </Button>
            </div>

            <Table
                data={users}
                columns={columns}
                isLoading={isLoading}
                onDelete={handleDeleteClick}
                onEdit={(user) => console.log('Edit', user)}
            />

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Hapus Pengguna"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.username}</strong>?
                        Tindakan ini tidak dapat dibatalkan.
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
