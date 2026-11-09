---
title: OrbitScope
summary: Starlink, GPS, and the ISS on a 3D globe from New York — plus Cubelight, a WASM ray tracer in the same project.
year: 2026
type: Personal project
order: 3
cover: ./images/orbitscope.webp
coverAlt: OrbitScope’s globe centered on the Americas, ringed with teal Starlink dots and an orange NY marker. A panel on the right searches by name and filters all, Starlink, GPS, and the ISS.
demo: /orbitscope/
demoLabel: Open the live demo
repo: https://github.com/michaelnjoku347/OrbitScope
tags: [Java 21, Spring Boot, Orekit, Cesium, TypeScript, Vite, Rust, WebAssembly]
highlights:
  - 'Java and Orekit turn live CelesTrak orbit data into positions. A Cesium globe draws Starlink, GPS, and the ISS, and the default observer is New York.'
  - 'Clicking a satellite shows its name, altitude, and the next pass above 10° from New York. An ISS check against wheretheiss.at was about 0.2 km.'
  - 'Cubelight, the project’s Rust ray tracer compiled to WebAssembly, also runs in the browser: matte, mirror, and glass cubes with switchable shading systems and film formats.'
  - 'The globe uses Orekit. A simpler array version is faster, but it skips drag, so it stays in the benchmark.'
---

OrbitScope is one project with two surfaces in the same repo: a live satellite globe, and **Cubelight**, a WASM ray tracer.

The playable demo on this site is at [/orbitscope/](/orbitscope/): the Cesium globe with a frozen CelesTrak snapshot (ten thousand–plus satellites), plus [Cubelight](/orbitscope/cubelight/) under the same path. Full source is on [GitHub](https://github.com/michaelnjoku347/OrbitScope).

## What you can do with the globe

- Filter the sky to Starlink, GPS, the ISS, or all of them.
- Search by name or NORAD id.
- Click a satellite for its latitude, longitude, altitude, and (for the ISS in this snapshot) the next few passes over New York.

The screenshot on this page is Starlink only. GPS and the ISS are in the same catalog. The portfolio demo freezes one frame of positions so it can run without the Java API; locally, the API refreshes the catalog every three hours.

## How the globe works

The API is Java 21 and Spring Boot. It downloads two-line element sets from CelesTrak (Starlink, GPS, and the ISS) and refreshes them every three hours. [Orekit](https://www.orekit.org/) propagates those orbits. Positions for the whole catalog go out as parallel arrays, because one object per satellite was about 1.8 MB.

The globe is [Cesium](https://cesium.com/) and TypeScript. Drawing ten thousand `Entity` objects was too slow, so the dots are a `PointPrimitiveCollection`. The map is Cesium’s built-in Natural Earth imagery, so the page does not need a Cesium ion token.

I checked the ISS against [wheretheiss.at](https://wheretheiss.at) at the same timestamp. The difference was about 0.2 km. On this machine, Orekit took 165 ms for a long benchmark on 4 cores. A simpler array version took 4 ms, but it skips drag, so the globe stays on Orekit.

## Cubelight (same project)

Cubelight is OrbitScope’s Rust ray tracer, compiled to WebAssembly. The default scene is three cubes on a checker floor under one lamp: matte, mirror, and glass.

![OrbitScope Cubelight: a Whitted render of three cubes on a checker floor, with system and format controls on the right.](./images/orbitscope-cubelight.webp)

Open it at [/orbitscope/cubelight/](/orbitscope/cubelight/). Drag to orbit, switch Whitted and path tracing, and regrade the film format while samples stack.

## Run it locally

You need Java 21 and Node. From the repo:

```bash
./run.sh api    # http://localhost:8080
./run.sh web    # http://localhost:5173
cd tracer && ./serve.sh   # Cubelight at http://127.0.0.1:8731
```

The first API start downloads Orekit’s data files. CelesTrak returns an empty file if the request has no User-Agent, so the fetcher sends one.
