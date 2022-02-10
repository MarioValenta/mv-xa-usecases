
export interface UserTaskDto {
    Id: string;
    RequestId: string;
    TaskInstanceId: string;
    TaskDefinitionKey: string;
    TaskDefinitionName: string;
    TaskVersion: string;
    ProcessInstanceId: string;
    ProcessDefinitionKey: string;
    ProcessDefinitionName: string;
    ProcessDefinitionVersion: string;
    InputParameter: Map<string, any>;
    OutputParameter: Map<string, any>;
    MetaData: Map<string, any>;
    Form: CamundaForm;
    Identifier: string;
    UserTaskStatus: string;
    Data: any;
    AssignedTo: string;
    CreatedAt: Date;
}

export interface CamundaForm {
    Key: string;
    Fields: Array<FormField>;
}

export interface FormField {
    Id: string;
    Label: string;
    Type: string;
    DefaultValue: string;
    Values: Array<FormKeyValue>;
    Validation: Array<FormKeyValue>;
    Properties: Array<FormKeyValue>;
    InputParameter: Map<string, any>;
    Data: any;
}


export interface FormKeyValue {
    Key: string;
    Value: string;
}

