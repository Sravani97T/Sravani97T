

// converting number to currency format
export const currencyFormat = (number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(number);
};

// converting currency to number format
export const currencyToNumber = (number) => {
  console.log(String(number).replace(/,/g, ''),'number');
  const formattedNumber = String(number).replace(/,/g, '');
  // removign rupee symbol
  const numberWithoutRupee = formattedNumber.replace('₹', '');
  return parseFloat(numberWithoutRupee);
};
