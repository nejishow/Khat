import { Couchebase } from "./../../../services/couchebase";
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { registerElement } from "nativescript-angular/element-registry";
import { CardView } from "nativescript-cardview";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { FirebaseService } from "~/app/services/firebaseService";
registerElement("CardView", () => CardView);
@Component({
    selector: "ns-experiment",
    templateUrl: "./experiment.component.html",
    styleUrls: ["./experiment.component.css"],
    moduleId: module.id
})
export class ExperimentComponent implements OnInit {
    // tslint:disable-next-line:max-line-length
    data;
    imageUrl = "~/images/smile.png";
    int; i = 1;
    content;
    db;
    idContent;

    constructor(private firebaseS: FirebaseService,
        private router: Router, private CB: Couchebase) {
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
