// src/lib/shippingUtils.ts

/**
 * Calculates shipping cost based on weight and length.
 * Based on the policy defined in Shippingpolicy.tsx and ProductDetails.tsx.
 */
export function calculateShippingCost(
    weightKg: number,
    lengthMm: number,
    isCourier: boolean
): number {
    if (isCourier) {
        // COURIER SHIPPING (Green Sizes)
        // BASE PRICE: 15 € (0-2000mm, Up to 30kgs)
        let cost = 15;

        // Extra Size: +20 € (>= 2000mm)
        if (lengthMm >= 2000) {
            cost += 20;
        }

        // Extra KG: +0.5 €/KG (> 30kgs)
        if (weightKg > 30) {
            const extraKg = weightKg - 30;
            cost += extraKg * 0.5;
        }

        // MAXIMUM: 60 € (Cap)
        return Math.min(cost, 60);
    } else {
        // TRUCK DELIVERY SERVICE (Blue Sizes)
        // MINIMUM PRICE: 60 € (Up to 1000 kgs)
        let cost = 60;

        // Extra 500 kgs: +10 €/500 kgs (> 1000 kgs)
        if (weightKg > 1000) {
            const extraWeight = weightKg - 1000;
            const extra500kgUnits = Math.ceil(extraWeight / 500);
            cost += extra500kgUnits * 10;
        }

        return cost;
    }
}
