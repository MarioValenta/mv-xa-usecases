import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ProdFeatureStatus, DevFeatureStatus } from './FeatureManager';


@Injectable()
export class AppConfigService {

  private appConfig: IAppConfig;

  constructor(private http: HttpClient) { }

  loadAppConfig() {
    return this.http.get('/assets/data/appconfig.json')
      .toPromise()
      .then((data: IAppConfig) => {
        this.appConfig = data;
      });
  }

  getConfig() {
    if (environment.deployed) {
      return this.appConfig;
    } else {
      return environment;
    }

  }






  public IsFeatureEnabled(featureName: string) {

    if (this.appConfig.environment && this.appConfig.environment.toUpperCase() === 'PROD') {
      return ProdFeatureStatus[featureName];
    } else {
      return DevFeatureStatus[featureName];
    }


  }

}

export interface IAppConfig {
  debugMode: boolean;
  apiBaseUrl: string;
  idsBaseUrl: string;
  environment: string;
  idsClientName: string;
  idsClientScopes: string;
  showCompletedLastDays: number;
  typingsDynamicEndpoint: string;
  typingsExternalTask: string;
  typingsQueueScheduler: string;
  feedbackXAMail: string;
}
