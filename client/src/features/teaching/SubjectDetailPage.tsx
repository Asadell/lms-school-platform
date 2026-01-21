import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubject } from '../../hooks/useSubjects';
import { useMaterials } from '../../hooks/useMaterials';
import { useAssignments } from '../../hooks/useAssignments';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, FileText, Calendar, Plus } from 'lucide-react';
import { formatDate } from '../../lib/utils'; // I need to add this util, but for now I'll just inline or ignore

export default function SubjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: subject, isLoading } = useSubject(id || '');
    const { data: materials = [] } = useMaterials(id);
    const { data: assignments = [] } = useAssignments(id);

    if (isLoading) return <div>Loading...</div>;
    if (!subject) return <div>Subject not found</div>;

    const MaterialTab = (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Daftar Materi</h3>
                <Button size="sm" onClick={() => navigate(`/subjects/${id}/materials/new`)}>
                    <Plus size={16} className="mr-2" /> Tambah Materi
                </Button>
            </div>
            <div className="grid gap-4">
                {materials.length === 0 && <p className="text-slate-500">Belum ada materi.</p>}
                {materials.map((m) => (
                    <Card key={m.id} className="hover:border-brand-200 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{m.title}</h4>
                                <p className="text-xs text-slate-500">
                                    {new Date(m.publishDate).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const AssignmentTab = (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Daftar Tugas</h3>
                <Button size="sm" onClick={() => navigate(`/subjects/${id}/assignments/new`)}>
                    <Plus size={16} className="mr-2" /> Buat Tugas
                </Button>
            </div>
            <div className="grid gap-4">
                {assignments.length === 0 && <p className="text-slate-500">Belum ada tugas.</p>}
                {assignments.map((a) => (
                    <Card key={a.id} className="hover:border-brand-200 transition-colors cursor-pointer">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{a.title}</h4>
                                <p className="text-xs text-slate-500">
                                    Batas: {new Date(a.dueDate).toLocaleDateString('id-ID', {
                                        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="ml-auto text-sm font-bold text-slate-600">
                                {a.maxScore} Poin
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent">
                <ArrowLeft size={18} className="mr-2" /> Kembali
            </Button>

            <div>
                <h1 className="text-3xl font-bold text-slate-900">{subject.name}</h1>
                <p className="text-slate-500 text-lg">{subject.code} • {subject.teacher?.user?.username}</p>
            </div>

            <Tabs
                items={[
                    { label: 'Materi Pembelajaran', content: MaterialTab },
                    { label: 'Tugas & Latihan', content: AssignmentTab },
                ]}
            />
        </div>
    );
}
