import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SignInComponent } from "./components/auth/sign-in/sign-in.component";
import { TodayComponent } from "./monitoring/today/today.component";
import { CalendarComponent } from "./monitoring/calendar/calendar.component";

const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "settings", loadChildren: "~/app/settings/settings.module#SettingsModule" },
    { path: "menu", loadChildren: "./menu/menu.module#MenuModule" },

    { path: "signIn", component: SignInComponent },
    { path: "today", component: TodayComponent },
    { path: "calendar", component: CalendarComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
