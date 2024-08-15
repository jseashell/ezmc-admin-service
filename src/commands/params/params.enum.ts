export enum ParamsKey {
  // Shouldn't set these after creating the server
  MINECRAFT_TYPE_TAG = 'MinecraftTypeTag',
  LEVEL_TYPE = 'LevelType',
  MINECRAFT_VERSION = 'MinecraftVersion',
  SEED = 'Seed',

  // These are safe to stop the server and update
  SERVER_STATE = 'ServerState',
  ADMINS = 'AdminPlayerNames',
  DIFFICULTY = 'Difficulty',
  WHITELIST = 'Whitelist',
  MEMORY = 'Memory',
  MAX_PLAYERS = 'MaxPlayers',
  VIEW_DIST = 'ViewDistance',
  GAMEMODE = 'GameMode',
}
