import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../api/axios";
import type { Enrollment, Grade, Course } from "../../types/academics.types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ManageGradesPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Record<string, string>>({}); // studentId -> grade
  const [course, setCourse] = useState<Course | null>(null);
  const [term, setTerm] = useState("Mid-Term");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all courses and find the one we need
        const coursesRes = await apiClient.get(`/academics/courses`);
        const courseData = coursesRes.data.find(
          (c: Course) => c.id === courseId
        );
        if (!courseData) throw new Error("Course not found");

        const classId = courseData.class.id;

        // Fetch enrollments and grades in parallel
        const [enrollmentsRes, gradesRes] = await Promise.all([
          apiClient.get(`/academics/classes/${classId}/students`),
          apiClient.get(`/academics/grades/course/${courseId}`),
        ]);

        setCourse(courseData);
        setEnrollments(enrollmentsRes.data);

        // Pre-fill grades for the current term
        const initialGrades: Record<string, string> = {};
        gradesRes.data.forEach((g: Grade) => {
          if (g.term === term) {
            initialGrades[g.student.id] = g.grade;
          }
        });
        setGrades(initialGrades);
      } catch (err) {
        console.error("Failed to fetch data for grading", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, term]);

  const handleGradeChange = (studentId: string, grade: string) => {
    setGrades((prev) => ({ ...prev, [studentId]: grade }));
  };

  const handleSaveGrade = async (studentId: string) => {
    const grade = grades[studentId];
    if (!grade || !term) {
      alert("Please enter a grade and a term.");
      return;
    }
    try {
      await apiClient.post("/academics/grades", {
        studentId,
        courseId,
        grade,
        term,
      });
      alert(`Grade for student saved successfully!`);
    } catch (err) {
      console.error("Failed to save grade", err);
      alert("Failed to save grade.");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-6">
        <Link to="/teacher/courses" className="text-blue-600 hover:underline">
          &larr; Back to My Courses
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          Enter Grades for {course?.subject.name} - {course?.class.name}
        </h1>
      </div>

      <div className="mb-6 max-w-xs">
        <label
          htmlFor="term"
          className="block text-sm font-medium text-gray-700"
        >
          Grading Term
        </label>
        <Input
          id="term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(({ student }) => (
              <tr key={student.id} className="bg-white">
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.firstName} {student.lastName}
                </td>
                <td className="px-6 py-4">
                  <Input
                    className="max-w-xs"
                    value={grades[student.id] || ""}
                    onChange={(e) =>
                      handleGradeChange(student.id, e.target.value)
                    }
                  />
                </td>
                <td className="px-6 py-4">
                  <Button
                    onClick={() => handleSaveGrade(student.id)}
                    className="w-auto py-1.5"
                  >
                    Save
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
