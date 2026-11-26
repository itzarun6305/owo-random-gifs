
const gifs = require("../../../data/gifs.json");
const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const category = String(req.query.category || "").toLowerCase();
  const position = String(req.query.position || "").toLowerCase();
  const ext = String(req.query.ext || "").toLowerCase();

  const allowedExtensions = ["gif", "png", "jpg", "jpeg", "webp"];

  if (!["side", "bottom"].includes(position)) {
    return res.status(400).send("Invalid position");
  }

  if (!allowedExtensions.includes(ext)) {
    return res.status(400).send("Invalid image format");
  }

  const images = gifs[category]?.[position];

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(404).send("No images found");
  }

  const matchingImages = images.filter(filename =>
    typeof filename === "string" &&
    path.extname(filename).slice(1).toLowerCase() === ext
  );

  if (matchingImages.length === 0) {
    return res.status(404).send("No images found for this format");
  }

  const filename = matchingImages[
    Math.floor(Math.random() * matchingImages.length)
  ];

  const filePath = path.join(
    process.cwd(),
    "public",
    "gifs",
    category,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Image not found");
  }

  const contentTypes = {
    gif: "image/gif",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp"
  };

  res.setHeader("Content-Type", contentTypes[ext]);
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  return res.send(fs.readFileSync(filePath));
};
