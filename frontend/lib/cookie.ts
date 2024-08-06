import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import moment from "moment";
import config from "../config/config.json";

// Load environment variables from .env file
dotenv.config();

// Encryption and decryption functions
function encrypt(value: string): string {
  const secretKey: any = config.CRYPTO_KEY;
  return CryptoJS.AES.encrypt(value, secretKey).toString();
}

function decrypt(encryptedValue: string): string {
  const secretKey: any = config.CRYPTO_KEY;
  const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Set Cookie function with encryption
export function setCookie(name: string, value: string): void {
  let expire = moment()
    .add(1, "days")
    .utc()
    .format("ddd, DD MMM YYYY HH:mm:ss [GMT]");

  const encryptedValue: string = encrypt(value);
  document.cookie = `${name}= ${encryptedValue}; expires=${expire}; path=/`;
}

// // Get Cookie function with decryption
export function getCookie(name: string): string | null {
  const cookies: string[] = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie: string = cookies[i].trim();
    // Check if this cookie name is the one we are looking for
    if (cookie.startsWith(name + "=")) {
      // Get the cookie value and decrypt it
      const cookieValue: string = cookie.substring(name.length + 1);
      return decrypt(cookieValue);
    }
  }
  // If cookie not found, return null
  return null;
}
