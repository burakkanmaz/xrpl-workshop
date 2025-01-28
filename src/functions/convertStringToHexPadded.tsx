export const convertStringToHexPadded = (str: string): string => {
  // Convert string to hexadecimal
  let hex: string = "";
  for (let i = 0; i < str.length; i++) {
    const hexChar: string = str.charCodeAt(i).toString(16);
    hex += hexChar;
  }

  // Pad with zeros to ensure it's 40 characters long
  const paddedHex: string = hex.padEnd(40, "0");
  return paddedHex.toUpperCase(); // Typically, hex is handled in uppercase
}