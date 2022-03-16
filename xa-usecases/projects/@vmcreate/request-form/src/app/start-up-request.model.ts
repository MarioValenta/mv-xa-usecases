export interface StartUpRequestDto {

    ProjectName: string;
    Customer: string;
    WBSInstallation: string;
    WBSOperations: string;
    Environment: string;
    Criticality: string;
    ServiceTime: string;
    UseSLA: boolean;
    SLAName: string;
    OS: string;
    OSVersion: string;
    Platform: string;
    Patchmode: string;
    VMDK: Array<any>;
}

export class StartUpRequestDtoDefaults {

    Customer = null;
    Environment = 'DEV';
    Criticality = 'MEDIUM';
    ServiceTime = 'Office';
    UseSLA = false;
    Platform = 'VMware';
    Patchmode = 'TSA_ONLY';
    LicenseType = 'SPLA';
    Timezone = '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna';
    VMOptions = {
        VCPU: 4,
        VRAM: 32,
        Backup: 'VMware',
        PayPerUse: false,
        PPUunlimited: true,
        UpperLimit: false,
        LowerLimit: true,
        LimitsUnit: 'Slices'
    };
    // PlatformOptions = {
    //     Infrastructure: 'Shared Local Infrastructure (DSI-L)',
    //     Datastore: 'Local Datastore',
    //     Location: 'To be determined by ESX-Team'
    // };

}
