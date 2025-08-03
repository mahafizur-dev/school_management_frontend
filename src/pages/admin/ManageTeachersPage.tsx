import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import type { User } from "../../types/user.types";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CreateTeacherForm from "../../components/admin/CreateTeacherForm";

export default function ManageTeachersPage() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTeachers = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/admin/teachers");
      setTeachers(response.data);
    } catch (err) {
      setError("Failed to fetch teachers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleTeacherCreated = () => {
    setIsModalOpen(false);
    fetchTeachers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Teachers</h1>
        <Button onClick={() => setIsModalOpen(true)} className="w-auto">
          Add New Teacher
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Teacher Account"
      >
        <CreateTeacherForm onSuccess={handleTeacherCreated} />
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
                teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {teacher.firstName} {teacher.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {teacher.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(teacher.createdAt!).toLocaleDateString()}
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
