// Define the shape of each telecaller object
interface User {
  id: string;
  name: string;
  role: string;
}

// Function to sort telecallers by prefix order
function sortTelecallerList(
  data: User[],
  order: string[] = ["TC", "SE", "SM"]
): User[] {
  return data.sort((a, b) => {
    const prefixA = a.name.split("_")[0];
    const prefixB = b.name.split("_")[0];
    return order.indexOf(prefixA) - order.indexOf(prefixB);
  });
}

export default sortTelecallerList