const express = require("express");
const cors = require("cors");
const multer = require("multer");
const validateCSVData = require("./test");
const fs = require("fs");
const path = require("path");

const upload = multer();
const app = express();

const port = 4000;

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000", "http://localhost:80"], // Whitelist the domains you want to allow
};
app.use(cors(corsOptions));
app.use(express.json());

app.get("/test", (req, res) => {
  console.log("Hello");
  res.send("Hello World!");
});

app.post("/upload", upload.single("file"), (req, res) => {
  const { originalname, mimetype, buffer } = req.file;

  const fileContent = buffer.toString("utf8"); // Assuming the file is UTF-8 encoded text
  const result = validateCSVData(fileContent);
  if (result.errors.length > 0) {
    console.error("Validation errors:");
    res.json({ errors: result.errors });
  } else {
    res.json({ data: result.jsonData, file_name: originalname });
  }
});

app.get("/download", async (req, res) => {
  // console.log(req.query.nameFile);
  const rootDir = __dirname;
  const filePath = path.join(rootDir, "uploads", req.query.nameFile);
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
