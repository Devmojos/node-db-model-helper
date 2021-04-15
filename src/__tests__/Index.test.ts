const { GenericContainer } = require("testcontainers");

import DbHelpers from '../index';
import { IDBHelper, IDBAttribute } from '../common/types';

jest.setTimeout(30000);

let envContainer : any;
let knexTestSetup: any;
let mappedPort : number;
let mysqlHelper : IDBHelper; 

beforeAll(async () => {

    const username = 'root';
    const password = 'password';
    
    envContainer = await new GenericContainer("mysql:8.0.23")
        .withEnv("MYSQL_ROOT_PASSWORD", "password")
        .withEnv("MYSQL_DATABASE", "mydb")
        .withExposedPorts(3306)
        .start();  

    process.env.MYSQL_PORT = envContainer.getMappedPort(3306);

    const knexTestConfig = require("../../knexfile.js")["test"];
    knexTestSetup = require("knex")(knexTestConfig);
    await knexTestSetup.migrate.latest();

    mysqlHelper = DbHelpers.mysql({
        user: knexTestConfig.connection.user,
        password: knexTestConfig.connection.password,
        host: knexTestConfig.connection.host,
        database: knexTestConfig.connection.database,
        port: knexTestConfig.connection.port
    });
});    

afterAll(async () => {
    //await knexTestSetup.migrate.rollback(true);
    await envContainer.stop();
});

describe("IndexIntegrationTest", () => {

    it("test-tables", async () => {
        const tables : string[] = await mysqlHelper.model.getTables();
        expect(tables.sort()).toEqual(["knex_migrations", "knex_migrations_lock", "tasks", "users"].sort());
    });

    it("test-table-columns", async () => {
        const columns : IDBAttribute[] = await mysqlHelper.model.getColumns("tasks");
        expect(columns).toEqual([
                {
                    "characterMaximumLength": null,
                    "columnType": "int unsigned",
                    "dataType": "int",
                    "extra": "auto_increment",
                    "isForeignKey": false,
                    "isNullable": false,
                    "isPrivateKey": true,
                    "isUniqueKey": false,
                    "name": "id",
                    "reference": undefined,
                },
                {
                    "characterMaximumLength": 255,
                    "columnType": "varchar(255)",
                    "dataType": "varchar",
                    "extra": "",
                    "isForeignKey": false,
                    "isNullable": false,
                    "isPrivateKey": false,
                    "isUniqueKey": false,
                    "name": "title",
                    "reference": undefined,
                },
                {
                    "characterMaximumLength": 255,
                    "columnType": "varchar(255)",
                    "dataType": "varchar",
                    "extra": "",
                    "isForeignKey": false,
                    "isNullable": false,
                    "isPrivateKey": false,
                    "isUniqueKey": false,
                    "name": "description",
                    "reference": undefined,
                },
                {
                    "characterMaximumLength": null,
                    "columnType": "tinyint(1)",
                    "dataType": "tinyint",
                    "extra": "",
                    "isForeignKey": false,
                    "isNullable": false,
                    "isPrivateKey": false,
                    "isUniqueKey": false,
                    "name": "is_complete",
                    "reference": undefined,
                },
                {
                    "characterMaximumLength": null,
                    "columnType": "int unsigned",
                    "dataType": "int",
                    "extra": "",
                    "isForeignKey": true,
                    "isNullable": true,
                    "isPrivateKey": false,
                    "isUniqueKey": false,
                    "name": "user_id",
                    "reference": {
                        "columnName": "id",
                        "tableName": "users",
                        "tableSchema": "mydb",
                    },
                },
                {
                    "characterMaximumLength": null,
                    "columnType": "timestamp",
                    "dataType": "timestamp",
                    "extra": "DEFAULT_GENERATED",
                    "isForeignKey": false,
                    "isNullable": true,
                    "isPrivateKey": false,
                    "isUniqueKey": false,
                    "name": "created_at",
                    "reference": undefined,
                },
                {
                    "characterMaximumLength": null,
                    "columnType": "timestamp",
                    "dataType": "timestamp",
                    "extra": "DEFAULT_GENERATED",
                    "isForeignKey": false,
                    "isNullable": true,
                    "isPrivateKey": false,
                    "isUniqueKey": false,
                    "name": "updated_at",
                    "reference": undefined,
                }
        ]);
    });
    
});