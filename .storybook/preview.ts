import type { Preview } from "@storybook/react-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { handlers } from "./mocks/handlers";
import "../app/frontend/entrypoints/application.css";
import { withProviders } from "./decorators";

// Initialize MSW with options to bypass unhandled requests
initialize({
  onUnhandledRequest: "bypass",
  quiet: true,
});

const preview: Preview = {
  loaders: [mswLoader],
  decorators: [withProviders],
  parameters: {
    msw: {
      handlers,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
