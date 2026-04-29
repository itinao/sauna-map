import { getDb } from "@/shared/db";
import { prefectureVisits } from "@/entities/prefecture-visit";

const DEMO_USER_ID = "demo-user";

async function main() {
  await getDb()
    .insert(prefectureVisits)
    .values({
      id: `${DEMO_USER_ID}-prefecture-13`,
      userId: DEMO_USER_ID,
      prefectureCode: 13,
      prefectureName: "東京都",
      visitCount: 12,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [prefectureVisits.userId, prefectureVisits.prefectureCode],
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
