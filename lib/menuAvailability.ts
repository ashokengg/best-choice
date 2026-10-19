import { DEFAULT_AVAILABILITY } from "@/app/config/availability";
import Availability from "@/models/Availability";

export async function getMenuAvailability() {
  const document = await Availability.findOneAndUpdate(
    { key: "menu" },
    { $setOnInsert: { items: DEFAULT_AVAILABILITY } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  const stored = document.items as Map<string, boolean>;
  return Object.fromEntries(
    Object.entries(DEFAULT_AVAILABILITY).map(([slug, defaultValue]) => [
      slug,
      stored.get(slug) ?? defaultValue,
    ]),
  );
}
