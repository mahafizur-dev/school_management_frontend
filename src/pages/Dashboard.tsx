import { useAuthStore } from "../store/auth.store";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
      <p>Your role is: {user?.role}</p>
      <div className="mt-4 w-32">
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}
