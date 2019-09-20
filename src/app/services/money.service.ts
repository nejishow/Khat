import { Couchebase } from "~/app/services/couchebase";
import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FirebaseService } from "./firebaseService";
import * as firebase from "nativescript-plugin-firebase";

@Injectable()
export class MoneyService implements OnInit {
    db;
    idContent;
    i;
    items = [];
    constructor(private fireS: FirebaseService, private CB: Couchebase) {
        //
    }
    checkConsumption(id) {

        const consummedColl = firebase.firestore.collection("data").doc(id).collection("items")
            .where("consummed", "==", true);

        return consummedColl.get({ source: "server" });
    }
    getConsumption(id, date) {

        const consumptionColl = firebase.firestore.collection("data").doc(id).collection("consumptions")
            .where("date", "==", date);
        return consumptionColl.get({ source: "server" });
    }
    getAllConsumption(id) {

        const consumptionColl = firebase.firestore.collection("data").doc(id).collection("consumptions");
        consumptionColl.get({ source: "server" }).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();

            });
        });
    }
    putConsumption(array, id) {
        const consumptionColl = firebase.firestore.collection("data").doc(id).collection("consumptions");

        for (this.i = 0; this.i < array.length; this.i++) {
            consumptionColl.add({
                date: array[this.i].date,
                price: array[this.i].price,
                name: array[this.i].name
            });

        }
        this.updateDataCollection();
    }
    // getKhat() {
    //     let result = 0;

    //     return this.db.all("SELECT priceItem FROM consumption where nameItem=?", ["Khat"]).then(
    //         (data) => {
    //             if (data.length > 0) {

    //                 // tslint:disable-next-line:prefer-for-of
    //                 for (let index = 0; index < data.length; index++) {
    //                     // tslint:disable-next-line:max-line-length
    //                     result = result + parseInt(data[index], 10); // le resultat data est en string il le change en nbr
    //                 }

    //                 return result;

    //             } else {
    //                 return result;

    //             }

    //         }
    //     );
    // }
    // getTabac() {
    //     let result = 0;

    //     return this.db.all("SELECT priceItem FROM consumption where nameItem=?", ["Tabac"]).then(
    //         (data) => {
    //             if (data.length > 0) {

    //                 // tslint:disable-next-line:prefer-for-of
    //                 for (let index = 0; index < data.length; index++) {
    //                     // tslint:disable-next-line:max-line-length
    //                     result = result + parseInt(data[index], 10); // le resultat data est en string il le change en nbr
    //                 }

    //                 return result;

    //             } else {
    //                 return result;

    //             }

    //         }
    //     );
    // }
    // getboisson() {
    //     let result = 0;

    //     return this.db.all("SELECT priceItem FROM consumption where nameItem=?", ["boisson"]).then(
    //         (data) => {
    //             if (data.length > 0) {

    //                 // tslint:disable-next-line:prefer-for-of
    //                 for (let index = 0; index < data.length; index++) {
    //                     // tslint:disable-next-line:max-line-length
    //                     result = result + parseInt(data[index], 10); // le resultat data est en string il le change en nbr
    //                 }

    //                 return result;

    //             } else {
    //                 return result;

    //             }

    //         }
    //     );
    // }
    updateDataCollection() {


    }
    updateConsumption(id, array, date) {

        const consumColl = firebase.firestore.collection("data").doc(id).collection("items")
            .where('date', "==", date);
        const singleColl = firebase.firestore.collection("data").doc(id).collection("items")

        consumColl.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    for (let i = 0; i < array.length; i++) {
                        if (array[i].name === doc.data().name) {
                            singleColl.doc(doc.id).update({
                                price: array[i].price
                            });
                        }
                    }
                });
            });

        this.updateDataCollection();

    }

    async price(array) {
        let user: any;
        await firebase.getCurrentUser().then(
            (User) => {
                return user = User;
            }
        );
        let count = 0;
        try {

            const itemsColl = firebase.firestore.collection("data").doc(user.uid).collection("items");

            for (this.i = 0; this.i < array.length; this.i++) {
                itemsColl.doc(array[this.i].idItem.toString()).update({
                    price: array[this.i].price,
                    consummed: array[this.i].consummed
                });
                if (array[this.i].consummed) {
                    count = count + 1;
                }
            }
        } catch (error) {
            console.log("firebase problem");

        }
        try {
            let consumption = this.CB.database.query({
                select: [], // Leave empty to query for all
                from: "", // Omit or set null to use current db
                where: [{ property: "idConcumption", comparison: "equalTo", value: 1 }]
                //    order: [{ property: 'firstName', direction: 'desc' }],
                //    limit: 2
            });
            if (consumption.length === 0) {
                await this.CB.createConsumption();
                consumption = this.CB.database.query({
                    select: [], // Leave empty to query for all
                    from: "", // Omit or set null to use current db
                    where: [{ property: "idConcumption", comparison: "equalTo", value: 1 }]
                    //    order: [{ property: 'firstName', direction: 'desc' }],
                    //    limit: 2
                });
            }

            if (count === 0) {
                this.CB.database.updateDocument(consumption[0].documentId, {
                    consumption: false
                });
            } else {
                this.CB.database.updateDocument(consumption[0].documentId, {
                    consumption: true
                });
            }
        } catch (error) {
            console.log("nosql problem");

        }

    }

    getPrice() {
        //      return this.db.all("SELECT * FROM items");
    }

    ngOnInit() {
        //
    }
    deleteConsumption(db, date) {
        db.execSQL("DELETE from consumption where date=? ", [date]);
        this.updateDataCollection();
        this.fireS.deleteHours();
    }

    getItems(id) {
        if (this.items.length === 0) {

            try {
                const itemsColl = firebase.firestore.collection("data").doc(id).collection("items");
                itemsColl.limit(3).get({ source: "server" }).then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();

                        this.items.push({
                            idItem: parseInt(doc.id),
                            name: data.name,
                            price: data.price,
                            consummed: data.consummed,
                            image: data.image
                        }
                        );


                    });
                });

            } catch (error) {
                console.log(error);

            }
        }
    }
}
