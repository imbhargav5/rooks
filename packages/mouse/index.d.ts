declare module "index" {
    interface MouseData {
        x: number | null;
        y: number | null;
        screenX: number | null;
        screenY: number | null;
        pageX: number | null;
        pageY: number | null;
        clientX: number | null;
        clientY: number | null;
        movementX: number | null;
        movementY: number | null;
        offsetX: number | null;
        offsetY: number | null;
    }
    /**
     * useMouse hook
     *
     * Retrieves current mouse position and information about the position like
     * screenX, pageX, clientX, movementX, offsetX
     */
    export default function useMouse(): MouseData;
}
