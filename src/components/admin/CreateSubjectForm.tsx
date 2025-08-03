import { useForm } from "react-hook-form";
import apiClient from "../../api/axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useState } from "react";

interface CreateSubjectFormProps {
  onSuccess: () => void;
}

export default function CreateSubjectForm({
  onSuccess,
}: CreateSubjectFormProps) {
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
      await apiClient.post("/academics/subjects", data);
      reset();
      onSuccess();
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to create subject.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Subject Name (e.g., Mathematics)"
        {...register("name", { required: "Subject name is required" })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message as string}</p>
      )}

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Create Subject
        </Button>
      </div>
    </form>
  );
}
