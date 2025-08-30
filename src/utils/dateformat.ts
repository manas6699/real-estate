// utils/dateFormat.ts (or inline inside your component)
export const formatDateToDDMMYYYY = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`; // ✅ convert to DD-MM-YYYY
};
