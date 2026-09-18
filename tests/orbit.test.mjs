import assert from "node:assert/strict";
import test from "node:test";
import { getOrbitCardWidth, getOrbitPosition } from "../dist/tests/orbit.js";

test("1–12 works fit the ellipse without overlapping, including active scale", () => {
  for (const [viewportWidth, viewportHeight] of [[1100, 600], [1280, 600], [1280, 720], [1440, 900], [2560, 1440]]) {
    for (let total = 1; total <= 12; total++) {
      const fieldWidth = total > 8 ? viewportWidth * 0.62 : Math.min(viewportWidth * 0.48, 1040);
      const fieldHeight = viewportHeight - Math.max(110, viewportHeight * 0.1) - 40;
      const width = getOrbitCardWidth(total, fieldWidth, fieldHeight) * 1.08;
      const height = width / 1.6 + (total >= 6 ? 0 : 80);
      const points = Array.from({ length: total }, (_, index) => {
        const [x, y] = getOrbitPosition(index, total);
        return [x * fieldWidth / 100, y * fieldHeight / 100];
      });
      const context = `${viewportWidth}×${viewportHeight}, ${total} works`;
      assert.ok(width > 0, context);
      points.forEach(([x, y], index) => {
        assert.ok(x - width / 2 >= 19.9 && x + width / 2 <= fieldWidth - 19.9, context);
        assert.ok(y - height / 2 >= -0.1 && y + height / 2 <= fieldHeight + 40.1, context);
        points.slice(index + 1).forEach(([otherX, otherY]) => {
          assert.ok(Math.abs(x - otherX) >= width + 11.9 || Math.abs(y - otherY) >= height + 11.9, context);
        });
      });
    }
  }
});
