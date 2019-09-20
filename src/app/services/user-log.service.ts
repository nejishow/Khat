import { MoneyService } from '~/app/services/money.service';
import { Couchebase } from '~/app/services/couchebase';
import { Injectable, OnInit } from "@angular/core";
import { Router, Routes } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as dialogs from "tns-core-modules/ui/dialogs";

import { Subject, from } from "rxjs";
import { User } from "~/models/user.model";
import { FirebaseService } from "./firebaseService";

import * as firebase from "nativescript-plugin-firebase";
@Injectable()

export class UserLogService implements OnInit {
    username;
    email;
    userConnected = false;
    userAuth = new Subject();
    database;
    // tslint:disable-next-line:max-line-length
    constructor(private router: Router, private routerExtensions: RouterExtensions, private fireS: FirebaseService, private CB: Couchebase, private money: MoneyService) {
        //
    }
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }
    successfulConn(name) {
        this.fireS.firstDate();
        dialogs.alert({
            title: "Nouvel utilisateur crée",
            message: "Bienvenue " + name + ", pour plus d'informations sur l'application veuillez naviguez vers 'Details'",
            okButtonText: "Ok!"
        });
        this.router.navigate(["/home"]);
    }
    successfulUpdate(name) {
        this.fireS.firstDate();
        dialogs.alert({
            title: "Utilisateur mis à jour",
            message: "Vos informations de connections sont dorenavant changés " + name,
            okButtonText: "Ok!"
        });
        this.router.navigate(["/settings"]);
    }
    failedConn() {

        dialogs.alert({
            title: "Problem de connexion",
            message: "Addresse email, nom d'utilisateur ou mot de passe incorrecte",
            okButtonText: "OK"
            // tslint:disable-next-line:semicolon
        })
    }
    failedCreate(message) {

        dialogs.alert({
            title: "Utilisateur non crée",
            message: "Veuillez s'il vous plait correctement completez le formulaire" || message,
            okButtonText: "OK"
            // tslint:disable-next-line:semicolon
        })
    }

    register(age, user: User, passord) {
        if (age <= 15) {
            dialogs.alert({
                title: "Utilisateur trop jeune",
                message: "Vous devez avoir plus que 15 ans pour utiliser l'application",
                okButtonText: "OK"
                // tslint:disable-next-line:semicolon
            })
        } else if (user.email && user.username && user.password && user.password === passord) {
            firebase.createUser({
                email: user.email,
                password: user.password
            }).then(
                (user) => {
                    this.userAuth.next(user);
                    this.fireS.createNewData(user.uid);
                    this.router.navigate(["/home"]);
                    //  this.fireS.createCollection(user); // create collection once user created

                    //  this.fireS.putAge(age);
                },
                (errorMessage) => {
                    this.failedCreate(errorMessage);

                }
            );
        }
    }
    updateUser(username, age, user: User, newPassword, cPassword) {
        if (age <= 15) {
            dialogs.alert({
                title: "Utilisateur trop jeune",
                message: "Vous devez avoir plus que 15 ans pour utiliser l'application",
                okButtonText: "OK"
                // tslint:disable-next-line:semicolon
            })
        }
        // this.sql.signInUser(username, user.password).then(
        //     (data) => {
        //         if (data.length === 0 || data.length === null) {
        //             this.failedConn();
        //         } else if (user.email && user.username && age && newPassword === cPassword) {
        //             //
        //         } else {
        //             this.failedCreate();
        //         }

        //     });
    }

    signIn(user: User) {
        firebase.login(
            {
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: user.username,
                    password: user.password
                }
            })
            .then(async (user) => {
                this.userAuth.next(user);
                await this.money.getItems(user.uid);
                this.router.navigate(["/home"]);

            })
            .catch((error) => {
                console.log(error);
                this.failedConn();
            });        //   else {

        //     }

    }
    signOutUser() {
        firebase.logout();

    }

}
