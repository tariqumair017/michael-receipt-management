const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
    {
        receipt_id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        date: {
            type: Date
        },
        description: {
            type: String
        },
        invoiceType: {
            type: String
        },
        receiptImage: {
            type: String,    
            required: true
        },
    },
    {
        timestamps: true
    }
);

const Receipt = mongoose.model("receipt", receiptSchema);
 
module.exports = Receipt; 