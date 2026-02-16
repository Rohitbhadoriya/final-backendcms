/**
 * Generate unique UHID with random characters
 * Format: CL-YYYY-XXXX (where XXXX is random alphanumeric)
 */
export const generateUHID = (): string => {
  const clinicCode = 'CL';
  const year = new Date().getFullYear();
  
  // Generate 4 random uppercase alphanumeric characters
  const randomChars = Math.random()
    .toString(36) // Convert to base36 string (0-9, a-z)
    .substring(2, 6) // Take 4 characters
    .toUpperCase(); // Convert to uppercase
  
  return `${clinicCode}-${year}-${randomChars}`;
};

export const generateInvoiceNumber = (count: number): string => {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  return `INV-${year}${month}-${count.toString().padStart(4, '0')}`;
};