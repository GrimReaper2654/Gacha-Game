/*
------------------------------------------------------Changelog------------------------------------------------------
Rarities:
normal --> uncommon --> rare --> super rare --> epic --> legendary --> mythical --> godly --> EX
grey        green       blue      purple        silver       gold        red      diamond   black
 0            1          2          3             4           5           6         7        8
 x1         x1.3       x1.7       x2.2           x3          x4           x6        x9      

---------------------------------------------------------------------------------------------------------------------
*/

// Constants (catches spelling mistakes, the code will error if one of these is spelt wrong)
const N = 0;
const UC = 1;
const R = 2;
const SR = 3;
const E = 4;
const L = 5;
const M = 6;
const G = 7;
const EX = 8;

const str = 'str';
const int = 'int';
const hp = 'hp';
const mp = 'mp';

const none = false;

const physical = 'physical';
const magic = 'magic';
const piercing = 'piercing';
const normal = 'normal';
const heal = 'heal';
const effect = 'effect';

const male = 'male';
const female = 'female';

const single = 'single target';
const multi = 'multi target';
const aoe = 'area of effect';
const selfOnly = 'affects self only';
const summon = 'summon';

const ranged = 'ranged';
const melee = 'melee';
const fullScreen = 'fullScreen';
const self = 'self';

const grey = 'grey';
const red = 'red';
const bronze = 'bronze';
const silver = 'silver';
const black = 'black';
const gold = 'gold'; // both a colour and a currency
const exp = 'exp';
const item = 'item';

const magicStoneN = '[N] Magic Stone';
const magicStoneR = '[R] Magic Stone';
const magicStoneE = '[E] Magic Stone';
const magicStoneL = '[L] Magic Stone';
const magicStoneG = '[G] Magic Stone';

var gachaGameData = {
    startingGamestate: {
        player: {
            inventory: [],
            characters: [],
            team: [],
            discoveredHeroes: [],
            discoveredEmemies: [],
            money: 25000,
            exp: 0,
            level: 1,
        },
        pulls: [
            {
                name: `Bonus Card Pack`,
                cost: 0,
                attempts: 1,
                rates: {
                    itemCharacterBias: 0,
                    normal: 0.9,
                    uncommon: 0.1,
                    rare: 0,
                    superRare: 0,
                    epic: 0,
                    legendary: 0,
                    godly: 0,
                    ex: 0,
                },
                exp: 10,
                stock: 1,
                duration: Infinity,
                colour: red,
                id: 0,
            },
            {
                name: `Starter Card Pack`,
                cost: 100,
                attempts: 10,
                rates: {
                    itemCharacterBias: 0.75,
                    normal: 0.70,
                    uncommon: 0.17,
                    rare: 0.12,
                    superRare: 0.01,
                    epic: 0,
                    legendary: 0,
                    godly: 0,
                    ex: 0,
                },
                exp: 800,
                stock: 5,
                duration: Infinity,
                colour: grey,
                id: 1,
            },
            {
                name: `Default Card Pack`,
                cost: 500,
                attempts: 10,
                rates: {
                    itemCharacterBias: 0.9,
                    normal: 0.75,
                    uncommon: 0.18,
                    rare: 0.06,
                    superRare: 0.01,
                    epic: 0,
                    legendary: 0,
                    godly: 0,
                    ex: 0,
                },
                exp: 1000,
                stock: Infinity,
                duration: Infinity,
                colour: grey,
                id: 2,
            },
            {
                name: `Bronze Card Pack`,
                cost: 5000,
                attempts: 10,
                rates: {
                    itemCharacterBias: 0.9,
                    normal: 0.35,
                    uncommon: 0.25,
                    rare: 0.20,
                    superRare: 0.1,
                    epic: 0.05,
                    legendary: 0,
                    godly: 0,
                    ex: 0,
                },
                exp: 5000,
                stock: Infinity,
                duration: Infinity,
                colour: bronze,
                id: 3,
            },
            {
                name: `Silver Card Pack`,
                cost: 10000,
                attempts: 5,
                rates: {
                    itemCharacterBias: 0.75,
                    normal: 0.1,
                    uncommon: 0.2,
                    rare: 0.4,
                    superRare: 0.15,
                    epic: 0.1,
                    legendary: 0.05,
                    godly: 0,
                    ex: 0,
                },
                exp: 25000,
                stock: Infinity,
                duration: Infinity,
                colour: silver,
                id: 4,
            },
            {
                name: `Golden Card Pack`,
                cost: 100000,
                attempts: 1,
                rates: {
                    itemCharacterBias: 0.2,
                    normal: 0,
                    uncommon: 0,
                    rare: 0,
                    superRare: 0.15,
                    epic: 0.25,
                    legendary: 0.5,
                    godly: 0.1,
                    ex: 0,
                },
                exp: 500000,
                stock: Infinity,
                duration: Infinity,
                colour: gold,
                id: 5,
            },
            {
                name: `Mega Golden Card Pack`,
                cost: 1000000,
                attempts: 10,
                rates: {
                    itemCharacterBias: 0.2,
                    normal: 0,
                    uncommon: 0,
                    rare: 0,
                    superRare: 0.05,
                    epic: 0.3,
                    legendary: 0.5,
                    godly: 0.15,
                    ex: 0,
                },
                exp: 1000000,
                stock: Infinity,
                duration: Infinity,
                colour: gold,
                id: 6,
            },
            {
                name: `Item Card Pack`,
                cost: 10000,
                attempts: 10,
                rates: {
                    itemCharacterBias: 1,
                    normal: 0.1,
                    uncommon: 0.2,
                    rare: 0.4,
                    superRare: 0.15,
                    epic: 0.1,
                    legendary: 0.04,
                    godly: 0.01,
                    ex: 0,
                },
                stock: Infinity,
                duration: Infinity,
                colour: red,
                id: 7,
            },
            {
                name: `Hero Card Pack`,
                cost: 25000,
                attempts: 5,
                rates: {
                    itemCharacterBias: 0,
                    normal: 0.1,
                    uncommon: 0.2,
                    rare: 0.4,
                    superRare: 0.15,
                    epic: 0.1,
                    legendary: 0.05,
                    godly: 0,
                    ex: 0,
                },
                exp: 50000,
                stock: Infinity,
                duration: Infinity,
                colour: red,
                id: 8,
            },
            {
                name: `Superior Item Card Pack`,
                cost: 30000,
                attempts: 10,
                rates: {
                    itemCharacterBias: 1,
                    normal: 0.1,
                    uncommon: 0.2,
                    rare: 0.4,
                    superRare: 0.15,
                    epic: 0.1,
                    legendary: 0.04,
                    godly: 0.01,
                    ex: 0,
                },
                stock: Infinity,
                duration: Infinity,
                colour: red,
                id: 7,
            },
            {
                name: `Superior Hero Card Pack`,
                cost: 75000,
                attempts: 5,
                rates: {
                    itemCharacterBias: 0,
                    normal: 0.1,
                    uncommon: 0.2,
                    rare: 0.4,
                    superRare: 0.15,
                    epic: 0.1,
                    legendary: 0.05,
                    godly: 0,
                    ex: 0,
                },
                exp: 50000,
                stock: Infinity,
                duration: Infinity,
                colour: red,
                id: 8,
            },
            {
                name: `Whale Card Pack`,
                cost: 10000000,
                attempts: 1,
                rates: {
                    itemCharacterBias: 0,
                    normal: 0,
                    uncommon: 0,
                    rare: 0,
                    superRare: 0,
                    epic: 0,
                    legendary: 0.,
                    godly: 1,
                    ex: 0,
                },
                exp: 1000000000,
                stock: Infinity,
                duration: Infinity,
                colour: black,
                id: 9,
            },
        ],
        dungeon: 0,
        inBattle: false,
        battleState: {
            battleOver: false,
            wave: 0,
            eb: [],
            ef: [],
            pf: [],
            pb: [],
            tempStorage: {},
        },
    },
    characters: [],
    enemies: {},
    summons: {},
    skills: {},
    effects: {},
    dungeons: [],
    items: [],
    drops: {},
    leveling: `Math.floor(([r]+1)/2*(1.5**([l]-1)+4)*10)*100`, // turst me it works
    levelUpStatChange: [ // +hp +mp *str *mp
        {hp: 10, mp: 10, str: 1.025, int: 1.025}, // 0 N 
        {hp: 13, mp: 13, str: 1.025, int: 1.025}, // 1 UC
        {hp: 17, mp: 17, str: 1.025, int: 1.025}, // 2 R
        {hp: 22, mp: 22, str: 1.05, int: 1.05},   // 3 SR
        {hp: 30, mp: 30, str: 1.05, int: 1.05},   // 4 E
        {hp: 40, mp: 40, str: 1.05, int: 1.05},   // 5 L
        {hp: 60, mp: 60, str: 1.06, int: 1.06},   // 6 M
        {hp: 90, mp: 90, str: 1.07, int: 1.07},   // 7 G
        {hp: 0, mp: 0, str: 1, int: 1},           // 8 EX
    ],
    pulls: {
        
    },
    voiceLines: {
        enemyAppears: {
            timid: [
                `The scary [enemy] are attacking!`,
                `These [enemy] look strong, can we really beat them?`,
            ],
            calm: [
                `The [enemy] are here. Prepare for battle.`,
                `The [enemy] approach.`,
            ],
            confident: [
                `The [enemy] are here. We can take them!`,
                `We can beat these [enemy]!`,
                `These [enemy] don't stand a chance against us!`,
                `Our victory is assured!`
            ],
            arrogant: [
                `Ah, more fools seeking to challenge me? How predictable.`,
                `You dare stand before me [enemy]? Prepare to be die!`,
                `I've faced greater foes in my sleep. This will be over before you know it!`,
                `[enemy], I hope you're ready to taste defeat!`,
                `These [enemy] are nothing to me! I can take them!`
            ],
            angry: [
                `Kill the [enemy]! Make them suffer!`,
            ],
            chunni: [
                `[enemy], prepare to be amazed by my power!`,
                `I walk the line between shadows and chaos. Who dares to stand in my way?`,
                `In the shadows, I find my strength. Face me, [enemy], and witness true darkness.`,
            ],
        },
        dungeonCleared: {
            timid: [

            ],
            calm: [

            ],
            confident: [

            ],
            arrogant: [

            ],
            angry: [
                
            ],
            chunni: [

            ]
        },
        bossAppears: {
            timid: [

            ],
            calm: [

            ],
            confident: [

            ],
            arrogant: [

            ],
            angry: [
                
            ],
            chunni: [
                
            ]
        },
        bossDefeated: {
            timid: [

            ],
            calm: [

            ],
            confident: [

            ],
            arrogant: [

            ],
            angry: [
                
            ],
            chunni: [
                
            ]
        },
        bigWaveAppears: {
            timid: [

            ],
            calm: [

            ],
            confident: [

            ],
            arrogant: [

            ],
            angry: [
                
            ],
            chunni: [
                
            ]
        },
    },
    characterData: {
        effects: [],
        exp: 0,
        expToAdd: 0,
        level: 1,
        ap: 0,
        alive: true,
        specialConditions: {},
    },
    enemyData: {
        effects: [],
        ap: 0,
        id: '',
        specialConditions: {},
        lastHit: '',
    },
};

import {gachaGameCharacters, gachaGameEnemies, gachaGameSummons} from "./characters.js";
import {gachaGameSkills, gachaGameEffects} from "./skills.js";
import {gachaGameDungeons} from "./dungeons.js";
import {gachaGameItems, gachaGameDrops} from "./items.js";

gachaGameData.characters = gachaGameCharacters;
gachaGameData.enemies = gachaGameEnemies;
gachaGameData.summons = gachaGameSummons;
gachaGameData.skills = gachaGameSkills;
gachaGameData.effects = gachaGameEffects;
gachaGameData.dungeons = gachaGameDungeons;
gachaGameData.items = gachaGameItems;
gachaGameData.drops = gachaGameDrops;

export {gachaGameData};
