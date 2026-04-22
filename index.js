const express = require("express");
const multer = require("multer");
const { fromBuffer } = require("pdf2pic");

const app = express();
const upload = multer();

app.post("/convert", upload.single("file"), async (req, res) => {
  try {
    const convert = fromBuffer(req.file.buffer, {
      density: 100,
      format: "png",
      width: 800,
      height: 1000
    });

    const result = await convert(1);

    res.json({
      success: true,
      image: result.base64
    });
  } catch (e) {
    res.status(500).json({ error: "conversion failed" });
  }
});

app.listen(3000, () => console.log("PDF service running"));
