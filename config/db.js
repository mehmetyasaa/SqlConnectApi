const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'reallyStrongPwd123',
    server: 'localhost',
    database: 'VespaIMT',
    port: 1433,
    options: {
        encrypt: false,
        enableArithAbort: true
    }
};

const poolPromise = new sql.ConnectionPool(config).connect().then(pool => {
    console.log('Connected to MSSQL');
    return pool;
}).catch(err => {
    console.error('Database connection failed:', err);
    return null;
});

module.exports = {
    sql, poolPromise
};
