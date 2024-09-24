export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const getDate = (date) => {
  const months = [
    '#',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  date = date.slice(0, 10).split('-');
  return date[2] + ' ' + months[Number(date[1])] + ' ' + date[0];
};
