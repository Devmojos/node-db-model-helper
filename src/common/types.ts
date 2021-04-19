export enum Env {
    local = "local",
    development = "development",
    production = "production"
}

export interface IDBHelperSettings {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
}

export interface IModelQueries {
    getTables(): Promise<string[]>
    getColumns(tableName: string): Promise<IDBAttribute[]>
}

export interface IDBHelper {
    createPool(): void;
    model: IModelQueries
    close(): void
}

export interface IDBHelpers {
    mysql(settings: IDBHelperSettings) : IDBHelper
}

export enum DBAttributeType {
    tinyint = "tinyint",
    int = "int",
    double = "double",
    varchar = "varchar",
    text = "text",
    datetime = "datetime",
    bigint = "bigint",
    bit = "bit",
    json = "json"
}

export interface IDBAttributeReference {
    tableSchema: string
    tableName: string
    columnName: string
}

export interface IDBAttribute {
    name: string
    isPrivateKey: boolean
    isUniqueKey: boolean
    isForeignKey: boolean
    extra: string
    isNullable: boolean
    dataType: DBAttributeType
    columnType: string 
    characterMaximumLength?: number
    reference?: IDBAttributeReference
}


