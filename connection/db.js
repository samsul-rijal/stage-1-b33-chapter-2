
const {Pool} = require('pg')

const dbPool = new Pool({
    database: 'personal_web_b33',
    port: 5432,
    user: 'postgres',
    password: 'ADMIN'
})

module.exports = dbPool