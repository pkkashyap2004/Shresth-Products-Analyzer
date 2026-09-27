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

async function connectMongo() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

export default async function handler(req, res) {
  try {
    await connectMongo();

    if (req.method === "GET") {
      const metrics = await Metric.find().sort({ createdAt: -1 }).limit(100);
      return res.status(200).json(metrics);
    }

    if (req.method === "POST") {
      const metric = await Metric.create(req.body);
      return res.status(201).json(metric);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
