const COMPLETED_STATUSES = ["Cerrada", "Cancelada"];

const toLocalDateStr = (date) => {
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
};

export const isOverdue = (order, referenceDate = new Date()) => {
    if (!order?.visitDate) return false;
    if (COMPLETED_STATUSES.includes(order.status)) return false;

    const visitDate = new Date(order.visitDate);
    const today = new Date(referenceDate);

    visitDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return visitDate < today;
};

// Set de fechas (YYYY-MM-DD) que tienen al menos una OT vencida
// útil para resaltar el día completo en el calendario
export const getOverdueDatesSet = (orders) => {
    const dates = new Set();

    orders.forEach((order) => {
        if (isOverdue(order)) {
            dates.add(toLocalDateStr(order.visitDate));
        }
    });

    return dates;
};

export const getMonthProgress = (orders) => {
    const total = orders.length;
    const completed = orders.filter((o) =>
        COMPLETED_STATUSES.includes(o.status)
    ).length;
    const overdue = orders.filter((o) => isOverdue(o)).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, pending, overdue, percentage };
};

export { toLocalDateStr };