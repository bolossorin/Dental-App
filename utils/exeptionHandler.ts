export const expHandler = (e: any) => {
  const statusCode = e?.response?.status && String(e?.response?.status);
  if (!statusCode || "undefined" === statusCode) {
    return "Network Error";
  }
  if (statusCode[0] === "4") {
    return e.response.data;
  }
  if (statusCode[0] === "5") {
    return "Error! Please try again later";
  }
  return "Unknown error";
};
