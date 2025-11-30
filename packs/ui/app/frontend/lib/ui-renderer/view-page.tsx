import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DynamicRenderer } from "./renderer";
import type { UISchema } from "./types";

interface ViewPageProps {
  namespace: string;
  feature: string;
  view: string;
}

export function ViewPage({ namespace, feature, view }: ViewPageProps) {
  const params = useParams();

  const { data: schema, isLoading } = useQuery({
    queryKey: ["view", namespace, feature, view, params],
    queryFn: async () => {
      const { data } = await axios.get<UISchema>(
        `/api/v1/views/${namespace}/${feature}/${view}`,
        { params }
      );
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!schema) return <div>View not found</div>;

  return <DynamicRenderer schema={schema} />;
}
