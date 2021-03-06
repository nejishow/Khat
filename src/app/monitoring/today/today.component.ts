import { FirebaseService } from '~/app/services/firebaseService';
import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page/page";
import { TextField } from "tns-core-modules/ui/text-field/text-field";
import { MoneyService } from "~/app/services/money.service";
import * as firebase from "nativescript-plugin-firebase";
@Component({
    selector: "ns-today",
    templateUrl: "./today.component.html",
    styleUrls: ["./today.component.css"],
    moduleId: module.id
})
export class TodayComponent implements OnInit {
    db;
    day: string;
    date: number;
    month: string;
    year: number;
    fullDate;
    textfield;
    edit = false;
    user: any;
    consumption: Array<{
        name: string, price: any, date: number
    }> = [];

    // tslint:disable-next-line:max-line-length
    constructor(private routerExtensions: RouterExtensions, private page: Page, private money: MoneyService, private fireS: FirebaseService) {
        this.page.actionBarHidden = true;
        firebase.getCurrentUser().then(
            (User) => {
                this.user = User;
            }
        );
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

    ngOnInit() {
        this.money.getConsumption(this.user.uid, this.fullDate).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                this.consumption.push({
                    date: data.date,
                    name: data.name,
                    price: data.price
                }
                );
            });
        });
    }

    onRadItemTap(itemName) {
        console.log(`Tapped on ${itemName}`);
    }

    goToTodayPage() {
        this.routerExtensions.navigate(["today/"], {
            animated: true,
            transition: {
                name: "fade",
                // duration: 380,
                curve: "spring"
            },
            clearHistory: true
        });
    }

    goToBalancePage() {
        this.routerExtensions.navigate(["balance/"], {
            animated: true,
            transition: {
                name: "fade",
                // duration: 380,
                curve: "spring"
            },
            clearHistory: true
        });
    }

    goToCalendarPage() {
        this.routerExtensions.navigate(["calendar/"], {
            animated: true,
            transition: {
                name: "fade",
                // duration: 380,
                curve: "spring"
            },
            clearHistory: true
        });
    }
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    delete() {
        this.money.deleteConsumption(this.db, this.fullDate);
        this.consumption = [];
        this.ngOnInit();
    }
    async  createConsumption() {

        await this.money.checkConsumption(this.user.uid).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(data);

                // tslint:disable-next-line:forin
                this.consumption.push({
                    date: this.fullDate,
                    name: data.name,
                    price: data.price
                }
                );
            });
        });

        this.money.putConsumption(this.consumption, this.user.uid);

    }
    toggleEdit() {
        // tslint:disable-next-line:prefer-conditional-expression
        if (!this.edit) {
            this.edit = true;
        } else {
            this.edit = false;
        }
    }
    updateConsumption() {
        this.money.updateConsumption(this.user.uid, this.consumption, this.fullDate);
        this.toggleEdit();
    }
    price(args, items) {
        this.textfield = <TextField>args.object.text;
        items.price = this.textfield;

    }
}
