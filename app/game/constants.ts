export const GAME_STATUS = {
    LOBBY: "lobby",
    PLAYING: "playing",
    WAITING_PLAYERS: "waiting-players",
    FINISHED: "finished",
    STOPPED: "stopped",
} as const
export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

export const DEFAULT_SETTINGS = {
    PLAYERSMAX_PLAYERS: 6,
    WITH_PROFESSOR: true,
} as const

export const PLAYER_ROUND_STATUS = {
    WAITING: "waiting",
    DRAW_GEMS: "drawGems",
    PLAYING: "playing",
} as const
export type PlayerRoundStatus = (typeof PLAYER_ROUND_STATUS)[keyof typeof PLAYER_ROUND_STATUS]

export const PLAYER_GAME_STATUS = {
    IN_LOBBY: "in-lobby",
    IN_GAME: "in-game",
} as const
export type PlayerGameStatus = (typeof PLAYER_GAME_STATUS)[keyof typeof PLAYER_GAME_STATUS]

export const PLAYER_CONNEXION_STATUS = {
    CONNECTED: "connected",
    WAITING: "waiting",
    DISCONNECTED: "disconnected",
} as const
export type PlayerConnexionStatus = (typeof PLAYER_CONNEXION_STATUS)[keyof typeof PLAYER_CONNEXION_STATUS]

export const MESSAGE_TYPE = {
    PLAYER_JOINED: "player-joined",
    PLAYER_RECONNECT: "player-reconnect",
    PLAYER_LEFT: "player-left",
    USER_MESSAGE: "message",
} as const
export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE]
export type SystemMessageType = Exclude<MessageType, "message">

export const CELL_COLOR = {
    EMPTY: 'empty',
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    WHITE: 'white',
    BLACK: 'black'
} as const;
export type CellColorType = (typeof CELL_COLOR)[keyof typeof CELL_COLOR]

export const DIRECTIONS = {
    TOP_LEFT: [-1, -1],
    TOP: [-1, 0],
    TOP_RIGHT: [-1, 1],
    LEFT: [0, -1],
    RIGHT: [0, 1],
    BOTTOM_LEFT: [1, -1],
    BOTTOM: [1, 0],
    BOTTOM_RIGHT: [1, 1]
} as const;
export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS]

export const INACTIVITY_TIMEOUT = 5_000;

export const SESSION_TIMEOUT = 3600 * 24;

export const ACTIVE_ROOM_ID = "index";

export const FIRST_NAMES = [
    "Malakar", "Eldrin", "Thalor", "Zareth", "Morvyn", "Seraphis", "Vespera",
    "Kaelus", "Nyx", "Draven", "Lysandra", "Mordain", "Sylvaris", "Valtor",
    "Zephyros", "Morgath", "Elysara", "Ravyn", "Theron", "Zalara", "Valindra",
    "Orinthar", "Velkan", "Lirien", "Ebonis", "Thorne", "Kaelen", "Vesper",
    "Sylvannis", "Azriel", "Sorin", "Thalindra", "Malakai", "Zephyra",
    "Morwenna", "Velorian", "Lysandor", "Nyxaria", "Kaelith", "Zephyrus",
    "Elarion"
];

export const FAMILY_NAMES = [
    "Shadowmancer", "Darkflame", "Nightshade", "Blackthorn", "Bloodcaster",
    "Ravenscar", "Grimwood", "Voidcaller", "Shadowweaver", "Thornveil",
    "Stormbringer", "Ashfall", "Moonshadow", "Darkspire", "Windcaller",
    "Blackfire", "Nightbloom", "Soulbinder", "Duskmantle", "Frostveil",
    "Nightweaver", "Spellbinder", "Darkstorm", "Shadowborn", "Nightwhisper",
    "Bloodrune", "Stormshroud", "Darkwhisper", "Moonveil", "Emberflame",
    "Shadowglen", "Grimfire", "Windwalker", "Darkrose", "Spellweaver",
    "Nightveil", "Dusksworn", "Flamecaller", "Nightshade", "Stormbringer"
];

export const ADJECTIVES = [
    "Ancient", "Mystic", "Cursed", "Enigmatic", "Ethereal", "Malevolent",
    "Shadowy", "Arcane", "Wicked", "Mysterious", "Dark", "Forsaken",
    "Powerful", "Vengeful", "Sinister", "Eldritch", "Forbidden", "Ominous",
    "Spectral", "Twilight", "Veiled", "Infernal", "Cryptic", "Phantom",
    "Shrouded", "Abyssal", "Haunted", "Runic", "Charmed", "Necrotic",
    "Unholy", "Divine", "Sorcerous", "Occult", "Malevolent", "Ghastly",
    "Celestial", "Dreadful", "Lunar", "Infernal"
];

export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const pickRandomSlug = () => (
    `${pickRandom(ADJECTIVES).toLowerCase()}-${pickRandom(FAMILY_NAMES).toLowerCase()}-${pickRandom(FIRST_NAMES).toLowerCase()}`
)