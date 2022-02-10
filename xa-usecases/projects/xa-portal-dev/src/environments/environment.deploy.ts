export const environment = {
  deployed: true,
  production: true,
  debugMode: false,
  apiBaseUrl: 'https://api-portal-ucdev.xanet.at',
  idsBaseUrl: 'https://identity-dev.xanet.at',
  environment: 'LOCAL',
  idsClientName: "xaportal",
  idsClientScopes: "openid roles namedetails xaportal",
  showCompletedLastDays: 14,
  typingsDynamicEndpoint: "xacalendar,xapostgres,xatemplate,xabase,xahttp,xaendpointcontext,xacommon,xacamunda,xamail,xaconfig,xadebug,xataskhelper,xaenvironment",
  typingsExternalTask: "xacalendar,xapostgres,xatemplate,xabase,xahttp,xaexternaltask,xacommon,xacamunda,xamail,xaconfig,xadebug,xataskhelper,xaenvironment",
  typingsQueueScheduler: "xacalendar,xapostgres,xatemplate,xabase,xahttp,xacommon,xacamunda,xamail,xaconfig,xadebug,xataskhelper,xaenvironment",
  feedbackXAMail: "FMB_AT_ServiceAutomationTeam@t-systems.com"
};
