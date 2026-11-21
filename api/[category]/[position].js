const gifs = require("../../data/gifs.json");
const crypto = require("crypto");

const ROTATION_MINUTES = 1;

function getPairIndex(category, slot, count) {
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
    return res.status(404).send("Category not found or has no GIF pairs");
  }

  const intervalMs = ROTATION_MINUTES * 60 * 1000;
  const timeSlot = Math.floor(Date.now() / intervalMs);
  const index = getPairIndex(category, timeSlot, pairs.length);
  const pair = pairs[index];
  const filename = pair && pair[position];

  if (
    typeof filename !== "string" ||
    !/^[a-zA-Z0-9_-]+\.(gif|png|jpe?g|webp)$/i.test(filename)
  ) {
    return res.status(500).send("Invalid filename in gifs.json");
  }

  const location =
    `/gifs/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`;

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.writeHead(302, { Location: location });
  return res.end();
};
