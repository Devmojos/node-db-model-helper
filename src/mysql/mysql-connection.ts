const mysql = require('mysql2');
import { IMysqlConnectionConf, IMysqlConnector, IQueryResult } from './types';
import ModelQueries from './model-queries';

const MysqlConnection = (conf : IMysqlConnectionConf) : IMysqlConnector => {

    let pool : any = undefined;

    const createPool = () => {
        if (typeof pool != "undefined") {
            pool.end();
        }

        pool  = mysql.createPool({
            connectionLimit : 10,
            ...conf
        });

        return pool;
    };

    const query = (sql: string) : Promise<IQueryResult> => {
        return new Promise((resolve, onError) => {
            pool.query(sql, (error : Error, results : Array<any>, fields : Array<any>) => {
                if (error) {
                    onError(error);
                } else {
                    const queryResult : IQueryResult = {
                        results,
                        fields
                    };
                    resolve(queryResult);
                }
            });
        });
    }

    const close = () : void => {
        pool?.end();
    };

    return {
        pool: createPool(),
        query,
        model: ModelQueries(query),
        close
    }
};

export default MysqlConnection;