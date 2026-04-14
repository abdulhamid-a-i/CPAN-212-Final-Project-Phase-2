import mongoose from "mongoose";
import { STATUSES_VALUES } from "../constants/shipmentStatuses.js";

const shipmentBookSchema = new mongoose.Schema(
    {
        isbn: {type: String, required: true, trim: true, unique: true},
        title: { type: String, required: true, trim: true, minlength: 5},
        quantity: {
            type: Number,
            min:0,
            required: true
        },

    },
    {timestamps: true,
        _id: false
    },
);

const shipmentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true},
    contents: {
        type: [shipmentBookSchema],
        required: true
    },
    status: {
        type: String,
        enum: STATUSES_VALUES,
        default: "ORDERED",
        required: true
    },
}, {timestamps: true});

shipmentSchema.index({ "contents.title": "text", status: 1})

export const Shipment = mongoose.model("Shipment", shipmentSchema);