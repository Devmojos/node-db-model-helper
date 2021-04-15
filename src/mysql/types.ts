import { IModelQueries } from '../common/types';

export interface IMysqlConnectionConf {
    host     : string
    user     : string
    password : string
    database : string
    port     : number
    connectionLimit?: number
}

export type IQueryExecutor = (sql: string) => Promise<IQueryResult>;

export interface IQueryResult {
    results: Array<any>
    fields: Array<any>
}

export interface IMysqlConnector {
    pool: any,
    query(sql: string): Promise<IQueryResult>,
    model: IModelQueries,
    close(): void
}

export interface RowDataPacket {
    COLUMN_NAME: string,
    PK?: string,
    UQ?: string,
    FK?: string,
    EXTRA: string,
    IS_NULLABLE: string,
    DATA_TYPE: string,
    COLUMN_TYPE: string,
    CHARACTER_MAXIMUM_LENGTH?: number,
    COLUMN_COMMENT: string,
    REFERENCED_TABLE_SCHEMA: string,
    REFERENCED_TABLE_NAME: string,
    REFERENCED_COLUMN_NAME: string
  }



