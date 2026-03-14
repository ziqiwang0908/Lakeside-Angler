export const GAME_CONFIG = {
  waterLevel: 0.42,
  targetFps: 60,
  initialFishCount: 6,
  minFishCount: 1,
  maxFishCount: 24,
  backgroundWaveBands: 5,
  castingLerp: 0.08,
  idleBobAmplitude: 4,
  idleBobSpeed: 0.0045,
  nibbleBobAmplitude: 8,
  nibbleBobSpeed: 0.022,
  biteSinkDepth: 14,
  waitingDurationMs: 2600,
  nibbleDurationMs: 1300,
  biteDurationMs: 1200,
  catchDurationMs: 900,
  fishMinSpeed: 0.35,
  fishMaxSpeed: 1.1,
  fishApproachSpeed: 1.45,
  fishEscapeSpeed: 1.8,
  fishDetectRadius: 180,
  fishNibbleRadius: 42,
  debugEnabledByDefault: true,
};

export const FISHING_STATES = {
  IDLE: "IDLE",
  CASTING: "CASTING",
  WAITING: "WAITING",
  NIBBLE: "NIBBLE",
  BITE: "BITE",
  REELING: "REELING",
  CAUGHT: "CAUGHT",
  ESCAPED: "ESCAPED",
};

export const UI_COPY = {
  [FISHING_STATES.IDLE]: {
    status: "Ready to Cast",
    hint: "Click the water to cast",
  },
  [FISHING_STATES.CASTING]: {
    status: "Casting",
    hint: "Bobber is moving toward the target",
  },
  [FISHING_STATES.WAITING]: {
    status: "Waiting",
    hint: "Watch the bobber for fish activity",
  },
  [FISHING_STATES.NIBBLE]: {
    status: "Nibble",
    hint: "A fish is testing the hook",
  },
  [FISHING_STATES.BITE]: {
    status: "Strike",
    hint: "Click now to hook the fish",
  },
  [FISHING_STATES.REELING]: {
    status: "Reeling",
    hint: "Pulling the fish back to shore",
  },
  [FISHING_STATES.CAUGHT]: {
    status: "Caught",
    hint: "Click anywhere to reset",
  },
  [FISHING_STATES.ESCAPED]: {
    status: "Escaped",
    hint: "Click anywhere to try again",
  },
};
