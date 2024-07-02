import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for GivenMoney subdocument
const givenMoneySchema = new Schema({
    no: { type: Number, required: true },
    money: { type: Number, required: true }
}, { _id: false });

// Schema for TakenMoney subdocument
const takenMoneySchema = new Schema({
    no: { type: Number, required: true },
    money: { type: Number, required: true },
    interest: { type: Number, required: true }
}, { _id: false });

// Schema for ExtraMoney subdocument
const extraMoneySchema = new Schema({
    money: { type: Number, required: true },
    note: { type: String, required: true }
}, { _id: false });

// Main schema
const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email:{
        type:String,
        required:true
    },
    password: { type: String, required: true },
    givenMoney: [givenMoneySchema],
    takenMoney: [takenMoneySchema],
    finalMoney: { type: Number, default: 0 },
    extraMoney: [extraMoneySchema]
});

// Create the model
export const User=mongoose.models?.User || mongoose.model('User',userSchema);