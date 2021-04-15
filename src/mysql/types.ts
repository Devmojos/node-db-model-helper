import { RowDataPacket, FieldPacket } from 'mysql2';
import { IModelQueries } from '../common/types';

export type IQueryExecutor = (sql: string) => Promise<IQueryResult>;

export interface IQueryResult {
    results: RowDataPacket[]
    fields: FieldPacket[]
}

export interface IMysqlConnector {
    pool: any,
    query(sql: string): Promise<IQueryResult>,
    model: IModelQueries,
    close(): void
}

