import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Switch } from "tns-core-modules/ui/switch/switch";
import { TextField } from "tns-core-modules/ui/text-field";
import { FirebaseService } from "~/app/services/firebaseService";
import { MoneyService } from "../../services/money.service";

@Component({
    selector: "ns-price-config",
    templateUrl: "./price-config.component.html",
    styleUrls: ["./price-config.component.css"],
    moduleId: module.id
})
export class PriceConfigComponent implements OnInit {
    items: Array<{
        idItem: number, name: string, consummed: string, image: string, price: string
    }> = [];
    consumptions: Array<{
        name: string, date: Date, price: number
    }> = [];
    i;
    db;
    switch;
    textfield;
    currentHour: number = new Date().getHours();
    currentMinute: number = new Date().getMinutes();
    day: string;
    date: number;
    month: string;
    year: number;
    currentDate = new Date();
    fullDate;
    configSaved = false;
    // tslint:disable-next-line:max-line-length
    constructor(private money: MoneyService, private router: Router, private fireS: FirebaseService) {
        // Use the component constructor to inject providers.
        this.items = this.money.items;
        const day = this.currentDate.getDay();
        const date = this.currentDate.getDate();
        const year = this.currentDate.getFullYear();
        const weekdays = new Array(7);
        weekdays[0] = "Sunday";
        weekdays[1] = "Monday";
        weekdays[2] = "Tuesday";
        weekdays[3] = "Wednesday";
        weekdays[4] = "Thursday";
        weekdays[5] = "Friday";
        weekdays[6] = "Saturday";
        const dayName = weekdays[day];

        this.day = dayName;
        this.date = date;
        this.year = year;

        const month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        const monthName = month[this.currentDate.getMonth()];
        this.month = monthName;
        this.fullDate = dayName + "" + date + "" + monthName + "" + year;
    }
    check(args, items) {
        this.switch = <Switch>args.object;
        setTimeout(() => {
            // tslint:disable-next-line:prefer-conditional-expression
            if (this.switch.checked) {
                items.consummed = true;
            } else {
                items.consummed = false;

            }

        }, 10);

    }
    price(args, items) {
        this.textfield = <TextField>args.object.text;
        items.price = this.textfield;
    }
    onItemTap(itemName) {
        //  console.log("Tapped on " + itemName);
    }
    arrayRemove(arr, value) {
        return arr.filter((ele) => {
            return ele !== value;
        });
    }
    async  validate() {
        await this.money.price(this.items);
        this.configSaved = true;
        setTimeout(() => {
            this.configSaved = false;
            //   this.router.navigate(["/notif"]);
        }, 2000);

    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}
