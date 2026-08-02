import { PrismaClient } from "./app/generated/prisma/client.js";

const p = new PrismaClient({
  datasources: { db: { url: "file:D:/Projects/museo1/prisma/dev.db" } },
});

async function main() {
  const users = await p.user.findMany();
  console.log("DB OK — user count:", users.length);
  console.log("Users:", JSON.stringify(users, null, 2));
}

main()
  .catch((e) => {
    console.error("DB ERROR:", e.message);
    process.exit(1);
  })
  .finally(() => p.$disconnect());
