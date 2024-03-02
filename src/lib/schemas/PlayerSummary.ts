// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 2.0.27
// 

import { Schema, type } from '@colyseus/schema';


export class PlayerSummary extends Schema {
    @type("string") public id!: string;
    @type("string") public name!: string;
    @type("string") public team!: string;
    @type("string") public role!: string;
}
