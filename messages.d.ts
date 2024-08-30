// Keeping this simple, we send only one type of message
// (a total count of all connections and a count of connections from each country)
import type { Board, Gem } from "~/types/game";

export type State = {
  total: number;
  from: Record<string, number>;
};

export interface GameState extends Board {}

export type MessageFromClient = {
  type: "start";
} | {
  type: "play-again";
} | {
  type: "move";
  userId: string;
  row: number;
  col: number;
  gem: Gem;
} | {
  type: "exchange";
  userId: string;
  gems: Gem[];
};

export type RequestData = {
  type: "active" | "inactive",
  roomId: string;
} | {
  type: "clean-all",
}