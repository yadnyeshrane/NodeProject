const username=require('./appConfig').username;
const password=require('./appConfig').password;
const database=require('./appConfig').database;
module.exports={
 mongoDbUri:` mongodb+srv://${username}:${password}@cluster0.h2iss.mongodb.net/${database}?retryWrites=true&w=majority`,
}