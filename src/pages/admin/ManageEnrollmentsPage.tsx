import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import type { Class } from "../../types/academics.types";
import type { User } from "../../types/user.types";
import type { Enrollment } from "../../types/academics.types";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import EnrollStudentForm from "../../components/admin/EnrollStudentForm";

export default function ManageEnrollmentsPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [allStudents, setAllStudents] = useState<User[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [enrolledStudents, setEnrolledStudents] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch initial data (all classes and all students)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesRes, studentsRes] = await Promise.all([
          apiClient.get("/academics/classes"),
          apiClient.get("/admin/students"),
        ]);
        setClasses(classesRes.data);
        setAllStudents(studentsRes.data);
      } catch (err) {
        console.error("Failed to fetch initial data", err);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch enrolled students when a class is selected
  useEffect(() => {
    if (!selectedClass) {
      setEnrolledStudents([]);
      return;
    }
    const fetchEnrolledStudents = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/academics/classes/${selectedClass}/students`
        );
        setEnrolledStudents(response.data);
      } catch (err) {
        console.error("Failed to fetch enrolled students", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrolledStudents();
  }, [selectedClass]);

  const handleEnrollmentSuccess = () => {
    setIsModalOpen(false);
    // Refetch the list of enrolled students for the currently selected class
    const fetchEnrolledStudents = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(
          `/academics/classes/${selectedClass}/students`
        );
        setEnrolledStudents(response.data);
      } catch (err) {
        console.error("Failed to fetch enrolled students", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrolledStudents();
  };

  // Filter out already enrolled students from the dropdown in the modal
  const unrolledStudents = allStudents.filter(
    (student) =>
      !enrolledStudents.some((enrolled) => enrolled.student.id === student.id)
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Manage Student Enrollments
      </h1>

      {/* Class Selector */}
      <div className="mb-6 max-w-sm">
        <label
          htmlFor="classSelector"
          className="block text-sm font-medium text-gray-700"
        >
          Select a Class to View Roster
        </label>
        <select
          id="classSelector"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">-- Select a Class --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Class Roster</h2>
            <Button onClick={() => setIsModalOpen(true)} className="w-auto">
              Enroll New Student
            </Button>
          </div>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={`Enroll Student in ${
              classes.find((c) => c.id === selectedClass)?.name
            }`}
          >
            <EnrollStudentForm
              onSuccess={handleEnrollmentSuccess}
              students={unrolledStudents}
              classId={selectedClass}
            />
          </Modal>

          {/* Enrolled Students Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
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
                ) : enrolledStudents.length > 0 ? (
                  enrolledStudents.map((enrollment) => (
                    <tr key={enrollment.id} className="bg-white">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {enrollment.student.firstName}{" "}
                        {enrollment.student.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {enrollment.student.email}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-4">
                      No students enrolled in this class.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
