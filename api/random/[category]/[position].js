
const gifs = require("../../../data/gifs.json");
const fs = require("fs");
const path = require("path");

module.exports = function handler(req, res) {
  const category = String(req.query.category || "").toLowerCase();
  const position = String(req.query.position || "").toLowerCase();

  if (position !== "side") {
    return res.status(400).send("Invalid position");
  }

  const images = gifs[category]?.[position];

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(404).send("No GIFs found");
  }

  const gifImages = images.filter(
    filename => typeof filename === "string" &&
      filename.toLowerCase().endsWith(".gif")
  );

  if (gifImages.length === 0) {
    return res.status(404).send("No GIF files found");
  }

  const filename = gifImages[
    Math.floor(Math.random() * gifImages.length)
  ];

  const filePath = path.join(
    process.cwd(),
    "public",
    "gifs",
    category,
    filename
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("GIF not found");
  }

  res.setHeader("Content-Type", "image/gif");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  return res.send(fs.readFileSync(filePath));
};
