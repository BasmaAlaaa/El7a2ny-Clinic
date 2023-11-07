 const { ObjectID } = require('bson');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const paymentSchema = new Schema({    
    PatientUsername:{
        type: String,
        ref: 'Patient',
        required: true
    },
    Amount:{
        type: Number,
        required: true
    },
    PaidOnDate:{
        type: Date,
        required: true
    },
    ItemPaidForId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    TypeOfPurschase:{
        type: String,
        required: true,
        enum: ["health package", "appointment"]
    },
    PaymentMethod: {
        type: String,
        default: "Wallet",
        enum: ["wallet","Wallet","Credit Card","credit card"]
      },
    Status:{
        type: String,
        default: "pending",
        enum: ["success", "pending" ,"failed", "refunded"]
    }
},{ timestamps: true })

paymentSchema.statics.register = async function (
    PatientUsername,
    Amount,
    PaidOnDate,
    ItemPaidForId,
    TypeOfPurschase,
    Status
  ) {

    // validation 
    if (!PatientUsername ||
        !Amount ||
        !PaidOnDate ||
        !ItemPaidForId ||
        !TypeOfPurschase ||
        !Status) { 
    throw Error('All fields must be filled.');
}
    const payment = await this.create({
        PatientUsername,
        Amount,
        PaidOnDate,
        ItemPaidForId,
        TypeOfPurschase,
        Status
    });
  
    return payment;
  };
  const Payment = mongoose.model('Payment', paymentSchema);
  module.exports = Payment;