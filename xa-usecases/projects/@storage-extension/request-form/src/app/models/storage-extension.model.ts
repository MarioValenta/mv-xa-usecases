import { StorageParameters } from './storage-parameters.model';

export interface StorageExtensionDto {

    CI: string;
    Customer: string;
    Hostname: string;
    Storage: StorageParameters;
    needSANextension: string;
    SANLUNpath: string;
    OS: string;
    ExtensionBy: number;
    ExtensionTo: number;
    StorageType: string;
}