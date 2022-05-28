export class RouteError extends Error {
    // an error of this class will be thrown if any error catched on the routes
    constructor(message: string, public statusCode: number) {
        console.log(message);
        super(message);
        Object.setPrototypeOf(this, RouteError.prototype);
    }
}