const express = require("express");
const app=express();
const dbConfig=require('./db')
const roomRoute=require('./routes/roomsRoute')
const userRoute=require('./routes/usersRoute')
const bookingsRoute=require('./routes/bookingsRoute')
app.use(express.json())
app.use('/api/rooms',roomRoute)
app.use('/api/users',userRoute)
app.use('/api/booking',bookingsRoute)
const port=process.env.PORT || 5000;
app.listen(port, ()=>console.log(`Server running on port $(port)`));