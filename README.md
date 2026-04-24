# Lakeside Angler – Feature Complete Build (Assignment 6)

Feature-frozen build of `Lakeside-Angler`. All gameplay, rendering, AI, and UI systems listed in the Assignment 4 Production Plan are present and functional. Remaining work for Assignment 7 is polish, optimization, and bug fixing only.

## Entry
- `index.html` (single self-contained WebGL2 build)

The ES-module source tree under `src/` is the older Alpha implementation and is kept for reference only. Graders should open `index.html`.

## Runtime Requirements
- Browser with WebGL2 support (Chrome, Edge, Firefox)
- Hardware acceleration enabled
- Audio output optional — audio can be toggled in-game

## Controls
- **Click water** — cast the bobber toward the pointer
- **Click / Space** — hook the fish during the STRIKE window
- **R** — restart after the result screen
- **Sound button** (bottom bar) — toggle SFX

## Game Flow
Menu → Active Round → Result → Restart

## Feature Complete Highlights (since Assignment 5 Beta)
- Audio cue layer (cast, splash, nibble, bite, catch, miss, win, lose) via WebAudio synthesis — no external asset files
- Rewritten start menu with an explicit *How to Play* grid so the onboarding works without verbal instruction (required by the A6 playtest protocol)
- Transient in-game toasts on first cast and first bite to teach the nibble → strike rhythm
- Result screen now plays a win or lose motif in addition to the existing textual summary

## Beta-Era Features Still Present
- Dynamic lake conditions per round: `Morning Glass`, `Windy Noon`, `Red Dusk`, `Storm Front`
- Procedural habitat generation: lily pads, reed lanes, deep pockets, with a per-round hotspot
- Habitat-aware fish AI FSM: `PATROL → APPROACH → NIBBLE → BITE → ESCAPE`
- HUD telemetry: timer, catches, escapes, environment, cast zone, fish AI state, FPS
- 3D-style perspective lake rendering (native WebGL2)

## Win / Loss
- **Win:** catch 3 fish before time runs out
- **Loss:** 4 fish escape, or the 90 s timer reaches 0 before the catch target is met

## Fish Species
Bluegill · Largemouth Bass · Rainbow Trout · Common Carp · Catfish

## Run Instructions
1. Open `Lakeside-Angler/index.html` in a current WebGL2-capable browser.
2. Keep hardware acceleration enabled.
3. If local file security blocks the page, serve the folder with any static server (e.g. `python -m http.server`) and open the local URL.
4. Click once after the page loads — browsers gate audio context resume on a user gesture.

## Assignment 6 Deliverables
- Feature Complete Release Notes: `assignment6/Feature_Complete_Release_Notes.md`
- User Study Results: `assignment6/User_Study_Results.md`
