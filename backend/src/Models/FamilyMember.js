const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const Schema = mongoose.Schema;
const validator = require('validator');

const Patient = require('../Models/Patient.js');

const FamilyMemberSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    NationalID: {
        type: String,
        required: true,
        unique: true
    },
    Age: {
        type: Number,
        required: true
    },
    Gender: {
        type: String,
        required: true,
        enum: ["Male", "Female","female","male"]
    },
    RelationToPatient: {
        type: String,
        required: true,
        enum: ["Wife", "Husband", "Son", "Daughter","wife", "husband", "son", "daughter"]
    },
    PatientUsername: {      //in case the family member is patient registered in the system
        type: String,
        ref: 'Patient',
        required: false, // Make it not required
    },
},
    { timestamps: true });


FamilyMemberSchema.statics.register = async function (
    Name,
    NationalID,
    Age,
    Gender,
    RelationToPatient,
    PatientUsername
) {

    // validation 
    if (
        !Name ||
        !NationalID ||
        !Age ||
        !Gender ||
        !RelationToPatient ||
        !PatientUsername) {
        throw Error('All fields must be filled.');
    }

    const existsNationalID = await this.findOne({ NationalID });

    if (existsNationalID) {
        throw new Error('NationalID is already taken.');
    }

    const FamilyMember = await this.create({
        Name,
        NationalID,
        Age,
        Gender,
        RelationToPatient,
        PatientUsername
    });

    return FamilyMember;
};

const FamilyMember = mongoose.model('FamilyMember', FamilyMemberSchema);
module.exports = FamilyMember;

