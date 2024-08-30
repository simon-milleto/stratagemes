import type { RequestData } from "../messages";
import type * as Party from "partykit/server";

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}

// Clean room every 5 minutes
const CLEAN_ROOM_INTERVAL = 5 * 60 * 1000;

export default class Rooms implements Party.Server {
    activeRoomsId: string[] = [];
    constructor(public room: Party.Room) { }

    onAlarm(): void | Promise<void> {
        this.activeRoomsId = [];
        this.room.storage.put("activeRoomsId", []);

        this.room.storage.setAlarm(Date.now() + CLEAN_ROOM_INTERVAL);
    }

    async onRequest(req: Party.Request): Promise<Response> {
        this.activeRoomsId =
            this.activeRoomsId.length
            ? this.activeRoomsId
            : (await this.room.storage.get("activeRoomsId")) || [];

        if (req.method === "GET") {
            return new Response(JSON.stringify({
                rooms: this.activeRoomsId
            }), {
                headers
            });
        }

        if (req.method === "POST") {
            // Restart the clean room alarm
            this.room.storage.setAlarm(Date.now() + CLEAN_ROOM_INTERVAL);

            const requestData = await req.json() as RequestData;
            if (requestData && 'type' in requestData) {
                switch (requestData.type) {
                    case "clean-all":
                        this.activeRoomsId = [];

                        await this.room.storage.put("activeRoomsId", this.activeRoomsId);

                        return new Response(null, { status: 201, headers });
                    case "active":
                        if (!this.activeRoomsId.includes(requestData.roomId)) {
                            this.activeRoomsId.push(requestData.roomId);
                        }

                        await this.room.storage.put("activeRoomsId", this.activeRoomsId);

                        return new Response(null, { status: 201, headers });
                    case "inactive":
                        this.activeRoomsId = this.activeRoomsId.filter(id => id !== requestData.roomId);

                        await this.room.storage.put("activeRoomsId", this.activeRoomsId);

                        return new Response(null, { status: 200, headers });
                }
            }
        }
        return new Response(null, { status: 404 });
    }
}