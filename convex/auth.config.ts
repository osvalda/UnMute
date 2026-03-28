import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://musical-reptile-66.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ],
} as AuthConfig;
