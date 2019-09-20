import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NotificationService } from "../services/notification.service";
import { CredentialsComponent } from "./credentials/credentials.component";
import { NotifComponent } from "./notif/notif.component";
import { PriceConfigComponent } from "./price-config/price-config.component";
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingsComponent } from "./settings.component";
import { FirebaseService } from "../services/firebaseService";
import { SqliteService } from "../services/sqliteService";
import { MoneyService } from "../services/money.service";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule,
        SettingsRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        SettingsComponent,
        PriceConfigComponent,
        NotifComponent,
        CredentialsComponent
    ],
    providers: [
        NotificationService,
        FirebaseService,
        SqliteService,
        MoneyService,
        NotificationService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class SettingsModule { }
