import type { Activity } from "../../api";

interface ActivityItemProps {
  activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {activity.activity_type}
            </span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
              {activity.category}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activity.level === "error"
                  ? "bg-red-100 text-red-700"
                  : activity.level === "warning"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {activity.level}
            </span>
            {activity.schema_slug && (
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                {activity.schema_slug}
              </span>
            )}
            {activity.tool_slug && (
              <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">
                {activity.tool_slug}
              </span>
            )}
          </div>
          <p className="text-gray-900 font-medium">{activity.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(activity.created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
