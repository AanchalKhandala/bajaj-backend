const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mime = require("mime-types");
const atob = require("atob");
const cors = require("cors");


const app = express();
app.use(bodyParser.json());
app.use(cors());

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid input" });
  }

  const numbers = data.filter((x) => !isNaN(x));
  const alphabets = data.filter((x) => /^[a-zA-Z]$/.test(x));
  const highestLowercase = alphabets
    .filter((x) => /^[a-z]$/.test(x))
    .sort()
    .pop();

  const primesFound = numbers.some((num) => isPrime(Number(num)));

  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKB = null;

  if (file_b64) {
    try {
        const fileBuffer = Buffer.from(atob(file_b64), "binary");
      fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
      fileMimeType = mime.lookup(fileBuffer) || "application/octet-stream";
      fileValid = true;
    } catch (error) {
      fileValid = false;
    }
  }

  const response = {
    is_success: true,
    user_id: "aanchal_khandala_09012002", 
    email: "aanchalkhandala01@gmail.com",
    roll_number: "0827CS211002",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
    is_prime_found: primesFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  };

  res.json(response);
});

app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
