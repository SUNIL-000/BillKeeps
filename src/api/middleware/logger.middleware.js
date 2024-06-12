exports.logger = (req, res, next) => {
  const { url, httpVersion, headers, method } = req;

  res.on("finish", () => {
    const { statusCode, statusMessage } = res;

    const greenColor = "\x1b[32m";
    const redColor = "\x1b[31m";
    const resetCode = "\x1b[0m";

    const logColor = statusCode.toString().startsWith("2")
      ? `${greenColor}`
      : `${redColor}`;

    console.log(
      `${greenColor}INFO:${resetCode}    ${headers.host} - "${method} ${url} HTTP/${httpVersion}" ${logColor}${statusCode} ${statusMessage}${resetCode}`
    );
  });

  next();
};
