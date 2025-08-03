import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../api/axios";
import type { Enrollment } from "../../types/academics.types";

export default function ClassRosterPage() {
  const { classId } = useParams<{ classId: string }>(); // Get classId from URL
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [className, setClassName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!classId) return;

    const fetchRoster = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(
          `/academics/classes/${classId}/students`
        );
        setEnrollments(response.data);
        if (response.data.length > 0) {
          setClassName(response.data[0].class.name);
        }
      } catch (err) {
        setError("Failed to fetch class roster.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoster();
  }, [classId]);

  return (
    <div>
      <div className="mb-6">
        <Link to="/teacher/courses" className="text-blue-600 hover:underline">
          &larr; Back to My Courses
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          Class Roster {className && `: ${className}`}
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={2} className="text-center py-4">
                  Loading roster...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={2} className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.student.firstName} {enrollment.student.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.student.email}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-4">
                  No students are enrolled in this class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
