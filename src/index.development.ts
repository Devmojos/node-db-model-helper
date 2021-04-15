import MysqlHelper from './mysql';
import { IDBHelper, IDBHelpers, IDBHelperSettings } from './common/types';


const config : IDBHelperSettings = {
    host: "localhost",
    user: "mygon",
    password: "password",
    database: "mygon_localhost",
    port: 3306
};

const test = async (db: IDBHelper) => {
    const tables = await db.model.getTables();

    console.log( "| Tables", tables )

    const columns = await db.model.getColumns("transaction_details");

    console.log("| Columns: ", columns);

    db.close();
};

const mysql = MysqlHelper({
    database: config.database,
    user: config.user,
    password: config.password,
    host: config.host,
    port: 3306
})

test(mysql);

export default {
    mysql: MysqlHelper
} as IDBHelpers;