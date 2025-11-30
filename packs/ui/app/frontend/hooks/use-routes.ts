import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface RouteEntry {
  path: string;
  namespace: string;
  feature: string;
  view: string;
}

export function useRoutes() {
  return useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const { data } = await axios.get<{ routes: RouteEntry[] }>(
        "/api/v1/routes"
      );
      return data.routes;
    },
    staleTime: Infinity,
  });
}
