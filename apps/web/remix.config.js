const { flatRoutes } = require("remix-flat-routes")

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ["**/*"],
  future: {
    unstable_postcss: true,
    unstable_tailwind: true,
  },
  serverDependenciesToBundle: [
    "@boilerplate/api",
    "axios",
    "@boilerplate/database",
    "@boilerplate/database/types",
    "query-string",
    "filter-obj",
    "split-on-first",
  ],
  watchPaths: ["../../packages/api"],
  routes: (defineRoutes) => {
    return flatRoutes("./pages", defineRoutes)
  },
}
