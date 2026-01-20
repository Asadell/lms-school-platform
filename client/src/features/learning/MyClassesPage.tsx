import React from 'react';
import { useClasses } from '../../hooks/useClasses';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Users, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function MyClassesPage() {
    const { user } = useAuth();
    // In a real app we'd filter by student ID, but useClasses gets all.
    // We'll filter client side for now assuming 'all' means all classes in school or something.
    // Actually, students should only see THEIR classes.
    // Assuming the API returns relevant classes or we filter by checking student list?
    // The 'Class' entity has 'students'.
    const { data: classes = [], isLoading } = useClasses();

    const myClasses = classes.filter(c =>
        c.students?.some(s => s.user?.id === user?.id)
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Kelas Saya</h1>
                <p className="text-slate-500">Daftar kelas yang Anda ikuti.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && <p>Memuat kelas...</p>}
                {!isLoading && myClasses.length === 0 && (
                    <div className="col-span-3 text-center py-10 bg-slate-50 rounded-xl">
                        <p className="text-slate-500">Anda belum terdaftar di kelas manapun.</p>
                    </div>
                )}

                {myClasses.map((cls) => (
                    <Link key={cls.id} to={`/my-classes/${cls.id}`} className="block group">
                        <Card className="h-full hover:shadow-md transition-shadow border-brand-100">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                        <Users size={24} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                                    {cls.name}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Wali Kelas: {cls.teacher?.user?.username || 'Belum ditentukan'}
                                </p>

                                <div className="mt-auto flex items-center text-sm font-medium text-brand-600">
                                    Masuk Kelas <ArrowRight size={16} className="ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
