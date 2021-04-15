import * as mysql from 'mysql2';
import { PoolOptions, Pool, RowDataPacket, FieldPacket } from 'mysql2';
import { IMysqlConnector, IQueryResult } from './types';
import ModelQueries from './model-queries';

const MysqlConnection = (conf : PoolOptions) : IMysqlConnector => {

    let pool : Pool;

    const createPool = () => {
        if (typeof pool !== "undefined") {
            pool.end();
        }

        pool  = mysql.createPool({
            connectionLimit: 10,
            ...conf
        });

        return pool;
    };

    const query = (sql: string) : Promise<IQueryResult> => {
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