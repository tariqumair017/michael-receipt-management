const express = require("express");
const router = express.Router(); 
const { UPLOAD_S3_IMAGE, generateReceiptNumber } = require("../utlis/helpers"); 
const Receipt = require("../models/receipt");


// render Landing
router.get("/", async (req, res) => {
  res.render("Landing");
});

// render invoice-upload
router.get("/upload", async (req, res) => {
  res.render("InvoiceUpload");
});

// render Add-invoice-details
router.get("/upload/:id", async (req, res) => {
  let receipt = await Receipt.findById(req.params.id);
  res.render("InvoiceDetail", {data: receipt});
});

// Upload Invoice
router.post("/store/receipt", async (req, res) => {
  try { 
    if (req.files !== null && req.files !== undefined && req.files !== "") {
      if (
        req.files.receipt != undefined &&
        req.files.receipt != null &&
        req.files.receipt != ""
      ) {
        const response = await UPLOAD_S3_IMAGE(req.files.receipt);
        const receiptNumber = generateReceiptNumber();
        let newReceipt = await Receipt.create({
          receipt_id: receiptNumber,
          date: req.body.date,
          description: req.body.description,
          invoiceType: req.body.invoiceType,
          receiptImage: response.url,
        }); 
        return res.status(200).json({ success: true, message: "receipt upload success", receipt: newReceipt });
      }
    }

    res.status(404).send({ success: false, message: `receipt not found` });
  } catch (error) {
    res.status(400)
      .send({
        success: false,
        message: `Receipt uploading error: ${error.message}`,
      });
  }
});

// Update Invoice with Details
router.put("/update/receipt/:id", async (req, res) => {
  try {     
    let updatedReceipt = await Receipt.findByIdAndUpdate(req.params.id, { 
      date: req.body.date,
      description: req.body.description,
      invoiceType: req.body.invoiceType, 
    }, { new: true }); 
    return res.status(200).json({ success: true, message: "receipt updated success", receipt: updatedReceipt });
  } catch (error) {
    res.status(400)
      .send({
        success: false,
        message: `Receipt uploading error: ${error.message}`,
      });
  }
});

module.exports = router;
