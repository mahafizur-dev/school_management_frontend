import { useForm } from "react-hook-form";
import apiClient from "../../api/axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useState } from "react";

interface CreateClassFormProps {
  onSuccess: () => void;
}

export default function CreateClassForm({ onSuccess }: CreateClassFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await apiClient.post("/academics/classes", data);
      reset();
      onSuccess();
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to create class.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Class Name (e.g., Grade 10 - Section A)"
        {...register("name", { required: "Class name is required" })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message as string}</p>
      )}

      <Input
        placeholder="Academic Year (e.g., 2024-2025)"
        {...register("academicYear", { required: "Academic year is required" })}
      />
      {errors.academicYear && (
        <p className="text-red-500 text-sm">
          {errors.academicYear.message as string}
        </p>
      )}

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Create Class
        </Button>
      </div>
    </form>
  );
}
