import { getDb } from "@/shared/db";
import { prefectureVisits } from "@/entities/prefecture-visit";

async function main() {
  await getDb()
    .insert(prefectureVisits)
    .values({
      id: "prefecture-13",
      prefectureCode: 13,
      prefectureName: "東京都",
      visitCount: 12,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: prefectureVisits.prefectureCode,
      set: {
        prefectureName: "東京都",
        visitCount: 12,
        updatedAt: new Date(),
      },
    });

  console.log("Seeded prefecture visit: 東京都 12回");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
