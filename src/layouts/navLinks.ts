import { Role } from "../types/user.types";

export interface NavLink {
  path: string;
  label: string;
  allowedRoles: Role[];
}

export const navLinks: NavLink[] = [
  // Common
  {
    path: "/dashboard",
    label: "Dashboard",
    allowedRoles: [Role.Admin, Role.Teacher, Role.Student],
  },

  // Admin Links
  {
    path: "/admin/students",
    label: "Manage Students",
    allowedRoles: [Role.Admin],
  },
  {
    path: "/admin/teachers",
    label: "Manage Teachers",
    allowedRoles: [Role.Admin],
  },
  { path: "/admin/finances", label: "Financials", allowedRoles: [Role.Admin] },
  {
    path: "/admin/academics",
    label: "Manage Academics",
    allowedRoles: [Role.Admin],
  },
  {
    path: "/admin/courses",
    label: "Course Assignments",
    allowedRoles: [Role.Admin],
  },
  {
    path: "/admin/enrollments",
    label: "Student Enrollment",
    allowedRoles: [Role.Admin],
  },

  // Teacher Links
  {
    path: "/teacher/courses",
    label: "My Courses",
    allowedRoles: [Role.Teacher],
  },
  {
    path: "/teacher/grades",
    label: "Enter Grades",
    allowedRoles: [Role.Teacher],
  },

  // Student Links
  {
    path: "/student/my-grades",
    label: "My Grades",
    allowedRoles: [Role.Student],
  },
  {
    path: "/student/my-courses",
    label: "My Courses",
    allowedRoles: [Role.Student],
  },
];
