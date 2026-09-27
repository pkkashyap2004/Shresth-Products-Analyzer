const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const Metric = mongoose.model(
  "Metric",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      value: { type: Number, required: true },
      previous: { type: Number, default: 0 },
      source: { type: String, default: "manual" }
    },
    { timestamps: true }
  )
);

app.get("/", (req, res) => {
  res.json({ name: "Shresth Products Analyzer API", status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "backend" });
});

app.get("/api/metrics", async (req, res) => {
  try {
    const metrics = await Metric.find().sort({ createdAt: -1 }).limit(100);
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/metrics", async (req, res) => {
  try {
    const metric = await Metric.create(req.body);
    res.status(201).json(metric);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

let mongoPromise;
async function connectMongo() {
  if (!process.env.MONGODB_URI) return;
  if (mongoose.connection.readyState === 1) return;
  if (!mongoPromise) {
    mongoPromise = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      mongoPromise = null;
      throw err;
    });
  }
  await mongoPromise;
}

app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    try {
      await connectMongo();
    } catch (error) {
      return res.status(503).json({ error: "Database connection failed" });
    }
  }
  next();
});

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}

module.exports = app;
