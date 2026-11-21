
const gifs = require("../../data/gifs.json");

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

  const images = gifs[category]?.[position];

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(404).send("No images found");
  }

  const filename = images[Math.floor(Math.random() * images.length)];

  if (
    typeof filename !== "string" ||
    !/^[a-zA-Z0-9_-]+\.(gif|png|jpe?g|webp)$/i.test(filename)
  ) {
    return res.status(500).send("Invalid filename");
  }

  const location =
    `/gifs/${encodeURIComponent(category)}/${encodeURIComponent(filename)}` +
    `?turns=${encodeURIComponent(req.query.turns || "")}` +
    `&streak=${encodeURIComponent(req.query.streak || "")}`;

  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");

  res.writeHead(302, { Location: location });
  return res.end();
};
