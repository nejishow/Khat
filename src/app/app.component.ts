import { Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from "tns-core-modules/connectivity";
import { FirebaseService } from "./services/firebaseService";
import { MoneyService } from "./services/money.service";
import { NotificationService } from "./services/notification.service";
import { UserLogService } from "./services/user-log.service";
import { Couchebase } from "./services/couchebase";
import * as firebase from "nativescript-plugin-firebase";

// const firebase = require("nativescript-plugin-firebase");

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html",
    styleUrls: ["app.component.css"]
})
export class AppComponent implements OnInit {
    db;
    contents: Array<any>;
    user;
    userConnected = false;
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    private database: any;

    // tslint:disable-next-line:max-line-length
    constructor(private router: Router, private routerExtensions: RouterExtensions, private auth: UserLogService, private money: MoneyService, private notifS: NotificationService, private fireS: FirebaseService, private CB: Couchebase) {
        //
        firebase.getCurrentUser().then((User) => this.user = User);

        startMonitoring(async (newConnectionType) => {
            switch (newConnectionType) {
                case connectionType.none:
                    console.log("Connection type changed to none.");
                    break;
                case connectionType.wifi:
                    await this.fireS.initFirebase();
                    setTimeout(() => {
                        try {
                            this.money.getItems(this.user.uid);
                            this.fireS.fillNOSQL();
                        } catch (error) {
                            //
                        }
                    }, 1000);

                    break;
                case connectionType.mobile:
                    await this.fireS.initFirebase();
                    setTimeout(() => {
                        try {
                            this.money.getItems(this.user.uid);
                            this.fireS.fillNOSQL();
                        } catch (error) {
                            //
                        }
                    }, 1000);
                    break;
                case connectionType.ethernet:
                    console.log("Connection type changed to ethernet.");
                    break;
                // case connectionType.bluetooth:
                //     // feature coming in NativeScript 5.0.0
                //     console.log("Connection type changed to bluetooth.");
                //     break;
                default:
                    break;
            }
        });
        this.auth.userAuth.subscribe((user: any) => {
            if (user.email) {
                this.userConnected = true;
                this.user = user;
            }
        });
        this.fireS.userAuth.subscribe((user: any) => {
            if (user.email) {
                this.userConnected = true;
                this.user = user;
            }
        });

    }


    ngOnInit(): void {

        this._activatedUrl = "/home";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);

        setTimeout(() => {
            this.CB.init();
            //     this.CB.createConsumption();
        });
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }
    signOut() {
        firebase.logout();
        this.userConnected = false;
        this.router.navigate(["/home"]);

    }
    async goToday() {
        if (!this.userConnected) {
            this.router.navigate(["/signIn"]);
        } else {
            let i = 0;
            let id;
            await firebase.getCurrentUser().then(
                (User) => {
                    id = User.uid;

                }
            );
            console.log(id);
            await this.money.checkConsumption(id).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();

                    if (data.consummed) {
                        i += 1;
                    }
                });
            });
            if (i === 0) {
                this.router.navigate(["/settings"]);
            } else {
                this.router.navigate(["/today"]);

            }
        }
    }
    goSettings() {
        if (!this.userConnected) {
            this.router.navigate(["/signIn"]);
        } else {
            this.router.navigate(["/settings"]);

        }
    }
    goMenu() {
        this.router.navigate(["/menu"]);

    }
}
