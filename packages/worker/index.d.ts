declare module "index" {
    /**
     * useWorker hook
     *
     * @param {string} scriptPath - Path of the worker
     * @param {object} workerOptions - Additional options to create the worker
     * @param {object} attributes - Event handlers to attach to the worker
     * @return {Worker}
     */
    export default function useWorker(scriptPath: string, workerOptions?: WorkerOptions, attributes?: Object): Worker | undefined;
}
