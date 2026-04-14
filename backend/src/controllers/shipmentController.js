import { shipmentService } from "../services/shipmentService.js";
import { successResponse } from "../utils/apiResponse.js";

export const shipmentController = {
    async listShipments(req, res, next) {
        
        try {

            const data = await shipmentService.listAll(req);
            
            return successResponse(res, data, "Shipments loaded");
        } catch (error){
            next(error);
        }
    },

    async getShipmentById(req, res, next){
        try {
            const data = await shipmentService.getById(req.params.shipmentId);
            return successResponse(res, data, "Shipment loaded");
        } catch (error) {
            next(error);
        }
    },

    async updateShipmentStatus(req, res, next){
        try {
            const data = await shipmentService.updateStatus(req.params.shipmentId, req.body);

            return successResponse(res, data, "Shipment Status updated");
        } catch (error) {
            next(error);
        }
    },

    async createShipment(req, res, next){
        try {
            const data = await shipmentService.create(req.file);

            return successResponse(res, data, "Shipment created", 201);
        } catch (error){
            next(error);
        }
    },
        async deleteShipment(req, res, next){
            try{
                await shipmentService.delete(req.params.shipmentId); 
                return successResponse(res, null, "Shipment deleted");
            } catch (error){
                next(error);
            }
        }
};