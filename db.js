import pkg from 'pg'
const {Pool}=pkg;
import dotenv from 'dotenv'
dotenv.config();

const connectionString=process.env.DB_CONNECTION;

const pool=new Pool({
    connectionString:connectionString,
    ssl:{
        rejectUnauthorized:false // Required by most cloud providers for secure connections
    }
})

export default pool;