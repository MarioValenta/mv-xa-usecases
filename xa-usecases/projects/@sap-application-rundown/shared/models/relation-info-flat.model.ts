import {RelationsModel} from './relations.model';

export class RelationInfoFlatModel {
  // DIVERSE properties
  dummy = '';
  id = '';
  HostID = '';
  SVCID = '';

  // GENERAL properties
  id0 = '';
  id1 = '';
  id2 = '';
  id3 = '';
  id4 = '';
  name: string;
  nonDeletable: boolean;
  predicate: string;
  status: string;
  support: string;

  // HOST properties
  hostModel: string;
  hostModelNr: string;

  // SERVICE properties
  class: string;
  type: string;
  environment: string;


  constructor(relationsModel: RelationsModel, level: number) {
    const id = relationsModel.HOSTID || relationsModel.SVCID;
    this.id = id;

    // set IDs
    this.HostID = relationsModel.HOSTID;
    this.SVCID = relationsModel.SVCID;

    // set GENERAL properties
    this.name = relationsModel.HOSTNAME || relationsModel.SVCNAME;
    this.nonDeletable = relationsModel.nonDeletable;
    this.predicate = relationsModel.PREDLABEL;
    this.status = relationsModel.HSTATUS || relationsModel.SVCSTATUS;
    this.support = relationsModel.HSUP || relationsModel.SVCSUP;

    // set HOST properties
    this.hostModel = relationsModel.HMODEL;
    this.hostModelNr = relationsModel.HMODELNR;

    // set SERVICE properties
    this.class = relationsModel.SVCCLASS;
    this.type = relationsModel.SVCTYPE;
    this.environment = relationsModel.SVCENVIRONMENT;

    // set id according to level in tree structure
    switch (level) {
      case 0:
        this.id0 = id;
        break;
      case 1:
        this.id1 = id;
        break;
      case 2:
        this.id2 = id;
        break;
      case 3:
        this.id3 = id;
        break;
      case 4:
        this.id4 = id;
        break;
      default:
        break;
    }
  }
}
