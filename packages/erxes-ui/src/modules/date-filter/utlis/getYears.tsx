export const getYearsArray = (
  startYearOffset: number,
  endYearOffset: number
) => {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - startYearOffset;
  const endYear = currentYear + endYearOffset;
  console.log(startYear, endYear);
  const yearsArray: number[] = [];
  for (let year = startYear; year <= endYear; year++) {
    yearsArray.push(year);
  }
  console.log(yearsArray);
  return yearsArray;
};
