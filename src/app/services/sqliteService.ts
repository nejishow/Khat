import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";

@Injectable()
export class SqliteService implements OnInit {
    database;
    idContent;
    constructor(private httpClient: HttpClient) {

    }

    updateContent(array) {
        // tslint:disable-next-line:max-line-length
        return this.database.execSQL("update contents set title=?, experiment=?, conclusion=?, reference=?, Image=? where idContent=?",
            // tslint:disable-next-line:max-line-length
            [array.title, array.experiment, array.conclusion, array.reference, array.Image, array.idContent]);
    }
    insertContent(array) {
        // tslint:disable-next-line:max-line-length
        return this.database.execSQL("INSERT INTO contents (idContent,title, experiment, conclusion, reference, Image, idMENU) VALUES (?,?,?,?,?,?,?)",
            // tslint:disable-next-line:max-line-length
            [array.idContent, array.title, array.experiment, array.conclusion, array.reference, array.Image, array.idMENU]);
    }

    ngOnInit(): void {
        //
    }

}
