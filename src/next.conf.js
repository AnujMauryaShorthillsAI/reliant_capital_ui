import dotenv from 'dotenv';

dotenv.config()

console.log(process.env)

module.exports = {
    env: {
        API_URL: process.env.API_URL,
    }
}