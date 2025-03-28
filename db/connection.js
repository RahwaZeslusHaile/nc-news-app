const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || 'development';
console.log(`Loading environment: ${ENV}`);

require('dotenv').config({ path: `${__dirname}/../.env.${ENV}` })

console.log("Loaded PGDATABASE:", process.env.PGDATABASE);
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set")
} else {
    console.log(`Connected to ${process.env.PGDATABASE}`)
}
const config = {};
if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
}
module.exports = new Pool(config);