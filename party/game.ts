// We use this 'party' to get and broadcast presence information
// from all connected users. We'll use this to show how many people
// are connected to the room, and where they're from.

import { Board } from "~/game/Board";
import type { GameState, MessageFromClient } from "../messages";

import type * as Party from "partykit/server";
import { Player } from "~/game/Player";
import { GAME_STATUS } from "~/game/constants";

type ConnectionState = {
    username: string;
    userId: string;
}

export default class MyRemix implements Party.Server {
    state: GameState;
    board: Board;

    // eslint-disable-next-line no-useless-constructor
    constructor(public room: Party.Room) {
        this.board = new Board(room.id);
        this.state = this.board.getGameState();
    }

    // let's opt in to hibernation mode, for much higher concurrency
    // like, 1000s of people in a room 🤯
    // This has tradeoffs for the developer, like needing to hydrate/rehydrate
    // state on start, so be careful!
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

    static async onBeforeDisconnect(request: Party.Request, connection: Party.Connection) {
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

        console.log('server onMessage', data, userId);
        switch (data.type) {
            case "start":
                const player = this.board.getPlayerById(userId);
                if (player && player.isAdmin) {
                    this.board.startGame();

                    this.state = this.board.getGameState();
                    this.room.broadcast(JSON.stringify(this.state));
                }
                break;
        }
    }


    // This is called every time a new room is made
    // since we're using hibernation mode, we should
    // "rehydrate" this.state here from all connections
    onStart(): void | Promise<void> {
        // for (const connection of this.room.getConnections<{ from: string }>()) {
        //     const from = connection.state!.from;
        //     this.state = {
        //         total: this.state.total + 1,
        //         from: {
        //             ...this.state.from,
        //             [from]: (this.state.from[from] ?? 0) + 1,
        //         },
        //     };
        // }
    }

    // This is called every time a new connection is made
    async onConnect(
        connection: Party.Connection<ConnectionState>,
        ctx: Party.ConnectionContext
    ): Promise<void> {
        const username = ctx.request.headers.get("X-Username") || "New wizard";
        const userId = ctx.request.headers.get("X-User-ID") || "";
        
        const newPlayer = new Player(username, userId);
        if (this.board.players.length === 0) {
            newPlayer.isAdmin = true;
            this.board.status = GAME_STATUS.LOBBY;
        }

        this.board.addPlayer(newPlayer);

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

        this.board.removePlayerById(userId);

        if (this.board.players.length === 0) {
            this.board.status = GAME_STATUS.STOPPED;
        }

        this.state = this.board.getGameState();

        this.room.broadcast(JSON.stringify(this.state));
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
