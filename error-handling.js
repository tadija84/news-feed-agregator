const winston = require("winston");
require("express-async-errors");

module.exports = function () {
  const logConfiguration = {
    transports: [
      new winston.transports.Console({
        level: "warn",
      }),
      new winston.transports.File({
        level: "error",
        // Create the log directory if it does not exist
        filename: "logs/example.log",
      }),
    ],
  };

  const logger = winston.createLogger(logConfiguration);

  logger.handleExeptions(
    new winston.transports.File({ filename: "logs/uncaughtExeptions.log" })
  );
  process.on("uncaughtRejection", (ex) => {
    console.log("loging an uncaught exeption");
    throw ex;
  });
  logger.add(new winston.transports.File(), { filename: "logs/errorsloging.log" });
};

// process.on('unhandledRejection',(ex)=>{
//   console.log("loging an unhandled rejection");
//   winston.error(ex.message,ex);
//   process.exit(1)
// })
