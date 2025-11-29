import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Activity {
  id: string;
  workspace_id: string;
  user_id: string;
  activity_type: string;
  category: string;
  level: string;
  message: string;
  item_id?: string;
  schema_slug?: string;
  tool_slug?: string;
  feature_slug?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

interface ActivitiesResponse {
  activities: Activity[];
}

async function fetchActivities(limit = 50): Promise<ActivitiesResponse> {
  const { data } = await axios.get<ActivitiesResponse>(
    `/api/v1/workspaces/activities?limit=${limit}`,
  );
  return data;
}

export function useActivities(limit = 50) {
  return useQuery({
    queryKey: ["activities", limit],
    queryFn: () => fetchActivities(limit),
  });
}
