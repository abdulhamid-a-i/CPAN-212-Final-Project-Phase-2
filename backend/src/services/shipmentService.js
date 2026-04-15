import mongoose from "mongoose";
import { shipmentRepository } from '../repositories/shipmentRepository.js'
import { AppError } from "../utils/appError.js";
import { LIMITS } from "../constants/maxSize.js";
import { generateOrderNumber } from "../utils/idGenerator.js";
import { parseCsvBuffer } from "../utils/csv.js";
import { validateShipmentContent, isCSV, validateStatusChange } from "../utils/validators.js";
import { STATUSES } from "../constants/shipmentStatuses.js";

export const shipmentService = {
    listAll(req) {
        return shipmentRepository.findAll(req);
    },
    async getById(shipmentId){
        if (!mongoose.Types.ObjectId.isValid(shipmentId)){
            throw new AppError("Invalid shipment id", 400);
        }

        const shipment = await shipmentRepository.findById(shipmentId)

        if (!shipment){
            throw new AppError("Shipment not found", 404);
        }

        return shipment;
    },

    async create(payload) {

        if(!payload){
            throw new AppError("File cannot be null", 400);
        }
        if (!payload.buffer.length > LIMITS.MAX_CSV_BYTES){
            throw new AppError("File exceeds maximum file size");
        }

        const resultCSV = isCSV(payload.originalname);
        if (!resultCSV){
            throw new AppError("Must be a CSV file",415);
         }

        const records = await parseCsvBuffer(payload.buffer);

        const errors = [];
        let i = 0;
        let created = 0;
        let skipped = 0;
        let contents = [];

        for (const row of records){
            i++
            const result = validateShipmentContent(row);
            if (!result.ok) {
            result.errors.forEach((err) => {
                errors.push({
                row: i,
                field: err.field,
                reason: err.reason
                })
            });
            skipped++;
            continue
            }

            contents.push(row);
            
            created++;
        }

        const shipment = {
            title: generateOrderNumber(),
            contents: contents,
        }

        const createdShipment = await shipmentRepository.create({...shipment})

        return {
            shipment: createdShipment,
            created: created,
            skipped: skipped
        
        };
  
    },

    async updateStatus(shipmentId, payload){
        const existingShipment = await this.getById(shipmentId);

        if (!existingShipment){
            throw new AppError("Shipment not found", 404);
        }
        const { status } = payload;

        const result = validateStatusChange(existingShipment.status, status);

        if(!result.ok){
            throw new AppError(`Invalid status transition`, 400);
        }

        const updatedShipment = await shipmentRepository.updateStatusById(shipmentId, status);

        return updatedShipment;


    },

    async delete(shipmentId){
        const shipment = await this.getById(shipmentId);

        if(!shipment) {
            throw new AppError("Shipment not found", 404);
        }

        if(shipment.status === STATUSES.ARRIVED){
            throw new AppError("Arrived Shipments cannot be deleted", 400)
        }

        return shipmentRepository.delete(shipmentId);
    }
}