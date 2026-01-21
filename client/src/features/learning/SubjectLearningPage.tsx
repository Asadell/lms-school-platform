import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubject } from '../../hooks/useSubjects';
import { useMaterials } from '../../hooks/useMaterials';
import { useAssignments } from '../../hooks/useAssignments';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { ArrowLeft, FileText, Calendar, CheckCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useAuth } from '../auth/AuthContext';
// import { useSubmissions } from '../../hooks/useSubmissions'; 
// Ideally we check if student already submitted assignment to show status.
// That requires fetching submissions filtered by student & assignment.
// `useAssignments` hooks might need to return `mySubmission` status if backend supports it, 
// OR we fetch all submissions for this assignment and check if my id is in it.
// Current `useSubmissions` fetches ALL submissions (admin/teacher view). 
// Student shouldn't see all. 
// Assuming for MVP we just let them click "View" and handle state there.

export default function SubjectLearningPage() {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const { data: subject, isLoading } = useSubject(subjectId || '');
    const { data: materials = [] } = useMaterials(subjectId);
    const { data: assignments = [] } = useAssignments(subjectId);

    if (isLoading) return <div>Loading...</div>;
    if (!subject) return <div>Subject not found</div>;

    const MaterialTab = (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Materi Pembelajaran</h3>
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
                                    Diposts: {formatDate(m.publishDate)}
                                </p>
                                {/* Content preview or open modal/page? For now just expand or let it be text */}
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{m.content}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );

    const AssignmentTab = (
        <div className="space-y-4">
            <h3 className="text-lg font-bold">Tugas & Latihan</h3>
            <div className="grid gap-4">
                {assignments.length === 0 && <p className="text-slate-500">Belum ada tugas.</p>}
                {assignments.map((a) => (
                    <Card key={a.id} className="hover:border-brand-200 transition-colors cursor-pointer" onClick={() => navigate(`/learning/assignments/${a.id}`)}>
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                                <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800">{a.title}</h4>
                                <p className="text-xs text-slate-500">
                                    Deadline: {formatDate(a.dueDate)}
                                </p>
                            </div>
                            <div className="text-right">
                                <Button size="sm" variant="outline">Detail</Button>
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
                    { label: 'Materi', content: MaterialTab },
                    { label: 'Tugas', content: AssignmentTab },
                ]}
            />
        </div>
    );
}
