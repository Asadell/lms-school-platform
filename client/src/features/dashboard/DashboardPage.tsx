import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export default function DashboardPage() {
    const { user } = useAuth();
    const isTeacher = user?.role === 'teacher';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isTeacher ? 'Ruang Guru' : 'Ruang Belajar'}
                    </h1>
                    <p className="text-slate-500">Selamat datang kembali, {user?.username}!</p>
                </div>
                <div className="text-sm font-medium text-brand-600 bg-brand-50 px-4 py-2 rounded-lg">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-brand-500">
                    <CardHeader>
                        <CardTitle>Jadwal Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 text-sm">Tidak ada jadwal kelas saat ini.</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-accent-500">
                    <CardHeader>
                        <CardTitle>{isTeacher ? 'Perlu Dinilai' : 'Tugas Mendatang'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 text-sm">Semua tugas aman terkendali.</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-success-500">
                    <CardHeader>
                        <CardTitle>Pengumuman</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-slate-500 text-sm">Selamat datang di semester baru!</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
