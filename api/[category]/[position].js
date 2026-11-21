
const gifs = require("../../data/gifs.json");
const fs = require("fs");
const path = require("path");

const ROTATION_MINUTES = 1;

function getPairIndex(slot, count) {
  return slot % count;
}

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const category = String(req.query.category || "").toLowerCase();
  const position = String(req.query.position || "").toLowerCase();

  if (!["side", "bottom"].includes(position)) {
    return res.status(400).send("Position must be side or bottom");
  }

  const pairs = gifs[category];

  if (!Array.isArray(pairs) || pairs.length === 0) {
    return res.status(404).send("Category not found");
  }

  const slot = Math.floor(Date.now() / (ROTATION_MINUTES * 60 * 1000));
  const pair = pairs[getPairIndex(slot, pairs.length)];
  const filename = pair && pair[position];

  if (
    typeof filename !== "string" ||
    !/^[a-zA-Z0-9_-]+\.(gif|png|jpe?g|webp)$/i.test(filename)
  ) {
    return res.status(500).send("Invalid filename");
  }

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

  const contentType = {
    gif: "image/gif",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp"
  }[path.extname(filename).slice(1).toLowerCase()];

  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  return res.status(200).send(fs.readFileSync(filePath));
};
