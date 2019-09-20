import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { LocalNotifications } from "nativescript-local-notifications";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { MoneyService } from "./money.service";
import { SqliteService } from "./sqliteService";
import { UserLogService } from "./user-log.service";

@Injectable()
export class NotificationService implements OnInit {
    database;
    consumption: Array<{
        idConsumption: number, name: string, price: any, date: number
    }> = [];
    day: string;
    date: number;
    month: string;
    year: number;
    fullDate;
    // tslint:disable-next-line:max-line-length
    constructor(private sql: SqliteService, private money: MoneyService, private router: Router, private auth: UserLogService) {
        this.database = this.sql.database;
        const currentDate = new Date();
        const day = currentDate.getDay();
        const date = currentDate.getDate();
        const year = currentDate.getFullYear();
        const weekdays = new Array(7);
        weekdays[0] = "Dimanche";
        weekdays[1] = "Lundi";
        weekdays[2] = "Mardi";
        weekdays[3] = "Mercredi";
        weekdays[4] = "Jeudi";
        weekdays[5] = "Vendredi";
        weekdays[6] = "Samedi";
        const dayName = weekdays[day];

        this.day = dayName;
        this.date = date;
        this.year = year;

        const month = new Array();
        month[0] = "Janvier";
        month[1] = "Fevrier";
        month[2] = "Mars";
        month[3] = "Avril";
        month[4] = "Mai";
        month[5] = "Juin";
        month[6] = "Juillet";
        month[7] = "Aout";
        month[8] = "Septembre";
        month[9] = "Octobre";
        month[10] = "Novembre";
        month[11] = "Decembre";

        const monthName = month[currentDate.getMonth()];
        this.month = monthName;

        this.fullDate = dayName + "" + date + "" + monthName + "" + year;
    }
    putNotificationTime(time, hours, x) {
        this.sql.database.execSQL("update notification set hour=?, minute=?, hours=?, date=? where id=?",
            [time.hour, time.minute, hours, new Date(new Date().getFullYear(), new Date().getMonth(),
                new Date().getDate() + x), 1]);
    }
    updateNotificationDate() {
        return this.sql.database.get("SELECT date FROM notification where id=? ", [1]).then(
            (date) => {
                this.sql.database.execSQL("UPDATE notification set date=? where id=?",
                    [new Date(new Date(date[0]).getFullYear(), new Date(date[0]).getMonth(),
                        new Date(date[0]).getDate() + 1), 1]);
            }

        );

    }

    getNotificationTime() {
        return this.sql.database.get("SELECT hour,minute, date FROM notification where id=? ", [1]).then(
            (data) => {
                this.schedule(data);
            }
        );
    }
    schedule(time): void { // x represente le nombre de jour à ajouter pour la notif 0 ou 1
        LocalNotifications.cancel(5 /* the ID */);
        LocalNotifications.schedule(
            [{
                id: 5,
                thumbnail: true,
                icon: "res://leave",
                sound: "customsound-ios.wav",
                title: "Khat",
                // tslint:disable-next-line:max-line-length
                body: '"Avez vous consommez du khat aujourd\'hui?"(glissez vers le bas)',
                forceShowWhenInForeground: true,
                interval: "day",
                at: new Date(new Date(time[2]).getFullYear(), new Date(time[2]).getMonth(),
                    new Date(time[2]).getDate(), time[0], time[1]),
                actions: [
                    {
                        id: "0",
                        type: "button",
                        title: "Oui",
                        launch: true
                    },
                    {
                        id: "1",
                        type: "button",
                        title: "Non",
                        launch: false
                    }
                ]
            }])
            .then(() => {
                //
            })
            .catch((error) => console.log("doScheduleId5WithInput error: " + error));
    }
    ngOnInit() {
        //
    }
    // createConsumption() {

    //     setTimeout(() => {
    //         this.money.getConsumption(this.database, this.fullDate).then(
    //             (consumption) => {
    //                 if (consumption === null || consumption.length === 0) {
    //                     this.money.checkConsumption(this.database).then(
    //                         (data) => {
    //                             if (data.length > 0) {

    //                                 // tslint:disable-next-line:forin
    //                                 for (const row in data) {
    //                                     this.consumption.push({
    //                                         idConsumption: data[row][0],
    //                                         date: this.fullDate,
    //                                         name: data[row][1],
    //                                         price: data[row][2]
    //                                     }
    //                                     );
    //                                 }
    //                                 setTimeout(() => {
    //                                     this.money.putConsumption(this.database, this.consumption);

    //                                 }, 100);
    //                                 setTimeout(() => {
    //                                     this.router.navigate(["/today"]);

    //                                 }, 100);

    //                             } else {
    //                                 this.router.navigate(["/priceConfig"]);
    //                             }
    //                         },
    //                         (error) => this.router.navigate(["/priceConfig"])
    //                     );
    //                 } else {
    //                     dialogs.alert({
    //                         title: "Consommation",
    //                         // tslint:disable-next-line:max-line-length
    //                         message: "Vous avez deja une consommation enregistré pour aujourd'hui, vous pouvez modifier la consommation existante en appuiyant sur modifier",
    //                         okButtonText: "Ok!"
    //                     });
    //                 }
    //             }
    //         );

    //     }, 1000);

    // }
}
