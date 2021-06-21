import { createRouter } from "https://deno.land/x/servest@v1.3.1/mod.ts";

export function apiRoute() {
  const router = createRouter();
  router.get("colors.json", async (req) => {
    await req.sendFile("./data/colors.json");
  });
  router.get("zodiac-signs.json", async (req) => {
    await req.sendFile("./data/zodiac-signs.json");
  });
  return router;
}
