import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Scheme } from "../models/Scheme.js";
import { schemesSeed } from "./schemes.seed.js";

async function run() {
  console.log("🌱 Starting scheme seed...\n");
  await connectDB();

  let created = 0;
  let updated = 0;

  for (const data of schemesSeed) {
    const existing = await Scheme.findOne({ schemeId: data.schemeId });
    if (existing) {
      await Scheme.updateOne({ schemeId: data.schemeId }, { $set: data });
      updated++;
      console.log(`♻️  Updated: ${data.schemeId} — ${data.name}`);
    } else {
      await Scheme.create(data);
      created++;
      console.log(`✅ Created: ${data.schemeId} — ${data.name}`);
    }
  }

  console.log(`\n🎉 Done. Created: ${created}, Updated: ${updated}, Total: ${schemesSeed.length}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});