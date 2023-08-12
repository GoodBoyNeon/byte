/**
 * If provided only lengthOrMin, returns a random integer of length lengthOrMin.
 * If provided both lengthOrMin and max, returns a random integer between
 * lengthOrMin and max (both inclusive)
 *
 * @param {number} lengthOrMin
 * @param {max} max
 * @returns {number | undefined}
 */
export const generateRandomNumber = (
  lengthOrMin?: number,
  max?: number
): number | undefined => {
  const { pow, floor, random } = Math;
  if (lengthOrMin && !max) {
    const min = pow(10, length - 1);
    const max = pow(10, length) - 1;
    return floor(random() * (max - min + 1)) + min;
  }
  if (lengthOrMin && max) {
    return floor(random() * (max - lengthOrMin + 1)) + lengthOrMin;
  }
};
