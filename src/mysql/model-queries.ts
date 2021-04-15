import { IQueryExecutor, RowDataPacket } from './types';
import { IModelQueries, IDBAttribute } from '../common/types';
import { toIDBAttribute } from './maps';


const Queries = (query: IQueryExecutor) : IModelQueries => {

    const getTables = async () : Promise<string[]> => {
        const {results, fields} = await query("SHOW TABLES");
        if (results.length > 0) {
            const fieldName = fields[0].name;
            return results.map(val => val[fieldName]);
        } else {
            return [];
        }        
    };

    const getColumns = async (tableName: string) : Promise<IDBAttribute[]> => {
        const sql = `
            SELECT c.COLUMN_NAME,
            -- c.COLUMN_KEY,
            IF(EXISTS(select *
                    FROM information_schema.KEY_COLUMN_USAGE k
                    JOIN information_schema.TABLE_CONSTRAINTS tc 
                        ON (k.TABLE_SCHEMA=tc.TABLE_SCHEMA 
                            AND k.TABLE_NAME=tc.TABLE_NAME 
                            AND k.CONSTRAINT_NAME=tc.CONSTRAINT_NAME)
                    WHERE k.TABLE_SCHEMA=c.TABLE_SCHEMA 
                        AND k.TABLE_NAME=c.TABLE_NAME 
                        AND tc.CONSTRAINT_TYPE='PRIMARY KEY' 
                        AND c.COLUMN_NAME=k.COLUMN_NAME),'PK',null) AS PK,
            IF(EXISTS(select *
                    FROM information_schema.KEY_COLUMN_USAGE k
                    JOIN information_schema.TABLE_CONSTRAINTS tc 
                        ON (k.TABLE_SCHEMA=tc.TABLE_SCHEMA 
                        AND k.TABLE_NAME=tc.TABLE_NAME 
                        AND k.CONSTRAINT_NAME=tc.CONSTRAINT_NAME)
                    WHERE k.TABLE_SCHEMA=c.TABLE_SCHEMA 
                        AND k.TABLE_NAME=c.TABLE_NAME 
                        AND tc.CONSTRAINT_TYPE='UNIQUE' 
                        AND c.COLUMN_NAME=k.COLUMN_NAME),'UQ',null) AS UQ,
            IF(EXISTS(select *
                    FROM information_schema.KEY_COLUMN_USAGE k
                    JOIN information_schema.TABLE_CONSTRAINTS tc 
                        ON (k.TABLE_SCHEMA=tc.TABLE_SCHEMA 
                        AND k.TABLE_NAME=tc.TABLE_NAME 
                        AND k.CONSTRAINT_NAME=tc.CONSTRAINT_NAME)
                    WHERE k.TABLE_SCHEMA=c.TABLE_SCHEMA 
                        AND k.TABLE_NAME=c.TABLE_NAME 
                        AND tc.CONSTRAINT_TYPE='FOREIGN KEY' 
                        AND c.COLUMN_NAME=k.COLUMN_NAME),'FK',null) AS FK,
                    c.EXTRA,
                    c.IS_NULLABLE,
                    c.DATA_TYPE,
                    c.COLUMN_TYPE,
                    c.CHARACTER_MAXIMUM_LENGTH,
                    c.COLUMN_COMMENT,
                    k.REFERENCED_TABLE_SCHEMA,
                    k.REFERENCED_TABLE_NAME,
                    k.REFERENCED_COLUMN_NAME
            FROM information_schema.COLUMNS c
            LEFT JOIN information_schema.KEY_COLUMN_USAGE k
                ON (k.TABLE_SCHEMA=c.TABLE_SCHEMA
                AND k.TABLE_NAME=c.TABLE_NAME
                AND k.COLUMN_NAME=c.COLUMN_NAME
                AND k.POSITION_IN_UNIQUE_CONSTRAINT IS NOT NULL)
            WHERE c.TABLE_NAME='${tableName}';
        `;

        const {results, fields} = await query(sql);

        return results.map( (value : RowDataPacket) => {
            return toIDBAttribute(value);
        });
    };

    return {
        getTables,
        getColumns
    }
};


export default Queries;