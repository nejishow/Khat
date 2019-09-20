import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
@Component({
  selector: "ns-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
  moduleId: module.id
})
export class MenuComponent implements OnInit {

  constructor(private router: Router) {
    //
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  ngOnInit() {
    //
  }
  back() {
    this.router.navigate(["/home"]);
  }
}
