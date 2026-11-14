import mongoose, { Schema } from "mongoose";
import { DEFAULT_SPECIAL_ITEMS } from "@/app/config/specialItems";

const specialItemsSchema = new Schema(
  {
    key: { type: String, unique: true, required: true },
    items: {
      type: [String],
      default: () => DEFAULT_SPECIAL_ITEMS,
    },
  },
  { timestamps: true },
);

const SpecialItems =
  mongoose.models.SpecialItems || mongoose.model("SpecialItems", specialItemsSchema);

export default SpecialItems;
