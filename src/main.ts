// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { Fontawesome } from "nativescript-fontawesome";
import { AppModule } from "./app/app.module";
Fontawesome.init();

platformNativeScriptDynamic().bootstrapModule(AppModule);
