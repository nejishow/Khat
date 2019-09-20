import { FirebaseService } from './../services/firebaseService';
import { Couchebase } from './../services/couchebase';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { MoneyService } from "../services/money.service";
import * as firebase from "nativescript-plugin-firebase";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ["./style.css"]
})
export class HomeComponent implements OnInit {
    db;
    userdata;
    isConnected;
    constructor(private money: MoneyService, private router: Router, private CB: Couchebase, private fireS: FirebaseService) {
        // Use the component constructor to inject providers.
        firebase.getCurrentUser().then(
            () => this.isConnected = true
        );
    }
    async goToMoney() {
        const consumption = this.CB.database.query({
            select: [], // Leave empty to query for all
            from: "", // Omit or set null to use current db
            where: [{ property: "idConcumption", comparison: "equalTo", value: 1 }]
            //    order: [{ property: 'firstName', direction: 'desc' }],
            //    limit: 2
        });
        let items = [];
        if (this.isConnected) {
            await items == this.money.items;
            if (consumption.length !== 0) {
                this.router.navigate(["/today"]);

            } else if (items.length !== 0 && consumption.length === 0) {
                const documentId = this.CB.database.createDocument(
                    {
                        "idConcumption": 1,
                        "consumption": true
                    }
                );
                this.CB.database.updateDocument(documentId, {
                    "documentId": documentId
                });
            }
            else {
                console.log("configuration first");

            }
        } else {
            setTimeout(() => {
                console.log("connect first");
            }, 100);

        }

    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
