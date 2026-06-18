const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("./r2");
const crypto = require("crypto");

async function uploadToR2(fileBuffer, mimeType, studentName) {
  const safeName = studentName
    .trim()
    .replace(/\s+/g, "_")
    .toUpperCase();

  const key = `tc/${safeName}_${Date.now()}_${crypto.randomUUID()}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    })
  );

  return key;
}

module.exports = uploadToR2;