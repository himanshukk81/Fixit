const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`;
const makeBookingId = () => `FXT-${Math.floor(10000 + Math.random() * 89999)}`;
const todayIso = () => new Date().toISOString().slice(0, 10);

export { formatPrice, makeBookingId, todayIso };
