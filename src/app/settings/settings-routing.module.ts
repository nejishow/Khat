import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { CredentialsComponent } from "./credentials/credentials.component";
import { NotifComponent } from "./notif/notif.component";
import { PriceConfigComponent } from "./price-config/price-config.component";
import { SettingsComponent } from "./settings.component";

export const routes: Routes = [
    {
        path: "", component: SettingsComponent
    },
    {
        path: "priceConfig", component: PriceConfigComponent
    },
    {
        path: "notif", component: NotifComponent
    },
    {
        path: "credentials", component: CredentialsComponent
    }

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class SettingsRoutingModule { }
