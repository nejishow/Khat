import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { ConclusionComponent } from "./experiments/conclusion/conclusion.component";
import { ExperimentComponent } from "./experiments/experiment/experiment.component";
import { MenuComponent } from "./menu.component";
import { SubMenuComponent } from "./sub-menu/sub-menu.component";
import { FirebaseService } from "../services/firebaseService";
import { SqliteService } from "../services/sqliteService";
import { MenuRoutingModule } from "./menu-routing.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptHttpModule } from "nativescript-angular/http";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    ConclusionComponent,
    ExperimentComponent,
    MenuComponent,
    SubMenuComponent
  ],
  imports: [
    NativeScriptCommonModule,
    MenuRoutingModule,
    NativeScriptFormsModule,
    NativeScriptRouterModule,
    NativeScriptHttpModule,
    HttpClientModule
  ],
  providers: [
    FirebaseService,
    SqliteService
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MenuModule { }
