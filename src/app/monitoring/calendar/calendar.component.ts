import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { CalendarEvent, CalendarSelectionEventData, RadCalendar } from "nativescript-ui-calendar";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page/page";
import { MoneyService } from "~/app/services/money.service";
import * as firebase from "nativescript-plugin-firebase";

@Component({
    selector: "ns-calendar",
    templateUrl: "./calendar.component.html",
    styleUrls: ["./calendar.component.css"],
    moduleId: module.id
})
export class CalendarComponent implements OnInit {
    consumption: Array<{
        name: string, price: number, date: number
    }> = [];
    day: string;
    date: number;
    month: string;
    year: number;
    fullDate;
    db;
    user;

    // tslint:disable-next-line:max-line-length
    constructor(private routerExtensions: RouterExtensions, private page: Page, private money: MoneyService) {
        this.page.actionBarHidden = true;
        firebase.getCurrentUser().then(
            (User) => {
                this.user = User;
            }
        );
    }
    getConsumption(date) {
        this.consumption = [];
        this.money.getConsumption(this.user.uid, date).then((querySnapshot) => {
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

    ngOnInit() {

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
        this.getConsumption(this.fullDate);

    }

    onDateSelected(args: CalendarSelectionEventData) {
        const calendar: Date = args.date;
        const day = calendar.getDay();
        const date = calendar.getDate();
        const year = calendar.getFullYear();
        const weekdays = new Array(7);
        weekdays[0] = "Dimanche";
        weekdays[1] = "Lundo";
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

        const monthName = month[calendar.getMonth()];
        this.month = monthName;
        this.fullDate = dayName + "" + date + "" + monthName + "" + year;
        this.getConsumption(this.fullDate);
    }

    onItemTap(itemName) {
        // console.log(`Tapped on ${itemName}`);
    }

    goToTodayPage() {
        this.routerExtensions.navigate(["today/"], {
            animated: true,
            transition: {
                name: "fade",
                duration: 380,
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
                duration: 380,
                curve: "spring"
            },
            clearHistory: true
        });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

}
