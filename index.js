const express = require("express");
const multer = require("multer");
const { fromBuffer } = require("pdf2pic");

const app = express();
const upload = multer();

async function convertPdf(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "file is required" });
    }

    const convert = fromBuffer(req.file.buffer, {
      density: 100,
      format: "png",
      width: 800,
      height: 1000,
      responseType: "base64",
    });

    const result = await convert(1);

    return res.json({
      success: true,
      convertedPageCount: 1,
      pageImages: [result.base64],
    });
  } catch (e) {
    console.error("conversion failed", e);
    return res.status(500).json({ error: "conversion failed" });
  }
}

app.get("/", (_req, res) => {
  res.json({ ok: true, service: "pdf-service" });
});

app.post("/convert", upload.single("file"), convertPdf);
app.post("/render-pages", upload.single("file"), convertPdf);

app.listen(3000, () => console.log("PDF service running"));
