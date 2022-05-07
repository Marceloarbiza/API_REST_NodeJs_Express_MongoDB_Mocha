module.exports = {
  'port': 3000,
  'mongodb': {
    /* marcelo */
    'db_connection': process.env.DB_CONNECTION,
    /*____*/
    'username': process.env.DATABASE_USERNAME,
    'password': process.env.DATABASE_PASSWORD,
    'host': process.env.DATABASE_HOST,
    'port': process.env.DATABASE_PORT,
    'dbname': process.env.DATABASE_DBNAME,
    'address': process.env.DATABASE_HOST + ':' + process.env.DATABASE_PORT
  },
};
