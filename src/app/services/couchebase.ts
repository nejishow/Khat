import { Injectable } from "@angular/core";
import { Couchbase } from "nativescript-couchbase-plugin";
import { SqliteService } from "./sqliteService";
@Injectable()
export class Couchebase {

    database: any;
    id: any;
    private pull: any;
    private push: any;

    constructor(private sql: SqliteService) {

    }
    init() {
        //
        this.database = new Couchbase("khatDatabase");
        // this.database.destroyDatabase();

    }

    getDatabase() {
        //
    }
    displaContent(id) {
        const results = this.database.query({
            select: [], // Leave empty to query for all
            from: "", // Omit or set null to use current db
            where: [{ property: "id", comparison: "equalTo", value: id }]
            //    order: [{ property: 'firstName', direction: 'desc' }],
            //    limit: 2
        });

        return results;
    }

    createConsumption() {
        const documentId = this.database.createDocument(
            {
                "idConcumption": 1,
                "consumption": false
            }
        );
        this.database.updateDocument(documentId, {
            "documentId": documentId
        });
    }

}
