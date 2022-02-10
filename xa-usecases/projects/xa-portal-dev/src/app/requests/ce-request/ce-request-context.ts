import { AvailableRequestType } from '../../available-request-types/available-request-type';

export class CERequestContext {

    CustomElementId: string;
    RequestType: AvailableRequestType;
    Payload: string;
    CloneData: {};
    ConfigPayload: string;
    Validation: string;
}