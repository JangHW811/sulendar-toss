import { appsInToss } from "@apps-in-toss/framework/plugins";
import { defineConfig } from "@granite-js/react-native/config";

export default defineConfig({
  appName: "sulendar",
  scheme: "intoss",
  entryFile: "./_app.tsx",
  plugins: [
    appsInToss({
      brand: {
        displayName: "술렌다",
        primaryColor: "#03b26c",
        icon: "",
      },
      permissions: [],
    }),
  ],
});
