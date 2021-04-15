module.exports = {
    test: {
      client: "mysql2",
      connection: {
        host: "localhost",
        user: "root",
        password: "password",
        database: "mydb",
        port: process.env.MYSQL_PORT
      },
      migrations: {
        directory: __dirname + "/db/migrations"
      }
    }
  };