const crypto = require('crypto');
const fs = require('fs');
function encryptFile(inputFilePath, outputFilePath, password) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(password, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    const input = fs.createReadStream(inputFilePath);
    const output = fs.createWriteStream(outputFilePath);
    output.write(iv);
    input.pipe(cipher).pipe(output);
}

// 使用示例
// encryptFile('plain.txt', 'encrypted.enc', 'mySecretPassword');
module.exports = encryptFile;