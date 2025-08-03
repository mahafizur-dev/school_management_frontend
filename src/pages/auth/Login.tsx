import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import apiClient from "../../api/axios";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

interface LoginResponse {
  access_token: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { setToken, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Get access token
      const response = await apiClient.post<LoginResponse>("/auth/login", data);
      const token = response.data.access_token;
      setToken(token);

      // 2. Get user profile
      const profileResponse = await apiClient.get("/auth/profile");
      setUser(profileResponse.data);

      // 3. Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  {...register("email")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  {...register("password")}
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <Button type="submit" isLoading={isLoading}>
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
