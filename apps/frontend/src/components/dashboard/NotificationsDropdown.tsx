import { Bell, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onClose: () => void;
}

export const NotificationsDropdown = ({
  notifications,
  onClose,
}: NotificationsDropdownProps) => {
  const router = useRouter();
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="dropdown-menu absolute right-4 sm:right-6 mt-2 w-[320px] sm:w-[380px] rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#0F1117]/95 backdrop-blur-sm shadow-lg dark:shadow-2xl z-10">
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Notifications
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              You have {unreadCount} unread messages
            </p>
          </div>
          <button className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            Mark all as read
          </button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors ${
              notification.unread ? "bg-gray-50 dark:bg-white/[0.01]" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                  notification.unread
                    ? "bg-purple-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {notification.time}
                  </span>
                  {notification.unread && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-white/[0.08]">
        <button
          onClick={() => {
            router.push("/notifications");
            onClose();
          }}
          className="w-full text-sm text-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          View all notifications
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
