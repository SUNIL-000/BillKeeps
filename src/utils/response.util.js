const errorResponse = (msg) => {
  const response = {
    errors: [
      {
        msg,
      },
    ],
  };

  return response;
};

const successResponse = (message) => {
  const response = {
    message,
  };

  return response;
};

module.exports = { errorResponse, successResponse };
