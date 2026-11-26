// Pre-computes a dotted world map for the Global Reach globe.
// Output: src/data/land-dots.json  → flat [lat, lon, lat, lon, ...] array.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const out = [];
const step = 1.8; // degrees of latitude between rows
for (let lat = -58; lat <= 80; lat += step) {
  const ring = Math.max(1, Math.round((360 / step) * Math.cos((lat * Math.PI) / 180)));
  for (let i = 0; i < ring; i++) {
    const lon = -180 + (360 / ring) * i;
    if (geoContains(land, [lon, lat])) out.push(+lat.toFixed(2), +lon.toFixed(2));
  }
}
writeFileSync(new URL("../src/data/land-dots.json", import.meta.url), JSON.stringify(out));
console.log("land dots:", out.length / 2);
