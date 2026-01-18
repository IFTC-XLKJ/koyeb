const crypto = require('crypto');
const fs = require('fs');

function decryptFile(inputFilePath, outputFilePath, password) {
  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(password, 'salt', 32);
  const fileBuffer = fs.readFileSync(inputFilePath);
  const iv = fileBuffer.slice(0, 16);
  const encryptedData = fileBuffer.slice(16);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedData);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  fs.writeFileSync(outputFilePath, decrypted);
}

// 使用示例
// decryptFile('encrypted.enc', 'decrypted.txt', 'mySecretPassword');
module.exports = decryptFile;