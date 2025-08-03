export enum Role {
  Admin = "ADMIN",
  Teacher = "TEACHER",
  Student = "STUDENT",
}

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  createdAt?: string; // Add this line
}
