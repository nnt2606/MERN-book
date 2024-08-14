

export const formatUtcDate = (utcDateString) => {
  // Parse the UTC date string into a Date object
  const date = new Date(utcDateString);

  // Adjust the hours to GMT+7
  const offset = 7; // Offset for GMT+7
  const adjustedHours = date.getUTCHours() + offset;
  
  // Handle day and month changes due to hour adjustment
  if (adjustedHours >= 24) {
    date.setUTCDate(date.getUTCDate() + 1); // Move to the next day
    date.setUTCHours(adjustedHours - 24); // Set the correct hour
  } else if (adjustedHours < 0) {
    date.setUTCDate(date.getUTCDate() - 1); // Move to the previous day
    date.setUTCHours(24 + adjustedHours); // Set the correct hour
  } else {
    date.setUTCHours(adjustedHours); // Set the correct hour
  }

  // Extract the date components
  const day = ('0' + date.getUTCDate()).slice(-2);
  const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
  const year = date.getUTCFullYear();
  const hours = ('0' + date.getUTCHours()).slice(-2);
  const minutes = ('0' + date.getUTCMinutes()).slice(-2);

  // Format the date string
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;

  return formattedDate;
}


export const formatNumber = (number) =>{
  return new Intl.NumberFormat('de-DE').format(number);
}

export const capitalizeFirstLetter = (string)=> {
  return string.charAt(0).toUpperCase() + string.slice(1);
}