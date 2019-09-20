import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { MoneyService } from "../services/money.service";
import { SqliteService } from "../services/sqliteService";

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html",
    styleUrls: ["./settings.css"]
})
export class SettingsComponent implements OnInit {

    constructor(private money: MoneyService, private sql: SqliteService, private router: Router) {
        //

    }
    ngOnInit() {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    goToPrice() {
        this.router.navigate(["/priceConfig"]);

    }
    goToNotif() {
        this.router.navigate(["/notif"]);

    }
    goToCredentials() {
        this.router.navigate(["/credentials"]);

    }
}
