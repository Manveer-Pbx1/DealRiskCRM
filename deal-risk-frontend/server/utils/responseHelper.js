export const sendSuccess = (res, data, status = 200) => {
  res.status(status).json(data);
};

export const sendError = (res, { status = 500, message, details = null }) => {
  const errorResponse = { error: message };
  if (details) {
    errorResponse.details = details;
  }
  res.status(status).json(errorResponse);
};
