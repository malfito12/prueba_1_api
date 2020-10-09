var connect = require('./connect');

var users ={
    name: String,
    email: String,
    password : String,
    address: String
}

const USER = connect.model('User', users);
//modele.exports=USER
module.exports={USER, keys:["email","password"]};