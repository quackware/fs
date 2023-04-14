import { FilePath } from "../file-path.ts";
import { assertEquals, assertInstanceOf } from "./deps.ts";

Deno.test("FilePath", async (t) => {
  await t.step("init", () => {
    const fpUrl = new FilePath(new URL("https://quack.software/index.html"));
    assertInstanceOf(fpUrl, FilePath);
    assertEquals(fpUrl.filename, "index.html");

    const fpFile = new FilePath(new URL("file://foo/bar/baz"));
    assertInstanceOf(fpFile, FilePath);
    assertEquals(fpFile.filename, "baz");
  });

  await t.step("relative file path", async () => {
    const fp = new FilePath("./deps.ts");
    assertInstanceOf(fp, FilePath);
    assertEquals(fp.filename, "deps.ts");
    const stat = await Deno.stat(fp.pathname);
    assertEquals(stat.isFile, true);
  });

  await t.step("absolute file path", async () => {
    const fp = new FilePath("/");
    assertInstanceOf(fp, FilePath);
    const stat = await Deno.stat(fp.pathname);
    assertEquals(stat.isDirectory, true);
  });
});
