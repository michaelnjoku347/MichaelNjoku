---
title: OrbitScope
summary: Starlink, GPS, and the ISS on a 3D globe, watched from New York.
year: 2026
type: Personal project
order: 2
cover: ./images/orbitscope.webp
coverAlt: OrbitScope’s globe centered on the Americas, ringed with teal Starlink dots and an orange NY marker. A panel on the right searches by name and filters all, Starlink, GPS, and the ISS.
repo: https://github.com/michaelnjoku347/OrbitScope
tags: [Java 21, Spring Boot, Orekit, Cesium, TypeScript, Vite]
highlights:
  - Java and Orekit turn live CelesTrak orbit data into positions. A Cesium globe draws Starlink, GPS, and the ISS, and the default observer is New York.
  - Clicking a satellite shows its name, altitude, and the next pass above 10° from New York. An ISS check against wheretheiss.at was about 0.2 km.
  - The globe uses Orekit. A simpler array version is faster, but it skips drag, so it stays in the benchmark.
---

OrbitScope puts the live satellite catalog on a globe. The dots are Starlink, GPS, and the ISS. The orange marker is New York, and pass times are calculated from there.

It is not deployed yet. The code and a screenshot are on [GitHub](https://github.com/michaelnjoku347/OrbitScope).

## What you can do with it

- Filter the sky to Starlink, GPS, the ISS, or all of them.
- Search by name or NORAD id.
- Click a satellite for its latitude, longitude, altitude, and the next few passes over New York. A pass counts when the satellite climbs above 10°.

The screenshot on this page is Starlink only, a bit over 10,000 satellites. GPS and the ISS are in the same catalog. The count changes when CelesTrak updates the file.

## How it works

The API is Java 21 and Spring Boot. It downloads two-line element sets from CelesTrak (Starlink, GPS, and the ISS) and refreshes them every three hours. [Orekit](https://www.orekit.org/) propagates those orbits. Positions for the whole catalog go out as parallel arrays, because one object per satellite was about 1.8 MB.

The globe is [Cesium](https://cesium.com/) and TypeScript. Drawing ten thousand `Entity` objects was too slow, so the dots are a `PointPrimitiveCollection`. The map is Cesium’s built-in Natural Earth imagery, so the page does not need a Cesium ion token.

I checked the ISS against [wheretheiss.at](https://wheretheiss.at) at the same timestamp. The difference was about 0.2 km. On this machine, Orekit took 165 ms for a long benchmark on 4 cores. A simpler array version took 4 ms, but it skips drag, so the globe stays on Orekit.

## Run it

You need Java 21 and Node. From the repo:

```bash
./run.sh api    # http://localhost:8080
./run.sh web    # http://localhost:5173
```

The first API start downloads Orekit’s data files. CelesTrak returns an empty file if the request has no User-Agent, so the fetcher sends one.
