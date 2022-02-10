export class AvailableRequestType {
    Id: string;
    Name: string;
    Category: string;
    Description: string;
    Icon: string;
    Path: string;
    QueryParameters: Array<{Key: string, Value: string}>;

    Options: RequestTypeOptions = new RequestTypeOptions();
}

export class RequestTypeOptions {
    Clone: CloneOptions = new CloneOptions();
}

export class CloneOptions {
    Enabled: boolean = false;
}