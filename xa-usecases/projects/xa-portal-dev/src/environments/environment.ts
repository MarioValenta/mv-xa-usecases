// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  deployed: false,
  production: false,
  debugMode: true,
  apiBaseUrl: 'https://api-portal-ucdev.xanet.at',
  idsBaseUrl: 'https://identity-ucdev.xanet.at',
  environment: 'LOCAL (UC-DEV remote)',
  idsClientName: "xaportal",
  idsClientScopes: "openid roles namedetails xaportal",
  showCompletedLastDays: 14,
  typingsDynamicEndpoint: "xacalendar,xapostgres,xatemplate,xabase,xahttp,xaendpointcontext,xacommon,xacamunda,xamail,xaconfig,xadebug,xataskhelper,xaenvironment",
  typingsExternalTask: "xacalendar,xapostgres,xatemplate,xabase,xahttp,xaexternaltask,xacommon,xacamunda,xamail,xaconfig,xadebug,xataskhelper,xaenvironment",
  typingsQueueScheduler: "xacalendar,xapostgres,xatemplate,xabase,xahttp,xacommon,xacamunda,xamail,xaconfig,xadebug,xataskhelper,xaenvironment",
  feedbackXAMail: "FMB_AT_ServiceAutomationTeam@t-systems.com"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
