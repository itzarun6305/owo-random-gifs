
const gifs = require("../../data/gifs.json");

const ROTATION_MINUTES = 1;

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const category = String(req.query.category || "").toLowerCase();
  const position = String(req.query.position || "").toLowerCase();

  if (!["side", "bottom"].includes(position)) {
    return res.status(400).send("Invalid position");
  }

  const pairs = gifs[category];

  if (!Array.isArray(pairs) || pairs.length === 0) {
    return res.status(404).send("Category not found");
  }

  const slot = Math.floor(
    Date.now() / (ROTATION_MINUTES * 60 * 1000)
  );

  const pair = pairs[slot % pairs.length];
  const filename = pair[position];

  if (
    typeof filename !== "string" ||
    !/^[a-zA-Z0-9_-]+\.(gif|png|jpe?g|webp)$/i.test(filename)
  ) {
    return res.status(500).send("Invalid filename");
  }

  const location =
    `/gifs/${encodeURIComponent(category)}/${encodeURIComponent(filename)}?v=${slot}`;

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.writeHead(302, { Location: location });
  return res.end();
};
