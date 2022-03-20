const getDays = (period) => {
  let days;
  switch (period) {
    case "Last week":
      days = 7;
      break;
    case "Last month":
      days = 30;
      break;
    case "Last 3 months":
      days = 90;
      break;
    case "Last 6 months":
      days = 180;
      break;
    case "Last year":
      days = 365;
  }
  return days;
};

export const getPeriod = (period) => {
  const days = getDays(period);
  let now = new Date();
  return new Date(now.setDate(now.getDate() - days));
};
