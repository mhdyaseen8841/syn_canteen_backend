import CryptoJS from "crypto-js";


const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, process.env.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export  { decryptPassword }