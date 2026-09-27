export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    service: "Shresth Products Analyzer API",
    timestamp: new Date().toISOString()
  });
}
