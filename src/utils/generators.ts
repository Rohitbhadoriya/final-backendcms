export const generateUHID = (doctorId: string, count: number): string => {
  const clinicCode = 'CL';
  const year = new Date().getFullYear();
  return `${clinicCode}-${year}-${count.toString().padStart(4, '0')}`;
};

export const generateInvoiceNumber = (count: number): string => {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  return `INV-${year}${month}-${count.toString().padStart(4, '0')}`;
};