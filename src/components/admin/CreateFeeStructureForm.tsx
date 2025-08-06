import { useForm } from "react-hook-form";
import apiClient from "../../api/axios";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { useState } from "react";

interface CreateFeeStructureFormProps {
  onSuccess: () => void;
}

export default function CreateFeeStructureForm({
  onSuccess,
}: CreateFeeStructureFormProps) {
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
      // Convert amount to a number before sending
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
      };
      await apiClient.post("/financials/fee-structures", payload);
      reset();
      onSuccess();
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || "Failed to create fee structure."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        placeholder="Fee Name (e.g., Annual Tuition 2025)"
        {...register("name", { required: "Fee name is required" })}
      />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message as string}</p>
      )}

      <Input
        placeholder="Description"
        {...register("description", { required: "Description is required" })}
      />
      {errors.description && (
        <p className="text-red-500 text-sm">
          {errors.description.message as string}
        </p>
      )}

      <Input
        placeholder="Amount"
        type="number"
        step="0.01"
        {...register("amount", {
          required: "Amount is required",
          valueAsNumber: true,
        })}
      />
      {errors.amount && (
        <p className="text-red-500 text-sm">
          {errors.amount.message as string}
        </p>
      )}

      {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

      <div className="flex justify-end pt-2">
        <Button type="submit" isLoading={isLoading}>
          Create Fee
        </Button>
      </div>
    </form>
  );
}
