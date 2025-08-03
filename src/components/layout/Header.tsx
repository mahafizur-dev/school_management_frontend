import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import Button from "../ui/Button";

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-end bg-white shadow-sm px-4 py-3">
      <div className="flex items-center">
        <span className="text-gray-700 mr-4">
          Welcome, {user?.firstName} {user?.lastName}
        </span>
        <div className="w-24">
          <Button onClick={handleLogout} className="py-1">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
