

export const errorResponse = (msg) => {
  const response = {
    errors: [
      {
        msg,
      },
    ],
  };

  return response;
};

export const successResponse = (message) => {
  const response = {
    message,
  };

  return response;
};

