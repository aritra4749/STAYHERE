const mongoose = require("mongoose");

var mongoURL='mongodb+srv://aritrasaha333:EDOPy7QsQFaJ1Tfj@cluster0.hxqwzrx.mongodb.net/STAYHERE'

mongoose.connect(mongoURL , {useUnifiedTopology :true ,useNewUrlParser:true})

var connection=mongoose.connection

connection.on('error',()=>{
    console.log('MongoDB Connection failed')
})

connection.on('connected',()=>{
    console.log('MongoDB Connection Successful')
})

module.exports=mongoose