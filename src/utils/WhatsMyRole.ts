export interface User {
  _id: string;
  name: string;
  phone: string;
  role: string; // Using string to cover 'admin', 'user', or others
}

export function WhatsMyRole(key: string = 'user'): string | null {
  if (typeof window === 'undefined') {
    // This code is running on the server; safely exit.
    return null;
  }
  try {
    // 1. Retrieve the string value from localStorage
    const userString = localStorage.getItem(key);

    // 2. Handle the case where the key doesn't exist
    if (userString === null) {
      console.log(`[Storage] No data found for key: "${key}"`);
      return null;
    }

    // 3. Safely parse the JSON string into a User object
    const userObject: User = JSON.parse(userString);

    // 4. Check if the object is valid and has the required 'name' field
    if (typeof userObject !== 'object' || !userObject.name) {
      console.error(`[Storage] Parsed data is invalid or missing 'name' for key: "${key}".`);
      return null;
    }

    // 5. Return only the name
    return userObject.role;

  } catch (error) {
    // 6. Handle potential parsing errors (e.g., if the stored string is not valid JSON)
    console.error(`[Storage] Error parsing data for key "${key}":`, error);
    return null;
  }
}