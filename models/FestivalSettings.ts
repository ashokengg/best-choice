import mongoose, { Schema } from "mongoose";

const festivalSettingsSchema = new Schema(
  {
    key: { type: String, unique: true, required: true },
    makarSankrantiAnimationEnabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const FestivalSettings =
  mongoose.models.FestivalSettings || mongoose.model("FestivalSettings", festivalSettingsSchema);

export default FestivalSettings;
