import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptUICalendarModule } from "nativescript-ui-calendar/angular";
import { NativeScriptUIChartModule } from "nativescript-ui-chart/angular/chart-directives";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";

import { HttpClientModule } from "@angular/common/http";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SignInComponent } from "./components/auth/sign-in/sign-in.component";
import { FirebaseService } from "./services/firebaseService";
import { MoneyService } from "./services/money.service";
import { NotificationService } from "./services/notification.service";
import { UserLogService } from "./services/user-log.service";
import { SettingsModule } from "./settings/settings.module";
import { MenuModule } from "./menu/menu.module";
import { TodayComponent } from "./monitoring/today/today.component";
import { CalendarComponent } from "./monitoring/calendar/calendar.component";
import { Couchebase } from "./services/couchebase";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptUISideDrawerModule,
        NativeScriptModule,
        NativeScriptFormsModule,
        SettingsModule,
        MenuModule,
        NativeScriptUIChartModule,
        NativeScriptRouterModule,
        NativeScriptHttpModule,
        NativeScriptUICalendarModule,
        HttpClientModule],
    declarations: [
        AppComponent,
        SignInComponent,
        TodayComponent,
        CalendarComponent

    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        UserLogService,
        FirebaseService,
        MoneyService,
        NotificationService,
        Couchebase
    ]
})
export class AppModule { }
