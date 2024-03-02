// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.27
// 

import { Schema, type, ArraySchema, MapSchema } from '@colyseus/schema';
import { Player } from './Player'
import { PlayerSummary } from './PlayerSummary'

export class GameRoomState extends Schema {
    @type("string") public title!: string;
    @type("string") public password!: string;
    @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<Player>();
    @type([ "string" ]) public roles: ArraySchema<string> = new ArraySchema<string>();
    @type("number") public round!: number;
    @type(Player) public leader: Player = new Player();
    @type("string") public gameState!: string;
    @type("number") public questSucceed!: number;
    @type("number") public questFailed!: number;
    @type("number") public noQuestCount!: number;
    @type("string") public winTeam!: string;
    @type("string") public teamRevealed!: string;
    @type([ PlayerSummary ]) public result: ArraySchema<PlayerSummary> = new ArraySchema<PlayerSummary>();
}
