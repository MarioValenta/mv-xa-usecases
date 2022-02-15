import { Injectable } from '@angular/core';
import { Selection } from './request-for-change.selection.model';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class RequestForChangeService {

  private _Validation: Array<Selection>;
  private _Backout: Array<Selection>;
  private _Impact: Array<Selection>;
  private _CauseOfChange: Array<Selection>;
  private _TargetOfChange: Array<Selection>;
  private _RiskOfOmission: Array<Selection>;
  private _RiskOfImplementation: Array<Selection>;

  private _Rating: Array<string>;

  private _AssignmentGroups$;


  constructor(private dataservice: DataService) {

    this._AssignmentGroups$ = this.dataservice.GetAssignmentGroups();

    this._Validation = [
      {
        label: 'System/Network health/connectivity checks on affected CIs',
        content: 'System/Network health/connectivity checks on affected CIs'
      },
      {
        label: 'Application/Service/Functionality Test, Customer test (if applicable)',
        content: 'Application/Service/Functionality Test, Customer test (if applicable)'
      },
      {
        label: 'Check logfile, installation, OS-/App-version',
        content: 'Check logfile, installation, OS-/App-version'
      },
      {
        label: 'Check CMDB-/NAC-entries & other documentation (if applicable)',
        content: 'Check CMDB-/NAC-entries & other documentation (if applicable)'
      },
      {
        label: 'Not known - Please consult implementer teams for further information',
        content: 'Not known - Please consult implementer teams for further information'
      },
      {
        label: 'OTHER',
        content: 'OTHER'
      }
    ];

    this._Backout = [
      {
        label: 'Restore from previously created snapshot/backup',
        content: 'Restore from previously created snapshot/backup'
      },
      {
        label: 'Revert settings/parameters to former values (baseline)',
        content: 'Revert settings/parameters to former values (baseline)'
      },
      {
        label: 'Delete/deactivate config file/rule',
        content: 'Delete/deactivate config file/rule'
      },
      {
        label: 'Backout method in customer-responsibility and documented in the current installation guide',
        content: 'Backout method in customer-responsibility and documented in the current installation guide'
      },
      {
        label: 'Not known - Please consult implementer teams for further information',
        content: 'Not known - Please consult implementer teams for further information'
      },
      {
        label: 'OTHER',
        content: 'OTHER'
      }
    ];

    this._Impact = [
      {
        label: 'New system - no impact',
        content: 'New system - no impact',
        rating: 'NONE'
      },
      {
        label: 'Rundown - no impact',
        content: 'Rundown - no impact',
        rating: 'NONE'
      },
      {
        label: 'Server is BASE_INSTALLED / READY_FOR_SERVICE - no impact',
        content: 'Server is BASE_INSTALLED / READY_FOR_SERVICE - no impact',
        rating: 'NONE'
      },
      {
        label: 'Loss of redundancy for service / server',
        content: 'Loss of redundancy for service / server',
        rating: 'LOW'
      },
      {
        label: 'Downtime/Restrictions because of Customer-Driven Maintenance',
        content: 'Downtime/Restrictions because of Customer-Driven Maintenance',
        rating: 'LOW'
      },
      {
        label: 'Server not available up to 60 minutes',
        content: 'Server not available up to 60 minutes',
        rating: 'MEDIUM'
      },
      {
        label: 'Server not available for more than 60 minutes',
        content: 'Server not available for more than 60 minutes',
        rating: 'HIGH'
      },
      {
        label: 'OTHER',
        content: 'OTHER',
        rating: ''
      }
    ];

    this._CauseOfChange = [
      {
        label: 'Customer request',
        content: 'Customer request'
      },
      {
        label: 'Project request',
        content: 'Project request'
      },
      {
        label: 'System/Applications end of life',
        content: 'System/Applications end of life'
      },
      {
        label: 'Existing problem/incident (describe the specific case)',
        content: 'Existing problem/incident:'
      },
      {
        label: 'Security leaks/vunlerabilities',
        content: 'Security leaks/vulnerabilities'
      },
      {
        label: 'OTHER',
        content: 'OTHER'
      }
    ];

    this._TargetOfChange = [
      {
        label: 'Customer request fulfilled',
        content: 'Customer request fulfilled'
      },
      {
        label: 'Project request fulfilled',
        content: 'Project request fulfilled'
      },
      {
        label: 'System/Applications up-to-date',
        content: 'System/Applications up-to-date'
      },
      {
        label: 'Problem/incident solved',
        content: 'Problem/incident solved'
      },
      {
        label: 'Security leaks/vunlerabilities fixed',
        content: 'Security leaks/vulnerabilities fixed'
      },
      {
        label: 'OTHER',
        content: 'OTHER'
      }
    ];

    this._RiskOfOmission = [
      {
        label: 'Customer request not fulfilled',
        content: 'Customer request not fulfilled'
      },
      {
        label: 'Project delay',
        content: 'Project delay'
      },
      {
        label: 'Unnecessary operational costs',
        content: 'Unnecessary operational costs'
      },
      {
        label: 'Existing problem/incident can\'t be resolved',
        content: 'Existing problem/incident can\'t be resolved'
      },
      {
        label: 'Exploitation of security leaks/vulnerabilities',
        content: 'Exploitation of security leaks/vulnerabilities'
      },
      {
        label: 'OTHER',
        content: 'OTHER'
      }
    ];

    this._RiskOfImplementation = [
      {
        label: 'Reboot-issues / Server won\'t come up',
        content: 'Reboot-issues / Server won\'t come up'
      },
      {
        label: 'No network connection to CI (new, replaced, etc.)',
        content: 'No network connection to CI (new, replaced, etc.)'
      },
      {
        label: 'Required service not available after change because of wrong/incomplete values/parameters',
        content: 'Required service not available after change because of wrong/incomplete values/parameters'
      },
      {
        label: 'Data inconsistency / undefined state of databases or virtual machines',
        content: 'Data inconsistency / undefined state of databases or virtual machines'
      },
      {
        label: 'Longer change-/downtime-duration as expected',
        content: 'Longer change-/downtime-duration as expected'
      },
      {
        label: 'Not known - Please consult implementer teams for further information',
        content: 'Not known - Please consult implementer teams for further information'
      },
      {
        label: 'OTHER',
        content: 'OTHER'
      }
    ];

    this._Rating = ['NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

  }

  public get Validation(): Array<Selection> {
    return this._Validation;
  }
  public get Backout(): Array<Selection> {
    return this._Backout;
  }
  public get Impact(): Array<Selection> {
    return this._Impact;
  }
  public get CauseOfChange(): Array<Selection> {
    return this._CauseOfChange;
  }
  public get TargetOfChange(): Array<Selection> {
    return this._TargetOfChange;
  }
  public get RiskOfOmission(): Array<Selection> {
    return this._RiskOfOmission;
  }
  public get RiskOfImplementation(): Array<Selection> {
    return this._RiskOfImplementation;
  }

  public get Rating(): Array<string> {
    return this._Rating;
  }

  public get AssignmentGroups$() {
    return this._AssignmentGroups$;
  }

  public getRatingMinusValue(rating: string, value: number): string {
    let index = this._Rating.indexOf(rating);

    if (index === -1) {
      return rating;
    }

    index = index - value >= 0 ? index - value : index;
    return this._Rating[index];
  }

  public getRatingPlusValue(rating: string, value: number): string {
    let index = this._Rating.indexOf(rating);

    if (index === -1) {
      return rating;
    }

    index = index + value < this._Rating.length ? index + value : index;
    return this._Rating[index];
  }
}
