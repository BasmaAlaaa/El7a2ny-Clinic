const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const ContractSchema = new Schema(
    { DoctorUsername:{
        type: String,
        ref: 'Doctor',
        required: true
    },
    MarkUp:{
        type: Number,
        required: true
    },
    Status:{
        type: String,
        required: true,
        enum: ['Approved', 'Rejected', 'Pending'],
        default: 'Pending'
    },

});
module.exports= mongoose.model('Contract', ContractSchema);

