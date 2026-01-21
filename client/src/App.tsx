import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { RequireAuth } from './components/guard/RequireAuth';
import { AuthLayout } from './components/layout/AuthLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import LoginPage from './features/auth/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import UsersPage from './features/admin/UsersPage';
import ClassesPage from './features/admin/ClassesPage';
import SubjectsPage from './features/teaching/SubjectsPage';
import SubjectDetailPage from './features/teaching/SubjectDetailPage';
import MaterialFormPage from './features/teaching/MaterialFormPage';
import AssignmentFormPage from './features/teaching/AssignmentFormPage';
import GradingPage from './features/grading/GradingPage';
import MyClassesPage from './features/learning/MyClassesPage';
import ClassDetailPage from './features/learning/ClassDetailPage';
import SubjectLearningPage from './features/learning/SubjectLearningPage';
import AssignmentDetailPage from './features/learning/AssignmentDetailPage';
import { RoleGuard } from './components/guard/RoleGuard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />

            {/* Admin Routes */}
            <Route element={<RoleGuard roles={['admin']} />}>
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/classes" element={<ClassesPage />} />
            </Route>

            {/* Teacher Routes */}
            <Route element={<RoleGuard roles={['teacher', 'admin']} />}>
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:id" element={<SubjectDetailPage />} />
              <Route path="/subjects/:subjectId/materials/new" element={<MaterialFormPage />} />
              <Route path="/subjects/:subjectId/assignments/new" element={<AssignmentFormPage />} />
              <Route path="/assignments/:assignmentId/grading" element={<GradingPage />} />
            </Route>

            {/* Student Routes */}
            <Route element={<RoleGuard roles={['student', 'admin']} />}>
              <Route path="/my-classes" element={<MyClassesPage />} />
              <Route path="/my-classes/:id" element={<ClassDetailPage />} />
              <Route path="/learning/:subjectId" element={<SubjectLearningPage />} />
              <Route path="/learning/assignments/:assignmentId" element={<AssignmentDetailPage />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
