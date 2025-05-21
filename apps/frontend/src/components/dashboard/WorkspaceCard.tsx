import { Ellipsis, ArrowRight } from "lucide-react";
import { memo } from "react";

interface WorkspaceItem {
  name: string;
  lastEdited: string;
  members: number;
  workspaceId: string;
}

interface WorkspaceCardProps {
  item: WorkspaceItem;
  onNavigate: (id: string) => void;
}

export const WorkspaceCard = memo(
  ({ item, onNavigate }: WorkspaceCardProps) => {
    return (
      <div
        className="group relative rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] p-6 hover:border-gray-300 dark:hover:border-white/[0.15] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-300 cursor-pointer"
        onClick={() => onNavigate(item.workspaceId)}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#4D7DFF] transition-colors">
                {item.name}
              </h3>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-white/[0.05] text-gray-600 dark:text-white/60">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
              Last edited {item.lastEdited}
            </p>
          </div>
          <button
            className="text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Add workspace menu handling here
            }}
          >
            <Ellipsis size={20} />
          </button>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[...Array(item.members)].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white dark:border-gray-950 ring-2 ring-white/80 dark:ring-gray-950"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-white/60">
              {item.members} members
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-white/60">
              View Project
            </span>
            <ArrowRight
              size={16}
              className="text-gray-600 dark:text-white/60 group-hover:text-blue-600 dark:group-hover:text-[#4D7DFF] group-hover:translate-x-1 transition-all"
            />
          </div>
        </div>
      </div>
    );
  }
);
