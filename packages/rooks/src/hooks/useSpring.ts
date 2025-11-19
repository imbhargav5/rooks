import { useState, useEffect, useRef } from "react";
import { useRaf } from "./useRaf";

/**
 * Spring configuration options
 */
interface SpringConfig {
    stiffness?: number;
    damping?: number;
    mass?: number;
    precision?: number;
}

/**
 * useSpring hook
 *
 * @param targetValue The target value to animate to
 * @param config Spring configuration
 * @returns The current value of the spring animation
 * @see https://rooks.vercel.app/docs/hooks/useSpring
 */
function useSpring(
    targetValue: number,
    config: SpringConfig = {}
): number {
    const {
        stiffness = 170,
        damping = 26,
        mass = 1,
        precision = 0.01,
    } = config;

    const [value, setValue] = useState(targetValue);
    const velocityRef = useRef(0);
    const valueRef = useRef(targetValue);
    const targetRef = useRef(targetValue);

    useEffect(() => {
        targetRef.current = targetValue;
    }, [targetValue]);

    useRaf(() => {
        const distance = targetRef.current - valueRef.current;
        const force = distance * stiffness;
        const acceleration = force / mass;
        const friction = -velocityRef.current * damping;

        // Apply forces
        velocityRef.current += (acceleration + friction) * (1 / 60); // Assuming 60fps for simplicity in this basic implementation
        valueRef.current += velocityRef.current * (1 / 60);

        setValue(valueRef.current);

        // Stop if we are close enough and moving slowly
        if (
            Math.abs(distance) < precision &&
            Math.abs(velocityRef.current) < precision
        ) {
            // Snap to target
            if (valueRef.current !== targetRef.current) {
                valueRef.current = targetRef.current;
                setValue(targetRef.current);
            }
            return false; // Stop animation
        }

        return true; // Continue animation
    }, true);

    return value;
}

export { useSpring };
