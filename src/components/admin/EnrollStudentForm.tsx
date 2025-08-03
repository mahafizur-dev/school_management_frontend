import { useForm } from "react-hook-form";
import apiClient from "../../api/axios";
import Button from "../ui/Button";
import { useState } from "react";
import type { User } from "../../types/user.types";

interface EnrollStudentFormProps {
  onSuccess: () => void;
  students: User[]; // All students in the system
  classId: string; // The class to enroll into
}

export default function EnrollStudentForm({
  onSuccess,
  students,
  classId,
}: EnrollStudentFormProps) {
  const { register, handleSubmit, reset } = useForm();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await apiClient.post("/academics/enrollments", {
        studentId: data.studentId,
        classId: classId,
      });
      reset();
      onSuccess();
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to enroll student.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="studentId"
          className="block text-sm font-medium text-gray-700"
        >
          Student
        </label>
        <select
          id="studentId"
          {...register("studentId", { required: true })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a student to enroll</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.firstName} {s.lastName} ({s.email})
            </option>
          ))}
        </select>
      </div>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Enroll Student
        </Button>
      </div>
    </form>
  );
}
