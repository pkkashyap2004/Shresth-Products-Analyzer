import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    previous: { type: Number, default: 0 },
    source: { type: String, default: "manual" }
  },
  { timestamps: true }
);

const Metric = mongoose.models.Metric || mongoose.model("Metric", schema);
let cachedUri = null;

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  if (mongoose.connection.readyState === 1 && cachedUri === uri) return;

  await mongoose.connect(uri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 20000,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
  });

  cachedUri = uri;
}

export default async function handler(req, res) {
  try {
    await connectMongo();

    if (req.method === "GET") {
      const metrics = await Metric.find().sort({ createdAt: -1 }).limit(100).lean();
      return res.status(200).json({
        status: "ok",
        count: metrics.length,
        metrics
      });
    }

    if (req.method === "POST") {
      const metric = await Metric.create(req.body);
      return res.status(201).json({ status: "ok", metric });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("MongoDB metrics API error:", error);
    return res.status(500).json({
      status: "error",
      error: error.message
    });
  }
}
