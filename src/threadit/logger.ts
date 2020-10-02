
// @ts-ignore
import jsLogger, { ILogger } from "js-logger";

jsLogger.useDefaults();
const logger: ILogger = jsLogger.get("threadit");

export default logger;
