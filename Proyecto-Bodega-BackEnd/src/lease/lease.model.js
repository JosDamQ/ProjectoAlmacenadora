const mongoose = require ('mongoose');

const leaseSchema = mongoose.Schema({
    storage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month:Number,
    additionalServices: [
        {
            service:{
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'AdditionalServices'
            }
        }
    ],
    total: Number,
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    }
}, 
    {
        versionKey: false,
    }
);

module.exports=mongoose.model('lease', leaseSchema);