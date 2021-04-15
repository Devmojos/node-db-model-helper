import { RowDataPacket } from 'mysql2';
import { IDBAttribute, DBAttributeType } from '../common/types';

export const toIDBAttribute = (row : RowDataPacket) : IDBAttribute => {

    const isPrivateKey = row.FK === "FK";

    return {
        name: row.COLUMN_NAME,
        isPrivateKey: row.PK === "PK",
        isUniqueKey: row.UQ === "UQ",
        isForeignKey: isPrivateKey,
        extra: row.EXTRA,
        isNullable: row.IS_NULLABLE === "YES",
        dataType: row.DATA_TYPE as DBAttributeType,
        columnType: row.COLUMN_TYPE,
        characterMaximumLength: row?.CHARACTER_MAXIMUM_LENGTH as number,
        reference: !isPrivateKey
            ? undefined
            :   {
                    tableSchema: row.REFERENCED_TABLE_SCHEMA,
                    tableName: row.REFERENCED_TABLE_NAME,
                    columnName: row.REFERENCED_COLUMN_NAME
                }
    }
}