const mongoose = require('mongoose')

mongoose.connect('mongodb://172.19.0.2:27017/crud',{
    useNewUrlParser:true,
    useUnifiedTopology:true})

module.exports=mongoose;