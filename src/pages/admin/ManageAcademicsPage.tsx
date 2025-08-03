import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import type { Class, Subject } from "../../types/academics.types";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import CreateClassForm from "../../components/admin/CreateClassForm";
import CreateSubjectForm from "../../components/admin/CreateSubjectForm";

export default function ManageAcademicsPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        apiClient.get("/academics/classes"),
        apiClient.get("/academics/subjects"),
      ]);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      console.error("Failed to fetch academic data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreationSuccess = () => {
    setIsClassModalOpen(false);
    setIsSubjectModalOpen(false);
    fetchData(); // Refetch all data
  };

  if (isLoading) return <div>Loading academic data...</div>;

  return (
    <div className="space-y-8">
      {/* Classes Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Manage Classes</h2>
          <Button onClick={() => setIsClassModalOpen(true)} className="w-auto">
            Add New Class
          </Button>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Academic Year
                </th>
              </tr>
            </thead>
            <tbody>
              {classes.map((c) => (
                <tr key={c.id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {c.academicYear}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subjects Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Manage Subjects</h2>
          <Button
            onClick={() => setIsSubjectModalOpen(true)}
            className="w-auto"
          >
            Add New Subject
          </Button>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject Name
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap">{s.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        title="Create New Class"
      >
        <CreateClassForm onSuccess={handleCreationSuccess} />
      </Modal>
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Create New Subject"
      >
        <CreateSubjectForm onSuccess={handleCreationSuccess} />
      </Modal>
    </div>
  );
}
