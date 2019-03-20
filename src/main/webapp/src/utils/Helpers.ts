export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + year;
};

export const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);

  const monthNames = [
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
    'Dec'
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return (
    date.getDate() +
    ' ' +
    monthNames[monthIndex] +
    ' ' +
    year +
    ' - ' +
    date.getHours() +
    ':' +
    date.getMinutes()
  );
};
