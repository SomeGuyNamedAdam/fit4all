export const handleNumberInputChange = (
  text: string,
  setState: (value: string) => void,
  intLength: number = 3,
  decimalLength: number = 2
) => {
  // Replace commas with dots for consistency
  let normalizedText = text.replace(/,/g, ".");

  // Remove any character that is not a digit or a dot
  normalizedText = normalizedText.replace(/[^0-9.]/g, "");

  // Split the text into integer and decimal parts
  const [integerPart, decimalPart] = normalizedText.split(".");

  // Limit the integer part to the specified length
  const limitedIntegerPart = integerPart.slice(0, intLength);

  // Limit the decimal part to the specified length, if it exists
  const limitedDecimalPart =
    decimalLength > 0 && decimalPart ? decimalPart.slice(0, decimalLength) : "";

  // Reassemble the text, conditionally adding the decimal separator
  let filteredText = limitedIntegerPart;
  if (decimalLength > 0 && normalizedText.includes(".")) {
    filteredText += "." + limitedDecimalPart;
  }

  // Update the state with the filtered text
  setState(filteredText);
};
export const handleInputChange = (
  text: string,
  setState: (value: string) => void,
  maxLength?: number
) => {
  if (maxLength) {
    setState(text.slice(0, maxLength));
  } else {
    setState(text);
  }
};

