import { NavLink as RouterNavLink } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { navLinks } from "../../layouts/navLinks";

export default function Sidebar() {
  const { user } = useAuthStore();

  const filteredNavLinks = navLinks.filter(
    (link) => user?.role && link.allowedRoles.includes(user.role)
  );

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold">
        <span className="text-blue-400">School</span>MS
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {filteredNavLinks.map((link) => (
          <RouterNavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2.5 rounded-md transition duration-200 ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`
            }
          >
            {link.label}
          </RouterNavLink>
        ))}
      </nav>
    </div>
  );
}
