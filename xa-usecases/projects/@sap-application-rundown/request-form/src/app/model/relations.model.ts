export class RelationsModel {
  // GENERAL properties
  OBID: string;
  PREDLABEL: string;
  PREDPRIORITY: string;
  RELATIONID: string;
  TABLE: string;
  TYPE: string;
  nonDeletable: boolean;
  Relations: RelationsModel[];

  // HOST properties
  HMODEL: string;
  HMODELNR: string;
  HOSTID: string;
  HOSTNAME: string;
  HPLATFORM: string;
  HSTATUS: string;
  HSUP: string;
  HSUPAPP: string;

  // SERVICE properties
  SVCCLASS: string;
  SVCCUSTOMER: string;
  SVCDETAIL: string;
  SVCENVIRONMENT: string;
  SVCID: string;
  SVCMAINRESPONSIBLE: string;
  SVCNAME: string;
  SVCSTATUS: string;
  SVCSUP: string;
  SVCTYPE: string;
}
