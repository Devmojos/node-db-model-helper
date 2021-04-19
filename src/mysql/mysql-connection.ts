import * as mysql from 'mysql2';
import { PoolOptions, Pool, RowDataPacket, FieldPacket } from 'mysql2';
import { IMysqlConnector, IQueryResult } from './types';
import ModelQueries from './model-queries';

const MysqlConnection = (conf : PoolOptions) : IMysqlConnector => {

    let pool : Pool;

    const poolExists = () : boolean => {
        return typeof pool !== "undefined";
    };

    const obj : IMysqlConnector = <IMysqlConnector>{};

    obj.createPool = () : void => {
        if (!poolExists()) {
            pool  = mysql.createPool({
                connectionLimit: 10,
                ...conf
            });
        }
    };

    obj.query = (sql: string) : Promise<IQueryResult> => {
        return new Promise((resolve, onError) => {
            pool.query(sql, (error : Error, results : RowDataPacket[], fields : FieldPacket[]) => {
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

    obj.close = () : void => {
        pool?.end();
    };

    obj.model = ModelQueries(obj.query);

    return obj;
};

export default MysqlConnection;