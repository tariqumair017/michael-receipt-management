const s3 = require("../config/S3_config/s3.config");

const UPLOAD_S3_IMAGE = async (file) => { 
  let response = {};
  const s3Client = s3.s3Client;

  const params = s3.uploadParams;
  params.Key = `receipts/${generateUniqueFileName(file.name)}`;
  params.Body = file.data;
  params.ContentType = file.mimetype;
  try {
    let a = await s3Client.upload(params).promise();
    response.status = true;
    response.url = a.Location;
  } catch (err) {
    response.status = false;
    response.error = err;
    console.log("error", err);
  }
  return response;
};

function generateUniqueFileName(originalFileName) {
    // Get current timestamp in milliseconds
    const timestamp = new Date().getTime();
    // Generate a random string of length 5
    const randomString = Math.random().toString(36).substring(2, 7);
    // Concatenate timestamp and random string with the original file name
    return `${timestamp}_${randomString}_${originalFileName}`;
};

function generateReceiptNumber() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  const randomChar = () => characters[Math.floor(Math.random() * characters.length)];
  const randomNum = () => numbers[Math.floor(Math.random() * numbers.length)];

  // Generate format like 'K5-PX3'
  const receiptNumber = `${randomChar()}${randomNum()}-${randomChar()}${randomChar()}${randomNum()}`;
  
  return receiptNumber;
}
  

module.exports = {
  UPLOAD_S3_IMAGE,
  generateReceiptNumber
};
