import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssignments } from '../../hooks/useAssignments';
import { useSubmissions, useGradeSubmission } from '../../hooks/useSubmissions';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Table } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formatDate } from '../../lib/utils';

export default function GradingPage() {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const navigate = useNavigate();

    // We need to fetch the assignment details to know max score etc.
    // Currently useAssignments fetches all for a subject. 
    // We might need useAssignment(id) hook.
    // For now, I'll assume I can pass the assignment details via state or fetch it.
    // But wait, the previous page was SubjectDetail -> Assignment Tab.
    // So I should have a route /assignments/:id/grading

    const { data: submissions = [], isLoading } = useSubmissions(assignmentId);
    const gradeMutation = useGradeSubmission();

    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const { register, handleSubmit, reset } = useForm();

    const onGradeSubmit = async (data: any) => {
        if (!selectedSubmission) return;

        await gradeMutation.mutateAsync({
            id: selectedSubmission.id,
            payload: {
                score: parseInt(data.grade),
                feedback: data.feedback
            }
        });

        setSelectedSubmission(null);
        reset();
    };

    const openGradeModal = (submission: any) => {
        setSelectedSubmission(submission);
        reset({
            grade: submission.grade,
            feedback: submission.feedback
        });
    };

    const columns = [
        { header: 'Siswa', accessor: (s: any) => s.student?.user?.username || 'Unknown' },
        { header: 'Tanggal Kumpul', accessor: (s: any) => formatDate(s.submittedAt) },
        {
            header: 'Status', accessor: (s: any) => (
                s.score !== null && s.score !== undefined
                    ? <Badge variant="success">Dinilai ({s.score})</Badge>
                    : <Badge variant="warning">Perlu Dinilai</Badge>
            )
        },
        {
            header: 'File', accessor: (s: any) => (
                <a href={s.content} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
                    Lihat Tugas
                </a>
            )
        },
        {
            header: 'Aksi', accessor: (s: any) => (
                <Button size="sm" onClick={() => openGradeModal(s)}>
                    Nilai
                </Button>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent">
                <ArrowLeft size={18} className="mr-2" /> Kembali ke Tugas
            </Button>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">Penilaian Tugas</h1>
                <p className="text-slate-500">Daftar pengumpulan tugas siswa</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table
                        columns={columns}
                        data={submissions}
                        isLoading={isLoading}
                        emptyMessage="Belum ada pengumpulan tugas."
                    />
                </CardContent>
            </Card>

            <Modal
                isOpen={!!selectedSubmission}
                onClose={() => setSelectedSubmission(null)}
                title={`Nilai Tugas: ${selectedSubmission?.student?.user?.username}`}
            >
                <form onSubmit={handleSubmit(onGradeSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-slate-600">
                            Isi Jawaban: <br />
                            <span className="italic text-slate-800 bg-slate-50 p-2 rounded block mt-1">
                                {selectedSubmission?.content || "Tidak ada konten text"}
                            </span>
                        </p>
                    </div>

                    <Input
                        type="number"
                        label="Nilai"
                        placeholder="0-100"
                        {...register('grade', { required: true, min: 0, max: 100 })}
                    />

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Feedback</label>
                        <textarea
                            className="w-full min-h-[100px] px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400"
                            placeholder="Berikan masukan..."
                            {...register('feedback')}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setSelectedSubmission(null)}>Batal</Button>
                        <Button type="submit" isLoading={gradeMutation.isPending}>Simpan Nilai</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
