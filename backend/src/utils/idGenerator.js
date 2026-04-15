function randomSegment(length = 6) {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase();
}

export function generateCustomerNumber() {
  return `CUST-${Date.now()}-${randomSegment(4)}`;
}

export function generateEmployeeNumber() {
  return `EMP-${Date.now()}-${randomSegment(4)}`;
}

export function generateOrderNumber() {
  return `ORDER-${Date.now()}-${randomSegment(4)}`;
}