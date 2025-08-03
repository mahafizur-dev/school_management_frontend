import { useForm } from "react-hook-form";
import apiClient from "../../api/axios";
import Button from "../ui/Button";
import { useState } from "react";
import type { Class, Subject } from "../../types/academics.types";
import type { User } from "../../types/user.types";

interface AssignCourseFormProps {
  onSuccess: () => void;
  classes: Class[];
  subjects: Subject[];
  teachers: User[];
}

export default function AssignCourseForm({
  onSuccess,
  classes,
  subjects,
  teachers,
}: AssignCourseFormProps) {
  const { register, handleSubmit, reset } = useForm();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await apiClient.post("/academics/courses", data);
      reset();
      onSuccess();
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to assign course.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="classId"
          className="block text-sm font-medium text-gray-700"
        >
          Class
        </label>
        <select
          id="classId"
          {...register("classId", { required: true })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="subjectId"
          className="block text-sm font-medium text-gray-700"
        >
          Subject
        </label>
        <select
          id="subjectId"
          {...register("subjectId", { required: true })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="teacherId"
          className="block text-sm font-medium text-gray-700"
        >
          Teacher
        </label>
        <select
          id="teacherId"
          {...register("teacherId", { required: true })}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">Select a teacher</option>
          {teachers.map((t) => (
            <option key={t.id} value={t.id}>
              {t.firstName} {t.lastName}
            </option>
          ))}
        </select>
      </div>

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Assign Course
        </Button>
      </div>
    </form>
  );
}
