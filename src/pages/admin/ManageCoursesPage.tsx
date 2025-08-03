import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import type { Class, Subject, Course } from "../../types/academics.types";
import type { User } from "../../types/user.types";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AssignCourseForm from "../../components/admin/AssignCourseForm";

export default function ManageCoursesPage() {
  // State for the data needed for the form
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);

  // State for the list of existing courses
  const [courses, setCourses] = useState<Course[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data concurrently
      const [coursesRes, classesRes, subjectsRes, teachersRes] =
        await Promise.all([
          apiClient.get("/academics/courses"),
          apiClient.get("/academics/classes"),
          apiClient.get("/academics/subjects"),
          apiClient.get("/admin/teachers"),
        ]);
      setCourses(coursesRes.data);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
      setTeachers(teachersRes.data);
    } catch (err) {
      console.error("Failed to fetch course management data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreationSuccess = () => {
    setIsModalOpen(false);
    fetchData(); // Refetch all data to update the list
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Course Assignments
        </h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-auto">
          Assign New Course
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Teacher to Class/Subject"
      >
        <AssignCourseForm
          onSuccess={handleCreationSuccess}
          classes={classes}
          subjects={subjects}
          teachers={teachers}
        />
      </Modal>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teacher
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading assignments...
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course.id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.class.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.subject.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.teacher.firstName} {course.teacher.lastName}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
