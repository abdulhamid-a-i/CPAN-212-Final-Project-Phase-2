import { SHIPMENT_TRANSITIONS } from "../constants/shipmentStatuses.js";

export function validateShipmentContent(row) {
    const errors = [];

    // ISBN validation
    if (!row.isbn || typeof row.isbn !== "string" || row.isbn.trim().length === 0) {
        errors.push({ field: "isbn", reason: "ISBN is required" });
    }

    // Title validation
    if (!row.title || row.title.trim().length < 5) {
        errors.push({ field: "title", reason: "Must be at least 5 characters" });
    }

    // Quantity validation
    const quantity = Number(row.quantity);
    if (row.quantity === undefined || row.quantity === null || isNaN(quantity)) {
        errors.push({ field: "quantity", reason: "Must be a valid number" });
    } else if (quantity < 0) {
        errors.push({ field: "quantity", reason: "Cannot be negative" });
    }

    return {
        ok: errors.length === 0,
        errors,
        value: {
            isbn: row.isbn?.trim(),
            title: row.title?.trim(),
            quantity: quantity
        }
    };
}

export function isCSV(filename) {
    return typeof filename === "string" && /\.csv$/i.test(filename.trim());
}


export function validateStatusChange(current, next){
    const transitions = SHIPMENT_TRANSITIONS;
    if (!transitions[current].includes(next)) {
        return {ok: false, errors: "Invalid status transistion"}
    }
    return {ok: true, next};
}