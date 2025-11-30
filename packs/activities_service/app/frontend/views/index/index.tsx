import { useActivities } from "../../api";
import { ActivityItem } from "./activity";

export default function ActivitiesIndex() {
  const { data, isLoading } = useActivities();
  const activities = data?.activities ?? [];

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Activities
          </h2>
        </div>

        {isLoading ? (
          <div className="animate-pulse text-gray-500">
            Loading activities...
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-2">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No activities yet</p>
        )}
      </div>
    </div>
  );
}
