import { User, Settings, CreditCard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

interface ProfileDropdownProps {
  user: UserProfile | null;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileDropdown = ({
  user,
  onClose,
  onLogout,
}: ProfileDropdownProps) => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="dropdown-menu absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1117]/95 backdrop-blur-sm shadow-lg dark:shadow-2xl">
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
            <span className="text-sm font-medium text-purple-600 dark:text-purple-500">
              {user?.firstName?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.firstName || "User"} {user?.lastName || ""}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <button
          onClick={() => handleNavigation("/profile")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-left"
        >
          <User className="w-4 h-4" />
          Your Profile
        </button>
        <button
          onClick={() => handleNavigation("/settings")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-left"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button
          onClick={() => handleNavigation("/settings/subscription")}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors text-left"
        >
          <CreditCard className="w-4 h-4" />
          Subscription
        </button>
      </div>

      <div className="p-2 border-t border-gray-200 dark:border-white/[0.08]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
