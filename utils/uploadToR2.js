const { PutObjectCommand } = require("@aws-sdk/client-s3");
const r2 = require("./r2");
const crypto = require("crypto");

async function uploadToR2(fileBuffer, mimeType) {
    const key = `tc/${crypto.randomUUID()}`;

    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType,
        })
    );

    return key; // store this in MongoDB
}

module.exports = uploadToR2;