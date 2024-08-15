export enum ParamsKey {
  // Shouldn't set these after creating the server
  LEVEL_TYPE = 'LevelType',
  INSTANCE_TYPE = 'InstanceType',
  MINECRAFT_IMAGE_TAG = 'MinecraftImageTag',
  MINECRAFT_TYPE_TAG = 'MinecraftTypeTag',
  MINECRAFT_VERSION = 'MinecraftVersion',
  SEED = 'Seed',

  // These are safe to stop the server and update
  ADMINS = 'AdminPlayerNames',
  DIFFICULTY = 'Difficulty',
  GAMEMODE = 'GameMode',
  PLAYERS_MAX = 'MaxPlayers',
  MEMORY = 'Memory',
  SERVER_STATE = 'ServerState',
  SPOT_PRICE = 'SpotPrice',
  TIMEZONE = 'Timezone',
  VIEW_DIST = 'ViewDistance',
  WHITELIST = 'Whitelist',
}
