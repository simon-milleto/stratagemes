import type { RequestData } from "../messages";
import type * as Party from "partykit/server";

const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
}

export default class Rooms implements Party.Server {
    activeRoomsId: string[] = [];
    constructor(public room: Party.Room) { }

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
            const requestData = await req.json() as RequestData;
            if (requestData && 'type' in requestData) {
                switch (requestData.type) {
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