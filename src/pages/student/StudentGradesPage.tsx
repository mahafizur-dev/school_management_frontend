import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import type { Grade } from "../../types/academics.types";

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/academics/student/my-grades");
        setGrades(response.data);
      } catch (err) {
        setError("Failed to fetch your grades.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Grades</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Term
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Grade
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Loading your grades...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-red-500">
                  {error}
                </td>
              </tr>
            ) : grades.length > 0 ? (
              grades.map((grade) => (
                <tr key={grade.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {grade.course.subject.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{grade.term}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">
                    {grade.grade}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No grades have been recorded for you yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
