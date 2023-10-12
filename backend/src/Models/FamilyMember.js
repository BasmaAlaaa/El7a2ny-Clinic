const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const Schema = mongoose.Schema;
const validator = require('validator');

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
    }
},
    { timestamps: true });


FamilyMemberSchema.statics.register = async function (
    Name,
    NationalID,
    Age,
    Gender,
    RelationToPatient
) {

    // validation 
    if (
        !Name ||
        !NationalID ||
        !Age ||
        !Gender ||
        !RelationToPatient) {
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
        RelationToPatient
    });

    return FamilyMember;
};

module.exports = mongoose.model('FamilyMember', FamilyMemberSchema);

