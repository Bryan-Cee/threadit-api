// import logdna from '@logdna/logger';
// import { NextFunction, Request, Response } from "express";

// const options = {
//     app: "threadit",
//     level: "debug"
// };

// const ingestionKey = process.env.LOGGER_INGESTION_KEY as string;

// // @ts-ignore
// export const logger = logdna.createLogger(ingestionKey, options);

// function loggerMiddleWare(req: Request, res: Response, next: NextFunction) {
//     if (req.body?.operationName === "IntrospectionQuery" || req.url === "/") {
//         next();
//     }

//     const log = `${req.method}:${req.url} ${res.statusCode}`;
//     const body = { ...req.body };

//     if (body?.variables) {
//         delete body.variables
//     }

//     logTrace(log, {
//         body,
//         ip: req.ip
//     });

//     next();
// }

// export function logError(err: any, message: string) {
//     logger.error(message, {
//         indexMeta: true,
//         meta: {
//             message: err.message,
//             err
//         }
//     })
// }

// export function logInfo(err: any, message: string) {
//     logger.info(message, {
//         indexMeta: true,
//         meta: {
//             message: err.message,
//             err
//         }
//     })
// }

// export function logTrace(message: string, info?: any) {
//     logger.trace(message, {
//         indexMeta: true,
//         meta: { message, info }
//     })
// }

// export default loggerMiddleWare;
