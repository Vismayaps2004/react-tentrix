import { assert, assertEquals } from "@std/assert";
import { SHAPES, getRandomShapes } from "./shapes.ts";

Deno.test("all shape IDs are unique", () => {
  const ids = SHAPES.map((s) => s.id);
  assertEquals(new Set(ids).size, ids.length);
});

Deno.test("all shapes have at least one cell", () => {
  for (const shape of SHAPES) {
    assert(shape.cells.length >= 1, `${shape.id}: no cells`);
  }
});

Deno.test("all shape cells are within their bounding box", () => {
  for (const shape of SHAPES) {
    for (const [r, c] of shape.cells) {
      assert(r >= 0 && r < shape.rows, `${shape.id}: row ${r} out of bounds (rows=${shape.rows})`);
      assert(c >= 0 && c < shape.cols, `${shape.id}: col ${c} out of bounds (cols=${shape.cols})`);
    }
  }
});

Deno.test("all shapes have positive bounding box dimensions", () => {
  for (const shape of SHAPES) {
    assert(shape.rows >= 1, `${shape.id}: rows < 1`);
    assert(shape.cols >= 1, `${shape.id}: cols < 1`);
  }
});

Deno.test("getRandomShapes returns the requested count", () => {
  assertEquals(getRandomShapes(1).length, 1);
  assertEquals(getRandomShapes(3).length, 3);
  assertEquals(getRandomShapes(0).length, 0);
});

Deno.test("getRandomShapes returns only shapes from the catalogue", () => {
  const validIds = new Set(SHAPES.map((s) => s.id));
  for (const shape of getRandomShapes(20)) {
    assert(validIds.has(shape.id), `Unknown shape ID: ${shape.id}`);
  }
});
