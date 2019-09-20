import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { MenuComponent } from "./menu.component";
import { SubMenuComponent } from "./sub-menu/sub-menu.component";
import { ConclusionComponent } from "./experiments/conclusion/conclusion.component";
import { ExperimentComponent } from "./experiments/experiment/experiment.component";

const routes: Routes = [
    { path: "", component: MenuComponent },
    { path: "submenu", component: SubMenuComponent },
    { path: "conclusion", component: ConclusionComponent },
    { path: "experiment", component: ExperimentComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class MenuRoutingModule { }
