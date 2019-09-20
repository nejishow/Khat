import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { FirebaseService } from "~/app/services/firebaseService";
import { UserLogService } from "~/app/services/user-log.service";
import { User } from "~/models/user.model";

@Component({
  selector: "ns-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.css"],
  moduleId: module.id
})
export class SignInComponent implements OnInit {

  isLoggingIn = true;
  password; // confirm password
  user: User;
  age;

  constructor(private userLogService: UserLogService, private fireS: FirebaseService) {
    this.user = new User();
  }
  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }

  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
  submit() {
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  login() {
    this.userLogService.signIn(this.user);
  }

  signUp() {
    this.userLogService.register(this.age, this.user, this.password);
  }
  forgotPassword() {
    prompt({
      title: "Forgot Password",
      message: "Enter the email address you used to register for APP NAME to reset your password.",
      defaultText: "",
      okButtonText: "Ok",
      cancelButtonText: "Cancel"
    }).then((data) => {
      if (data.result) {
        // Call the backend to reset the password
        alert({
          title: "APP NAME",
          // tslint:disable-next-line:max-line-length
          message: "Your password was successfully reset. Please check your email for instructions on choosing a new password.",
          okButtonText: "Ok"
        });
      }
    });
  }
  ngOnInit() {
    //
  }
}
