# Lakeside Angler - Assignment 4 WebGL2 Build

This local project has been migrated to the Assignment 4 alpha implementation.
The playable entry is now a native WebGL2 renderer build.

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
- Includes Assignment 4 loop, HUD, fish AI FSM, and multi-species behavior
