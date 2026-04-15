# Lakeside Angler - Assignment 5 Beta Build

This local project is the Assignment 5 beta implementation of `Lakeside-Angler`.
The playable entry is a native WebGL2 browser build with a full loop, species-driven fish AI, and a new dynamic environment plus procedural habitat system.

## Entry
- `index.html`

## Runtime Requirements
- Browser with WebGL2 support (Chrome, Edge, Firefox)
- Hardware acceleration enabled

## Controls
- Mouse click on water: cast
- Space or Reel button: reel in during bite window
- R key: restart after result screen

## Game Flow
Menu -> Active Round -> Result -> Restart

## Beta Features
- Dynamic lake conditions per round: `Morning Glass`, `Windy Noon`, `Red Dusk`, `Storm Front`
- Procedural habitat generation: lily pads, reed lanes, and deep pockets
- Habitat-aware fish behavior: fish patrol around cover, react to current, and escape toward shelter
- HUD telemetry for environment, cast zone quality, fish state, and FPS

## Win / Loss
- Win: catch 3 fish before time runs out
- Loss: 4 fish escape or timer reaches 0 before target catches

## Fish Species
- Bluegill
- Largemouth Bass
- Rainbow Trout
- Common Carp
- Catfish

## Notes
- Renderer: native WebGL2 (`canvas.getContext("webgl2")`)
- Includes Assignment 4 loop, HUD, fish AI FSM, multi-species behavior, and Assignment 5 secondary-pillar integration

## Run Instructions
1. Open `Lakeside-Angler/index.html` in a current WebGL2-capable browser.
2. Keep hardware acceleration enabled.
3. If local browser security settings block module or asset access in your environment, serve the folder with a lightweight static server and open the local URL.
