const crypto = require("crypto");

function generateUUID() {
  const randomBytes = crypto.randomBytes(10); // 10 bytes to generate a 19-digit number
  const hexString = randomBytes.toString("hex");
  return BigInt("0x" + hexString)
    .toString()
    .slice(0, 19);
}

module.exports = generateUUID;
