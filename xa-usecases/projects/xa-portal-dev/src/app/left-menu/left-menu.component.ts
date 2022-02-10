import { Component, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { map } from 'rxjs/operators';
// import { Store } from '@ngrx/store';
// import { AppState } from '../state';
// import { AuthenticationSelector } from '../shared/state/authentication';
// import { ConnectionSelector, ConnectionAction } from '../shared/state/connection';
// import { ConnectionState } from '../shared/models/connection';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'left-menu',
    templateUrl: './left-menu.component.html',
    styleUrls: ['./left-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeftMenuComponent {

    // currentUser$ = this.store.select(AuthenticationSelector.CurrentUser).pipe(
    //     map(cu => {
    //         if (cu) {

    //             let _roles = [];
    //             if (cu.roles) {
    //                 if (cu.roles instanceof Array) {
    //                     _roles = cu.roles;
    //                 } else {
    //                     _roles = [cu.roles];
    //                 }
    //             }

                

    //             return {
    //                 ...cu,
    //                 roles: _roles.sort((a, b) => {
    //                     if (a < b) {
    //                         return -1;
    //                     }
    //                     if (a > b) {
    //                         return 1;
    //                     }
    //                     return 0;
    //                 })
    //             };
    //         }
    //     })
    // );

    // userName$ = this.currentUser$.pipe(
    //     map(user => {
    //         if (!user) {
    //             return null;
    //         }
    //         if (user.fullName && user.fullName.trim()) {
    //             return user.fullName.trim();
    //         }
    //         return user.userName;
    //     })
    // );

    // connectionState$ = this.store.select(ConnectionSelector.ConnectionState).pipe(map(state => ConnectionState[state]));
    // shouldConnect$ = this.store.select(ConnectionSelector.ShouldConnect);


    // environment: string;


    // constructor(public store: Store<AppState>, private titleService: Title) {

    //         this.titleService.setTitle(`DEV`);


    // }

    // public ToggleConnect() {
    //     this.store.dispatch(new ConnectionAction.ToggleShouldConnect());
    // }

    // Connect() {

    //     this.store.dispatch(new ConnectionAction.SetShouldConnect(true));

    // }


    initPopUp($event: ElementRef) {
        // $($event.nativeElement).popup({
        //     on: 'hover',
        //     lastResort: 'right center',
        //     inline: false,
        //     hoverable: true,
        //     position: 'right center',
        //     delay: {
        //         show: 30,
        //         hide: 80
        //     },
        //     movePopup: false
        // });
    }


    isActive(route: string) {
        return true;
    }
}
