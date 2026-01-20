import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClass } from '../../hooks/useClasses'; // Get single class
import { useSubjects } from '../../hooks/useSubjects'; // We need subjects for this class?
// Actually Subjects are linked to Class? 
// The Subject entity has `classId`? Let's check.
// Looking at backend... Subject has `ClassId`.
// So we can fetch subjects filtered by ClassId.
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, BookOpen, ArrowRight } from 'lucide-react';

export default function ClassDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: classData, isLoading: classLoading } = useClass(id || '');
    const { data: allSubjects = [], isLoading: subjectsLoading } = useSubjects();

    // Filter subjects for this class
    const classSubjects = allSubjects.filter(s => s.classId === id);

    if (classLoading || subjectsLoading) return <div>Loading...</div>;
    if (!classData) return <div>Kelas tidak ditemukan</div>;

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent">
                <ArrowLeft size={18} className="mr-2" /> Kembali
            </Button>

            <div>
                <h1 className="text-3xl font-bold text-slate-900">{classData.name}</h1>
                <p className="text-slate-500">Pilih mata pelajaran untuk mulai belajar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classSubjects.length === 0 && <p className="text-slate-500">Belum ada mata pelajaran di kelas ini.</p>}

                {classSubjects.map((subject) => (
                    <Link key={subject.id} to={`/learning/${subject.id}`} className="block group">
                        <Card className="h-full hover:shadow-md transition-shadow border-blue-100">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <BookOpen size={24} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                    {subject.name}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">{subject.code} • {subject.teacher?.user?.username}</p>

                                <div className="mt-auto flex items-center text-sm font-medium text-blue-600">
                                    Buka Mapel <ArrowRight size={16} className="ml-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
