import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { FirebaseService } from "~/app/services/firebaseService";
import { UserLogService } from "~/app/services/user-log.service";
import { User } from "~/models/user.model";
import { SqliteService } from "~/app/services/sqliteService";

@Component({
  selector: "ns-credentials",
  templateUrl: "./credentials.component.html",
  styleUrls: ["./credentials.component.css"],
  moduleId: module.id
})
export class CredentialsComponent implements OnInit {
  newPassword;
  cPassword; // confirme password
  user: User;
  age;
  username; // pour verifier d'abord la personne

  constructor(private userLogService: UserLogService, private sql: SqliteService, private fireS: FirebaseService) {
    this.user = new User();
    this.sql.database.get("SELECT age from user where id=?", [1]).then(
      (data) => this.age = data[0]
    );

  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  submit() {
    this.userLogService.updateUser(this.username, this.age, this.user, this.newPassword, this.cPassword);
  }

  ngOnInit() {
    //
  }

}
