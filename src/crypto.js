import CryptoJS from 'crypto-js'
import crypKey from "./key.js"
const algorithm = 'aes-192-cbc';

var crypt = {
  secret : crypKey,
};

function encrypt(clear) {
    var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
    cipher = cipher.toString();
    return cipher;
  };
 
function decrypt(cipher){
    var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
    decipher = decipher.toString(CryptoJS.enc.Utf8);
    return decipher;
  };


