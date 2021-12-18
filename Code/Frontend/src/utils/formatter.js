
/**
 * Number formatter: add commas to numbers by **thousands**
 * @param {number} number 
 * @returns string
 */
function numberFormatter (number) {
  const numbers = number.toString().split('').reverse()
  const segs = []

  while (numbers.length) segs.push(numbers.splice(0, 3).join(''))

  return segs.join(',').split('').reverse().join('')
}

export { numberFormatter };