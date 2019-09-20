import { Couchebase } from './couchebase';
import { Injectable, OnInit } from "@angular/core";
import * as firebase from "nativescript-plugin-firebase";
import { Observable, Subject } from "rxjs";

@Injectable()
export class FirebaseService implements OnInit {
    experiment: any;
    path;
    db;
    userAuth = new Subject();
    userConnected;
    user;
    constructor(private CB: Couchebase) {
        //
    }
    initFirebase() {
        firebase.init({
            // optional but useful to immediately re-logon the user when he re-visits your app
            onAuthStateChanged: function (data) {
                console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
                if (data.loggedIn) {
                    console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
                }
            }
        }).then(
            () => {
                firebase.getCurrentUser()
                    .then((user) => {
                        this.userConnected = true;
                        this.user = user;
                        this.userAuth.next(user);
                    })
                    .catch((error) => console.log("Trouble in paradise: " + error));
            },
            (error) => {
                console.log(`firebase.init error: ${error}`);
            }
        );
    }
    numberOfDate() {
        setTimeout(() => {
            this.getFirstDate().then(
                (data) => {
                    const date2 = new Date();
                    const date1 = new Date(data);
                    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    const dayDifference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    setTimeout(() => {
                        this.db.execSQL("UPDATE dataCollection set numberOfDay=? where idData=?", [dayDifference, 1]);

                    }, 1000);
                }

            );
        }, 1000);

    }
    firstDate() {
        return this.db.execSQL("UPDATE dataCollection set firstDay=? where idData=?", [new Date(), 1]);
    }
    getFirstDate() {
        return this.db.get("SELECT firstDay from dataCollection where idData=?", [1]);
    }
    getNumberOfDate() {
        return this.db.get("SELECT numberOfDay from dataCollection where idData=?", [1]);

    }
    getHours() {
        return this.db.get("SELECT hours from notification where id=?", [1]);

    }
    putHours() {
        this.db.get("SELECT hours from dataCollection where idData=?", [1]).then(
            (data) => {
                this.getHours().then(
                    (hour) => {
                        const totalHours = data[0] + hour[0];
                        this.db.execSQL("UPDATE dataCollection set hours=?, updated=? where idData=?", [totalHours, false, 1]);
                    }
                );
            }
        );
    }
    deleteHours() {
        this.db.get("SELECT hours from dataCollection where idData=?", [1]).then(
            (data) => {
                this.getHours().then(
                    (hour) => {
                        const totalHours = data[0] - hour[0];
                        this.db.execSQL("UPDATE dataCollection set hours=?, updated=? where idData=?", [totalHours, false, 1]);
                    }
                );
            }
        );
    }
    putAge(age) {
        return this.db.execSQL("UPDATE dataCollection set age=?, hours=?, updated=? where idData=?", [age, 0, false, 1]);

    }
    putIdFirebaseSQL(id) {
        return this.db.execSQL("UPDATE dataCollection set idFirebase=? where idData=?", [id, 1]);

    }
    navigation(data) {
        this.path = data;
    }
    ngOnInit(): void {
        //
    }
    checkIdFirebase() {
        return this.db.get("SELECT idFirebase from dataCollection where idData=?", [1]);
    }
    putIdFirebase() {
        this.checkIdFirebase().then(
            (data) => {
                if (data[0] === null || data.length === 0) {
                    const userCollection = firebase.firestore.collection("users");

                    return userCollection.add(
                        {
                            idFirebase: "",
                            age: "",
                            firstDate: "",
                            numberOfDay: "",
                            TotalHours: "",
                            KhatTotal: "",
                            DrinksTotal: "",
                            TabacTotal: "",
                            khat: "",
                            drinks: "",
                            tabac: ""

                        }
                    ).then(
                        (documentRef) => {
                            const userDoc = firebase.firestore.collection("users").doc(documentRef.id);
                            userDoc.update(
                                {
                                    idFirebase: documentRef.id
                                }
                            ).then(
                                () => this.putIdFirebaseSQL(documentRef.id)
                            );
                        }
                    );
                }
            }
        );

    }
    getDataCollec() {
        return this.db.get("SELECT * from dataCollection where idData=?", [1]);
    }
    updateFirebase() {
        this.getDataCollec().then(
            (data) => {
                if (data[1] === "false") {
                    if (data[2] !== null && data[2].length > 0) {
                        const userDoc = firebase.firestore.collection("users").doc(data[2]);
                        userDoc.update(
                            {
                                age: data[3],
                                TotalHours: data[4],
                                firstDate: data[5],
                                numberOfDay: data[6],
                                khat: data[7],
                                drinks: data[8],
                                tabac: data[9],
                                KhatTotal: data[10],
                                DrinksTotal: data[11],
                                TabacTotal: data[12]
                            }
                        ).then(
                            () => {
                            }
                        );
                    }
                }
            }
        );
    }

    startWifiRelated() { // every wifi relation code


        // setTimeout(() => {
        //     this.putIdFirebase();
        //     this.updateFirebase();
        // }, 2000);
    }
    async  createNewData(id) {
        let items = [];
        const itemsColl = firebase.firestore.collection("items");
        await itemsColl.get({ source: "server" }).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    idItem: parseInt(doc.id),
                    name: data.name,
                    price: data.price,
                    consummed: data.consummed,
                    image: data.image
                }
                );
            });
        });
        const itemsColll = firebase.firestore.collection("data").doc(id).collection("items");
        let i;
        for (i = 0; i < items.length; i++) {
            itemsColll.doc(items[i].idItem.toString()).set({
                price: null,
                consummed: false,
                idItem: items[i].idItem,
                name: items[i].name,
                image: items[i].image
            });

        }
    }
    fillNOSQL() {

        const content = this.CB.database.query({
            select: [], // Leave empty to query for all
            from: "", // Omit or set null to use current db
            where: [{ property: "idMENU", comparison: "equalTo", value: 1 }]
            //    order: [{ property: 'firstName', direction: 'desc' }],
            //    limit: 2
        });

        if (content.length === 0) {
            const contentsColl = firebase.firestore.collection("contents");
            contentsColl.get({ source: "server" }).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                    const data = doc.data();
                    const documentId = this.CB.database.createDocument(
                        {
                            "idContent": doc.id,
                            "experiment": data.experiment,
                            "conclusion": data.conclusion,
                            "idMENU": data.idMENU,
                            "image": data.image,
                            "reference": data.reference,
                            "title": data.title
                        }
                    );
                    this.CB.database.updateDocument(documentId, {
                        "documentId": documentId
                    });
                });
            });
        }
        const headContent = this.CB.database.query({
            select: [], // Leave empty to query for all
            from: "", // Omit or set null to use current db
            where: [{ property: "idMenu", comparison: "equalTo", value: 1 }]
            //    order: [{ property: 'firstName', direction: 'desc' }],
            //    limit: 2
        });

        if (headContent.length === 0) {
            const headColl = firebase.firestore.collection("headTitle");
            headColl.get({ source: "server" }).then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const documentId = this.CB.database.createDocument(
                        {
                            "idMenu": data.IdMenu,
                            "title": data.title

                        }
                    );
                    this.CB.database.updateDocument(documentId, {
                        "documentId": documentId
                    });
                });
            });
        }
    }
}
