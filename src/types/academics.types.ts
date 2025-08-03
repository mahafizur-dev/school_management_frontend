import type { User } from "./user.types";

export interface Class {
  id: string;
  name: string;
  academicYear: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  createdAt: string;
}

// Add the new Course type
export interface Course {
  id: string;
  class: Class;
  subject: Subject;
  teacher: User;
}

export interface Enrollment {
  id: string;
  student: User;
  class: Class;
}
export interface Grade {
  id: string;
  grade: string;
  term: string;
  student: User;
  course: Course;
  teacher: User;
}
