import mongoose, { Schema } from "mongoose";
import { DEFAULT_AVAILABILITY } from "@/app/config/availability";

const availabilitySchema = new Schema(
  {
    key: { type: String, unique: true, required: true },
    items: {
      type: Map,
      of: Boolean,
      default: () => DEFAULT_AVAILABILITY,
    },
  },
  { timestamps: true },
);

const Availability =
  mongoose.models.Availability || mongoose.model("Availability", availabilitySchema);

export default Availability;
