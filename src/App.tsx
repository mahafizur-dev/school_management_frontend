import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/Login";
import DashboardPage from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { Role } from "./types/user.types";

// Placeholder pages for demonstration
import AdminDashboard from "./pages/admin/AdminDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import ManageStudentsPage from "./pages/admin/ManageStudentsPage";
import ManageTeachersPage from "./pages/admin/ManageTeachersPage";
import ManageAcademicsPage from "./pages/admin/ManageAcademicsPage";
import ManageCoursesPage from "./pages/admin/ManageCoursesPage";
import ManageEnrollmentsPage from "./pages/admin/ManageEnrollmentsPage";
import ManageFinancesPage from "./pages/admin/ManageFinancesPage";
import MyCoursesPage from "./pages/teacher/MyCoursesPage";
import ClassRosterPage from "./pages/teacher/ClassRosterPage";
import ManageGradesPage from "./pages/teacher/ManageGradesPage";
import StudentCoursesPage from "./pages/student/StudentCoursesPage";
import StudentGradesPage from "./pages/student/StudentGradesPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedRoute />, // First, check for authentication
    children: [
      {
        element: <DashboardLayout />, // Then, wrap with the main layout
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />, // Redirect root to dashboard
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          // Admin Routes
          {
            element: <RoleBasedRoute allowedRoles={[Role.Admin]} />,
            children: [
              { path: "admin/students", element: <ManageStudentsPage /> },
              { path: "admin/teachers", element: <ManageTeachersPage /> },
              { path: "admin/academics", element: <ManageAcademicsPage /> },
              { path: "admin/finances", element: <AdminDashboard /> },
              { path: "admin/courses", element: <ManageCoursesPage /> },
              { path: "admin/enrollments", element: <ManageEnrollmentsPage /> },
              { path: "admin/finances", element: <ManageFinancesPage /> },
              { path: "teacher/courses", element: <MyCoursesPage /> },
              { path: "teacher/roster/:classId", element: <ClassRosterPage /> },
              {
                path: "teacher/grades/:classId",
                element: <ManageGradesPage />,
              },
              { path: "student/my-courses", element: <StudentCoursesPage /> },
              { path: "student/my-grades", element: <StudentGradesPage /> },
            ],
          },
          // Teacher Routes
          {
            element: <RoleBasedRoute allowedRoles={[Role.Teacher]} />,
            children: [
              { path: "teacher/courses", element: <TeacherDashboard /> }, // Replace with actual component
            ],
          },
          // Student Routes
          {
            element: <RoleBasedRoute allowedRoles={[Role.Student]} />,
            children: [
              // Add student-specific routes here
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
