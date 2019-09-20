import { Couchebase } from "./../../services/couchebase";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { SqliteService } from "~/app/services/sqliteService";
import { Contents } from "~/models/contents.model";
@Component({
    selector: "ns-sub-menu",
    templateUrl: "./sub-menu.component.html",
    styleUrls: ["./sub-menu.component.css"],
    moduleId: module.id
})
export class SubMenuComponent implements OnInit {
    list: Array<Contents> = [];
    db;
    i;
    content;
    id; // idMenu
    // tslint:disable-next-line:array-type
    menus;
    section;

    // tslint:disable-next-line:array-type

    constructor(private sql: SqliteService, private router: Router, private aS: ActivatedRoute, private CB: Couchebase) {
        //    this.db = sql.database;
        this.aS
            .queryParams
            .subscribe((params) => {
                // Defaults to 0 if no query param provided.
                this.id = +params.id;
            });
        this.menus = this.CB.database.query({
            select: [], // Leave empty to query for all
            from: "", // Omit or set null to use current db
            where: [{ property: "idMenu", comparison: "equalTo", value: parseInt(this.id) }]
            //    order: [{ property: 'firstName', direction: 'desc' }],
            //    limit: 2
        });
        this.section = this.menus[0].title;
        this.content = this.CB.database.query({
            select: [], // Leave empty to query for all
            from: "", // Omit or set null to use current db
            where: [{ property: "idMENU", comparison: "equalTo", value: this.id }]
            //    order: [{ property: 'firstName', direction: 'desc' }],
            // limit: 2
        });

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    onItemTap(args: ItemEventData): void {
        //  console.log("Item with index: " + this.content[args.index].id + " tapped");
        this.CB.id = this.content[args.index].idContent;
        this.router.navigate(["/experiment"]);

    }

    ngOnInit() {
        //
    }
    back() {
        this.router.navigate(["/menu"]);
    }
}
