import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { TimePicker } from "tns-core-modules/ui/time-picker";
import { FirebaseService } from "~/app/services/firebaseService";
import { NotificationService } from "~/app/services/notification.service";
import { SqliteService } from "~/app/services/sqliteService";

@Component({
  selector: "ns-notif",
  templateUrl: "./notif.component.html",
  styleUrls: ["./notif.component.css"],
  moduleId: module.id
})
export class NotifComponent implements OnInit {
  timePicker: TimePicker;
  hours: number;
  configSaved = false;
  time;
  // tslint:disable-next-line:max-line-length
  constructor(private notifS: NotificationService, private fireS: FirebaseService, private router: Router, private sql: SqliteService) {
    //
    this.fireS.getHours().then(
      (data) => this.hours = data[0]
    );
    this.getNotificationTime();
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
  getNotificationTime() {
    this.sql.database.get("SELECT hour,minute, date FROM notification where id=? ", [1]).then(
      (data) => {
        if (data[1] === null || data[2] === null || data[1] === 0 || data[2] === 0) {
          this.time = false;
        } else {
          this.time = data[0] + ":" + data[1];
        }
      }
    );
  }
  onPickerLoaded(args) {
    this.timePicker = args.object;
    this.timePicker.hour = new Date().getHours();
    this.timePicker.minute = new Date().getMinutes();

  }

  onTimeChanged(args) {
    this.timePicker = args.object;
    this.timePicker.time.setDate(new Date().getDate());
    this.timePicker.time.setMonth(new Date().getMonth());
    this.timePicker.time.setFullYear(new Date().getFullYear());
    this.timePicker.hour = args.value.getHours();
    this.timePicker.minute = args.value.getMinutes();
  }
  scheduleNotif() {
    if (this.hours <= 0) {
      dialogs.alert({
        title: "Erreur",
        message: "Veuillez s'il vous plait mettre le nombre d'heure alloué au Khat par seance",
        okButtonText: "Ok!"
      });
    } else {
      if (this.timePicker.time > new Date()) {
        this.notifS.putNotificationTime(this.timePicker, this.hours, 0);
        setTimeout(() => {
          this.notifS.getNotificationTime();
          this.validate();
        }, 2000);
      } else {
        this.notifS.putNotificationTime(this.timePicker, this.hours, 1);

        setTimeout(() => {
          this.notifS.getNotificationTime();
          this.validate();
        }, 2000);
      }
    }

  }
  validate() {
    setTimeout(() => {
      this.configSaved = true;
    }, 200);
    setTimeout(() => {
      this.configSaved = false;
    }, 3000);
    this.router.navigate(["/settings"]);

  }
  ngOnInit() {
    //
  }
}
