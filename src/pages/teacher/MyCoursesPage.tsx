import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../api/axios";
import type { Course } from "../../types/academics.types";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/academics/my-courses");
        setCourses(response.data);
      } catch (err) {
        setError("Failed to fetch courses.");
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
      <p className="mb-4 text-gray-600">
        Select a course to view the student roster or manage grades.
      </p>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No courses found.
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {course.subject.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {course.class.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                      <Link
                        to={`/teacher/roster/${course.class.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Roster
                      </Link>
                      <Link
                        to={`/teacher/grades/${course.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Manage Grades
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
