import { IMysqlConnector } from './types';
import { IDBHelper, IDBHelperSettings } from '../common/types';
import MysqlConnection from './mysql-connection';

const MysqlHelper = (settings: IDBHelperSettings) : IDBHelper => {   
    
    const db : IMysqlConnector = MysqlConnection({
        host: settings.host,
        user: settings.user,
        password: settings.password,
        database: settings.database,
        port: settings.port
    });
     
    return {
        createPool: db.createPool,
        model: db.model,
        close: db.close
    };
};

export default MysqlHelper;