import { betterAuth } from 'better-auth'
import pool from './db.js'
import dotenv from 'dotenv'
dotenv.config()
const auth=betterAuth({
    database:pool,
    secret:process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    emailAndPassword:{
        enabled:true,
    },
})

export default auth