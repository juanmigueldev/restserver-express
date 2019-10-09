require('dotenv').config()


//==========================
// PORT 
//==========================
process.env.PORT = process.env.PORT || 3000


//==========================
// ENVIRONMENT 
//==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


//==========================
// DATABASE 
//==========================
let databaseUrl;

if(process.env.NODE_ENV === 'dev')
    databaseUrl = "mongodb://localhost:27017/coffee"
else
    databaseUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-itb8s.mongodb.net/coffee`

process.env.dbUrl = databaseUrl


//==========================
// TOKEN EXPIRED TIME 
//==========================
process.env.TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION


//==========================
// SEED SIGNATURE 
//==========================
process.env.TOKEN_SEED_SIGNATURE = process.env.TOKEN_SEED_SIGNATURE


//==========================
// GOOGLE CLIENT ID 
//==========================
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID