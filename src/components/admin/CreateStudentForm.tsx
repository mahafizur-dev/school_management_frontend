import { useForm } from "react-hook-form";
import apiClient from "../../api/axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useState } from "react";

interface CreateStudentFormProps {
  onSuccess: () => void; // Callback to run after successful creation
}

export default function CreateStudentForm({
  onSuccess,
}: CreateStudentFormProps) {
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
      await apiClient.post("/admin/students", data);
      reset(); // Clear the form
      onSuccess(); // Trigger parent component's success logic (e.g., close modal, refetch data)
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Failed to create student.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Email Address"
        type="email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message as string}</p>
      )}

      <Input
        placeholder="First Name"
        {...register("firstName", { required: "First name is required" })}
      />
      {errors.firstName && (
        <p className="text-red-500 text-sm">
          {errors.firstName.message as string}
        </p>
      )}

      <Input
        placeholder="Last Name"
        {...register("lastName", { required: "Last name is required" })}
      />
      {errors.lastName && (
        <p className="text-red-500 text-sm">
          {errors.lastName.message as string}
        </p>
      )}

      <Input
        placeholder="Password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />
      {errors.password && (
        <p className="text-red-500 text-sm">
          {errors.password.message as string}
        </p>
      )}

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Create Student
        </Button>
      </div>
    </form>
  );
}
