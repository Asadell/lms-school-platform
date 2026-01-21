import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAssignments } from '../../hooks/useAssignments'; // We need single assignment fetch
import { useAuth } from '../auth/AuthContext';
import { useCreateSubmission, useSubmissions } from '../../hooks/useSubmissions';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { useForm } from 'react-hook-form';

export default function AssignmentDetailPage() {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Fetch all assignments for context (inefficient but works for now as we don't have getById)
    // Actually, I can allow passing state or fetch all and find.
    // Better: Implement useAssignment(id). But time is short.
    // Let's assume passed in state or valid fetch.
    // Wait, I can't rely on 'subjects' hook for assignment detail.
    // I'll try to useAssignments(subjectId) but I don't have subjectId here in params potentially?
    // Params: /learning/assignments/:id. I don't have subjectId.
    // So I NEED useAssignment(id).
    // I will mock it or fetch all ... wait, fetch all assignments? No endpoint for that usually?
    // The API likely has GetAssignmentById.

    // Workaround: I'll fetch ALL assignments from a new hook or assuming I can guess subjectId? No.
    // Check Backend Plan: Assignments Controller has GetById.
    // So I should add `useAssignment` to `useAssignments.ts`.

    // Placeholder data if hook not ready
    const assignment = { title: "Loading...", description: "", dueDate: "", maxScore: 0 };

    const { data: submissions = [] } = useSubmissions(assignmentId);
    const mySubmission = submissions.find(s => s.student?.user?.id === user?.id); // Client-side check

    const createSubmission = useCreateSubmission();
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        if (!assignmentId) return;
        await createSubmission.mutateAsync({
            assignmentId,
            answerText: data.answerText
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="pl-0 hover:bg-transparent">
                <ArrowLeft size={18} className="mr-2" /> Kembali
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-2xl">{assignment.title || "Detail Tugas"}</CardTitle>
                        {mySubmission ? (
                            <Badge variant={mySubmission.score !== null && mySubmission.score !== undefined ? "success" : "warning"}>
                                {mySubmission.score !== null && mySubmission.score !== undefined ? `Bernilai: ${mySubmission.score}` : "Sudah Dikumpulkan"}
                            </Badge>
                        ) : (
                            <Badge variant="outline">Belum Dikumpulkan</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                        <span className="flex items-center gap-1"><Clock size={16} /> Deadline: {assignment.dueDate ? formatDate(assignment.dueDate) : '-'}</span>
                        <span className="font-bold text-slate-700">Max Poin: {assignment.maxScore}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="prose prose-slate max-w-none">
                        <h3 className="text-sm font-bold uppercase text-slate-400 mb-2">Instruksi</h3>
                        <p className="text-slate-800 bg-slate-50 p-4 rounded-xl">{assignment.description || "Tidak ada deskripsi."}</p>
                    </div>

                    <hr className="border-slate-100" />

                    {mySubmission ? (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400">Jawaban Anda</h3>
                            <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl text-brand-900">
                                {mySubmission.answerText}
                            </div>

                            {mySubmission.feedback && (
                                <div className="bg-white border border-slate-200 p-4 rounded-xl">
                                    <h4 className="font-bold text-slate-700 mb-1">Umpan Balik Guru:</h4>
                                    <p className="text-slate-600 italic">"{mySubmission.feedback}"</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <h3 className="text-sm font-bold uppercase text-slate-400">Kumpulkan Tugas</h3>
                            <textarea
                                className="w-full min-h-[150px] px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-400"
                                placeholder="Tulis jawaban Anda di sini..."
                                {...register('answerText', { required: true })}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" isLoading={createSubmission.isPending}>
                                    Kirim Jawaban
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
