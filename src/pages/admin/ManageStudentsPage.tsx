import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import type { User } from "../../types/user.types";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CreateStudentForm from "../../components/admin/CreateStudentForm";

export default function ManageStudentsPage() {
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/admin/students");
      setStudents(response.data);
    } catch (err) {
      setError("Failed to fetch students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentCreated = () => {
    setIsModalOpen(false); // Close the modal
    fetchStudents(); // Refresh the student list
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-auto">
          Add New Student
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Student Account"
      >
        <CreateStudentForm onSuccess={handleStudentCreated} />
      </Modal>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
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
              ) : (
                students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(student.createdAt!).toLocaleDateString()}
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
