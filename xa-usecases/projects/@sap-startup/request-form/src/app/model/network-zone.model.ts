export class NetworkZoneModel {
  cust: string;
  nas: string;
  descriptionModel: NetworkZoneDescriptionsModel;
  shared_ip: string;
  desc: string;
  isLANDescFetched: boolean;
}

export class NetworkZoneDescriptionsModel {
  nas: string;
  cust: string;
}
