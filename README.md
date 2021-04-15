# db-model-helper

## Introduction
Db Model helper is a helper to get model and other information from an existent database.

## Database Support
For now, the only database supported is Mysql

## Install
```bash
npm i @devmojos/db-model-helper --save
```

## Usage Example

```node
import DbHelpers from '@devmojos/db-model-helper';
import { IDBHelper, IDBAttribute } from '@devmojos/db-model-helper/common/types';

const mysqlHelper : IDBHelper = DbHelpers.mysql({
    host: "localhost",
    user: "username",
    password: "password",
    database: "database_name",
    port: 3306
});

const displayInfo = async (db: IDBHelper) => {

    //Tables
    const tables : string[] = await db.model.getTables();
    console.log("Tables: ", tables )

    //Columns
    const columns = await db.model.getColumns("some_table");
    console.log("Columns: ", columns);

    //Close database connection when you don't need it anymore
    db.close();

};

displayInfo(mysqlHelper);


```


## Development

### install
```bash
npm install
```

### build
```bash
npm run build
```

### test
```bash
npm test
```

### run locally
```bash
#You need to create your own index.development.ts first
npm run local
```
