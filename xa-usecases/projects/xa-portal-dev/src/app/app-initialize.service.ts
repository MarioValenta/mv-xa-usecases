import { Injectable } from '@angular/core';
import { GlobalScopeService } from './global-scope.service';



@Injectable()
export class AppInitializeService {



    constructor(
        globalScope: GlobalScopeService
    ) {


    }



}
