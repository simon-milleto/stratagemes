// We use this 'party' to get and broadcast presence information
// from all connected users. We'll use this to show how many people
// are connected to the room, and where they're from.

import { Board } from "~/game/Board";
import type { GameState, MessageFromClient, RequestData } from "../messages";

import type * as Party from "partykit/server";
import { Player } from "~/game/Player";
import { GAME_STATUS, PLAYER_ROUND_STATUS, PLAYER_CONNEXION_STATUS, INACTIVITY_TIMEOUT, ACTIVE_ROOM_ID } from "~/game/constants";

type ConnectionState = {
    username: string;
    userId: string;
}

const DEBUG = false;

export default class MyRemix implements Party.Server {
    state: GameState;
    board: Board;

    // eslint-disable-next-line no-useless-constructor
    constructor(public room: Party.Room) {
        this.board = new Board(room.id);
        this.state = this.board.getGameState();
    }

    static options = {
        hibernate: false,
    };

    static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
        try {
            // get username
            const username = new URL(request.url).searchParams.get("username") ?? "";
            const userId = new URL(request.url).searchParams.get("userId") ?? "";

            request.headers.set("X-Username", username);
            request.headers.set("X-User-ID", userId);

            // forward the request onwards on onConnect
            return request;
        } catch (e) {
            // authentication failed!
            // short-circuit the request before it's forwarded to the party
            return new Response("Unauthorized", { status: 401 });
        }
    }

    async onMessage(message: string | ArrayBuffer | ArrayBufferView, sender: Party.Connection<ConnectionState>): Promise<void> {
        const data = JSON.parse(message.toString()) as MessageFromClient;
        const userId = sender.state!.userId;

        const player = this.board.getPlayerById(userId);
        if (!player) return;

        switch (data.type) {
            case "start":
                if (player && player.isAdmin) {
                    this.board.startGame();
                    player.roundStatus = PLAYER_ROUND_STATUS.PLAYING;

                    const activeRoomsRoom = this.getActiveRoomsRoom();

                    console.log('notify room inactive');
                    await activeRoomsRoom.fetch({
                        method: "POST",
                        body: JSON.stringify({
                            type: "inactive",
                            roomId: this.room.id
                        } satisfies RequestData)
                    });

                    this.state = this.board.getGameState();
                    this.room.broadcast(JSON.stringify(this.state));
                }
                break;
            case "move":
                if (player) {
                    player.makeMove(data.row, data.col, data.gem);

                    this.state = this.board.getGameState();
                    this.room.broadcast(JSON.stringify(this.state));
                }
                break;
            case "exchange":
                if (player) {
                    const nextPlayer = this.board.getNextPlayer();
                    if (nextPlayer) {
                        nextPlayer.roundStatus = PLAYER_ROUND_STATUS.PLAYING;
                    }                    
                    
                    player.makeExchange(data.gems);

                    this.board.round++;

                    this.state = this.board.getGameState();
                    this.room.broadcast(JSON.stringify(this.state));
                }
                break;
        }
    }

    // This is called every time a new connection is made
    async onConnect(
        connection: Party.Connection<ConnectionState>,
        ctx: Party.ConnectionContext
    ): Promise<void> {
        const username = ctx.request.headers.get("X-Username") || "New wizard";
        const userId = ctx.request.headers.get("X-User-ID") || "";
        
        const existingPlayer = this.board.getPlayerById(userId);
        const player = this.board.getPlayerById(userId) || new Player(username, userId);

        player.connexionStatus = PLAYER_CONNEXION_STATUS.CONNECTED;

        this.board.ensureAdminIsSet();

        if (this.board.status === GAME_STATUS.LOBBY) {
            // get handle to a shared room instance of the "activeRooms" party
            const activeRoomsRoom = this.getActiveRoomsRoom();

            // notify room by making an HTTP POST request
            console.log('notify room active');
            await activeRoomsRoom.fetch({
                method: "POST",
                body: JSON.stringify({
                    type: "active",
                    roomId: this.room.id
                } satisfies RequestData)
            });
        }

        if (!existingPlayer) {
            console.log(`NOT EXISTING PLAYER ${player.getUsername()}`);
            this.board.addPlayer(player);
        }

        if (DEBUG && this.board.players.length < 2) {
            this.board.addPlayer(new Player("New wizard", "fake-player"));
            player.roundStatus = PLAYER_ROUND_STATUS.PLAYING;

            this.board.startGame();
        }

        this.state = this.board.getGameState();

        connection.setState({ 
            username,
            userId
         });

        // finally, let's broadcast the new state to all connections
        this.room.broadcast(JSON.stringify(this.state));
    }

    // This is called every time a connection is closed
    async onClose(connection: Party.Connection<ConnectionState>): Promise<void> {
        const userId = connection.state!.userId;

        const player = this.board.getPlayerById(userId);
        if (player) {
            player.connexionStatus = PLAYER_CONNEXION_STATUS.DISCONNECTED;
        }
        this.board.status = GAME_STATUS.WAITING_PLAYERS;

        this.state = this.board.getGameState();
        
        if (DEBUG) {
            this.board.removePlayerById(userId);
            this.board.removePlayerById("fake-player");
        }

        this.room.broadcast(JSON.stringify(this.state));

        this.room.storage.setAlarm(Date.now() + INACTIVITY_TIMEOUT);
    }

    onAlarm(): void | Promise<void> {
        this.board.players.forEach(player => {
            if (player.connexionStatus === PLAYER_CONNEXION_STATUS.DISCONNECTED) {
                this.board.removePlayerById(player.getId());
            }
        });

        if (this.board.players.length === 0) {
            this.board.status = GAME_STATUS.STOPPED;
        } else if (this.board.players.length === 1) {
            this.board.status = GAME_STATUS.LOBBY;
        } else {
            const currentPlayer = this.board.getCurrentPlayer();
            if (!currentPlayer) {
                this.board.players[0].roundStatus = PLAYER_ROUND_STATUS.PLAYING;
            }
        }

        this.state = this.board.getGameState();

        this.room.broadcast(JSON.stringify(this.state));

    }

    getActiveRoomsRoom() {
        const activeRoomsParty = this.room.context.parties.active_rooms;
        const activeRoomsRoomId = ACTIVE_ROOM_ID;
        const activeRoomsRoom = activeRoomsParty.get(activeRoomsRoomId);

        return activeRoomsRoom;
    }

    // This is called when a connection has an error
    async onError(
        connection: Party.Connection<ConnectionState>,
        err: Error
    ): Promise<void> {
        // let's log the error
        console.error(err);
        // and close the connection
        await this.onClose(connection);
    }
}

MyRemix satisfies Party.Worker;
