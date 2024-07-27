const mongoose=require('mongoose')
const bookingschema=mongoose.Schema({
    room:{
        type:String,
        require:true
    },
    roomid:{
        type:String,
        require:true
    },
    userid:{
        type:String,
        require:true
    },
    fromDate:{
        type:String,
        require:true
    },
    toDate:{
        type:String,
        require:true
    },
    totalAmount:{
        type:String,
        require:true
    },
    totalDays:{
        type:String,
        require:true
    },
    transactionid:{
        type:String,
        require:true
    },
    status:{
        type:String,
        require:true,
        default:'booked'
    }
},
{
    timestamps:true
})

const bookingmodel= mongoose.model('bookings',bookingschema)

module.exports=bookingmodel