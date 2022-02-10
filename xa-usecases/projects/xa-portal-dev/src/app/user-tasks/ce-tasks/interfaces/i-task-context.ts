export interface ITaskContext {
    Payload: {};

    Valid: boolean | string;

    OnSubmit(action: () => {value: object, runtimeData: object});
    OnSave(action: () => {value: object});
}