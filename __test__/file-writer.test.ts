import { FileWriter } from "../file-writer.ts";
import { assert, assertEquals } from "./deps.ts";

Deno.test("FileWriter", async (t) => {
  await t.step("withTempFile", async () => {
    const filepath = await FileWriter.withTempFile(async (file) => {
      const statted = await file.stat();
      assertEquals(statted.isFile, true);

      file.write(new TextEncoder().encode("Hello World"));
    }, { suffix: ".foobar" });

    assert(filepath.endsWith(".foobar"));

    const stattedTwo = await Deno.stat(filepath);
    assertEquals(stattedTwo.isFile, true);
    const data = await Deno.readTextFile(filepath);
    assertEquals(data, "Hello World");

    await Deno.remove(filepath);
  });
});
