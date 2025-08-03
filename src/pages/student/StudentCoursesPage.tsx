import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import type { Course } from "../../types/academics.types";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/academics/student/my-courses");
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch your courses.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Class
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading your courses...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {course.subject.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {course.teacher.firstName} {course.teacher.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {course.class.name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  You are not enrolled in any courses.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
