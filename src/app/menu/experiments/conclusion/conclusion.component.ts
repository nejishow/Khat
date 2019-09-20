import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { FirebaseService } from "~/app/services/firebaseService";
import { SqliteService } from "~/app/services/sqliteService";
import { Contents } from "~/models/contents.model";
import { Couchebase } from "~/app/services/couchebase";
@Component({
    selector: "ns-conclusion",
    templateUrl: "./conclusion.component.html",
    styleUrls: ["./conclusion.component.css"],
    moduleId: module.id
})
export class ConclusionComponent implements OnInit {
    content = new Contents();
    db;
    idContent;
    data;
    imageUrl = "~/images/smile.png";

    constructor(private firebaseS: FirebaseService, private CB: Couchebase,
        private sql: SqliteService, private router: Router) {
        this.idContent = this.CB.id;
        this.content = this.CB.database.query({
            select: [], // Leave empty to query for all
            from: "", // Omit or set null to use current db
            where: [{ property: "idContent", comparison: "equalTo", value: this.idContent }]
            //    order: [{ property: 'firstName', direction: 'desc' }],
            //    limit: 2
        });

    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    ngOnInit() {
        //
    }
    back() {
        this.router.navigate(["/submenu"], { queryParams: { id: this.content[0].idMENU } });
    }

}
