/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/*.css"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",

  routes(defineRoutes) {
    return defineRoutes((route) => {
      route("/", "public/layout.tsx", () => {
        route("", "public/_index.tsx", { index: true });
        route("login", "public/login.tsx");
        route("register", "public/register.tsx");
        route("password/forgot", "public/forgotPassword.tsx");
        route("logout", "public/logout.ts");
      });
      route("", "protected/layout.tsx", () => {
        route("dashboard", "dashboard/layout.tsx", () => {
          route("", "dashboard/_index.tsx", { index: true });
        });
        route("family", "family/layout.tsx", () => {
          route("", "family/_index.tsx", { index: true });
          route("person/add", "family/add.tsx");
          route("person/edit/:id", "family/$id.tsx");
        });
        route("events", "events/layout.tsx", () => {
          route("", "events/_index.tsx", { index: true });
          route("add", "events/add.tsx");
          route("edit/:id", "events/$id.tsx");
        });
        route("services", "services/layout.tsx", () => {
          route("", "services/_index.tsx", { index: true });
          route("add", "services/add.tsx");
          route("edit/:id", "services/$id.tsx");
        });
        route("account", "account/layout.tsx", () => {
          route("", "account/_index.tsx", { index: true });
        });
      });
    });
  },
};
