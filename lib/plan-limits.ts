
export const PLAN_LIMITS = {
    FREE: {
        clients: 10,
        products: 10,
        services: 10,
        orders: 50, // Total limit
        marketplace: 5,
    },
    PRO: {
        clients: 200,
        products: 50,
        services: 50,
        orders: 1000, // Monthly limit
        marketplace: 50,
    },
    ENTERPRISE: {
        clients: Infinity,
        products: Infinity,
        services: Infinity,
        orders: Infinity,
        marketplace: Infinity,
    },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string) {
    return PLAN_LIMITS[plan as PlanType] || PLAN_LIMITS.FREE;
}
