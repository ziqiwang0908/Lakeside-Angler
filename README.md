# Lakeside Angler MVP

Assignment 3 MVP prototype for a browser-based fishing simulation focused on three graphics pillars:
- Rendering
- Physics and dynamics
- NPC AI / behavior modeling

## Current MVP Features

- Click on the water to cast a bobber from the rod tip.
- The bobber follows a casting arc, floats on the water, jitters during nibble, and sinks during bite.
- Fish patrol underwater, detect the bobber, approach it, then trigger nibble and bite states.
- The player can hook the fish during the bite window or miss it and watch the fish escape.
- The scene includes animated water, fishing line tension, bobber ripples, and a catch counter.

## Run Locally

This project uses ES modules, so run it through a local static server instead of opening `index.html` directly.

### Python

```powershell
cd D:\RU_MSCS_Materials\26spring\cg\assignment3
python -m http.server 8000
```

Open `http://localhost:8000`.

### Node

```powershell
cd D:\RU_MSCS_Materials\26spring\cg\assignment3
npx serve .
```

Open the local URL shown in the terminal.

## Controls

- `Mouse click`: cast on water or hook during the bite window
- `D`: toggle debug HUD
- `+` / `-`: increase or decrease fish count for stress testing
- `R`: reset the current round

## Suggested Demo Flow

1. Show one full fishing cycle: cast, wait, nibble, bite, catch.
2. Show a failed hook attempt so the fish escapes.
3. Press `+` several times to increase fish count and demonstrate stress testing.
4. Toggle the debug HUD to show state changes and approximate FPS.

## Remaining Submission Work

- Record a 2-3 minute demo video.
- Upload the code to a public GitHub repository.
- Deploy a playable web version with GitHub Pages or Vercel.
- Write the 1-2 page midterm report and export it as PDF.
