import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock locale/translations endpoint
  http.get("/api/v1/locales/:locale", ({ params }) => {
    const { locale } = params;
    return HttpResponse.json({
      locale,
      translations: {
        common: {
          save: "Save",
          cancel: "Cancel",
          delete: "Delete",
          edit: "Edit",
          confirm: "Confirm",
          no_results: "No results.",
          loading: "Loading...",
          error: "Error",
          success: "Success",
        },
      },
    });
  }),

  // Catch-all for other API requests
  http.get("/api/v1/*", () => {
    return HttpResponse.json({ data: [] });
  }),

  http.post("/api/v1/*", () => {
    return HttpResponse.json({ success: true });
  }),

  http.patch("/api/v1/*", () => {
    return HttpResponse.json({ success: true });
  }),

  http.delete("/api/v1/*", () => {
    return HttpResponse.json({ success: true });
  }),
];
