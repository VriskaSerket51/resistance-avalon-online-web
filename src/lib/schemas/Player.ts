// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.27
// 

import { Schema, type } from '@colyseus/schema';


export class Player extends Schema {
    @type("string") public id!: string;
    @type("boolean") public isMaster!: boolean;
    @type("boolean") public isConnected!: boolean;
    @type("boolean") public isKicked!: boolean;
    @type("string") public name!: string;
    @type("number") public index!: number;
}
