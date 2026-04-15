export const STATUSES = Object.freeze({
    ORDERED: "ORDERED",
    ARRIVED: "ARRIVED",
    PROCESSED: "PROCESSED"
});

export const STATUSES_VALUES = Object.values(STATUSES);

export const SHIPMENT_TRANSITIONS = {
    ORDERED: ["ARRIVED"],
    ARRIVED: ["PROCESSED"],
    PROCESSED: []
    
}