import { Shipment } from "../models/Shipment.js";
import { STATUSES } from "../constants/shipmentStatuses.js";
import { bookRepository } from "./bookRepository.js";
import { Book } from "../models/Book.js";
export const shipmentRepository = {
    async findAll(req){
            const { status, q} = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filter = {};
    
            if (genre) filter.genre = genre;
    
            let query;
            if (q) {
                query = await Shipment.find({
                    ...filter,
                    $text: { $search: q}
                })
                .skip((page - 1) * limit)
                .limit(limit)
            } else {
                query = await Shipment.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
            }
            const totalShipments = await Shipment.countDocuments();
            return ({
                page,
                limit,
                totalShipments,
                totalPages: Math.ceil(totalShipments / limit),
                shipments: query
            });
    
        },
        findById(id){
            return Shipment.findById(id);
        },
        updateById(id, payload){
            return Shipment.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            });
        },
        async updateStatusById(id, status){
                const existingShipment = await Shipment.findById(id);
                
                existingShipment.status = status;
                let skipped = 0;
                let updated = 0;
                let i = 0;


                if (status == STATUSES.PROCESSED) {
                    const contents = existingShipment.contents;
                    for (const book of contents){
                        i++
                        try{
                            const currBook = await Book.findOne({isbn: book.isbn});
                            let currQuantity = currBook.quantity;
                            console.log("Curr Qty: "+ currQuantity)
                            currQuantity += book.quantity;
                            console.log("Curr Qty after addition: "+ currQuantity);
                            currBook.quantity = currQuantity;
                            await currBook.save();
                            console.log("Book qty after save: " + currBook.quantity);
                            updated++;

                        } catch(error){
                            skipped++;
                        }
                    }
                }
        
                await existingShipment.save();
        
                const updatedShipment = existingShipment;
        
                return {
                    shipment: updatedShipment,
                    updated: updated,
                    skipped: skipped
                };
            },
        
            create(payload){
                return Shipment.create(payload).then((created) =>
                    Shipment.findById(created._id));
            },

            delete(id){
                return Shipment.findByIdAndDelete(id);
            }
}