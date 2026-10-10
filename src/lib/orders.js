// Keeps the same orders array across all routes in Next.js dev mode
const globalForOrders = globalThis;

if (!globalForOrders.__orders) {
    globalForOrders.__orders = [];
}

export const orders = globalForOrders.__orders;