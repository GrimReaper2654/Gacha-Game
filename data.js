// Constants (catches spelling mistakes, the code will error if one of these is spelt wrong)
const N = 0;
const UC = 1;
const R = 2;
const SR = 3;
const E = 4;
const L = 5;
const G = 6;
const EX = 7;

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

const grey = 'grey';
const red = 'red';
const bronze = 'bronze';
const silver = 'silver';
const gold = 'gold';
const black = 'black';

const single = 'single target';
const multi = 'multi target';
const aoe = 'area of effect';
const selfOnly = 'affects self only';
const summon = 'summon';

const ranged = 'ranged';
const melee = 'melee';
const fullScreen = 'fullScreen';
const self = 'self';

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
    items: [],
    pulls: {
        
    },
    dungeons: [
        {
            name: `Goblin Den`,
            outerBac: `assets/DungeonOuter1.jpeg`,
            innerBac: `assets/bronze.png`,
            waves: [
                { // 1
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 0,
                            quantity: 3,
                            location: `frontline`,
                            drops: {exp: 100, gold: 10},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 2
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 0,
                            quantity: 4,
                            location: `frontline`,
                            drops: {exp: 100, gold: 10},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 3
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 0,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 100, gold: 10},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 125, gold: 15},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 4
                    type: `big`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 0,
                            quantity: 5,
                            location: `frontline`,
                            drops: {exp: 100, gold: 10},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblin`,
                            lvl: 0,
                            quantity: 4,
                            location: `backline`,
                            drops: {exp: 100, gold: 10},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 2500, chance: 1}, {type: `gold`, quantity: 250, chance: 1}],
                },
                { // 5
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblinWarrior`,
                            lvl: 0,
                            quantity: 1,
                            location: `frontline`,
                            drops: {exp: 125, gold: 20},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 0,
                            quantity: 2,
                            location: `backline`,
                            drops: {exp: 125, gold: 15},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 6
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 0,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 100, gold: 10},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblinWarrior`,
                            lvl: 0,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 125, gold: 20},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                        {
                            enemy: `goblin`,
                            lvl: 0,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 100, gold: 10},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 7
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 1,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 110, gold: 12},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 125, gold: 15},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                        {
                            enemy: `goblinWarrior`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 125, gold: 20},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 125, gold: 15},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                        
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 8
                    type: `big`,
                    enemies: [
                        {
                            enemy: `goblinWarrior`,
                            lvl: 1,
                            quantity: 6,
                            location: `frontline`,
                            drops: {exp: 150, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 0,
                            quantity: 4,
                            location: `backline`,
                            drops: {exp: 125, gold: 15},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 2500, chance: 1}, {type: `gold`, quantity: 250, chance: 1}],
                },
                { // 9
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblinWarrior`,
                            lvl: 1,
                            quantity: 1,
                            location: `frontline`,
                            drops: {exp: 150, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                        {
                            enemy: `goblin`,
                            lvl: 1,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 110, gold: 12},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblinWarrior`,
                            lvl: 1,
                            quantity: 1,
                            location: `frontline`,
                            drops: {exp: 150, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 10
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblinWarrior`,
                            lvl: 2,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 175, gold: 30},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                        {
                            enemy: `goblin`,
                            lvl: 2,
                            quantity: 3,
                            location: `backline`,
                            drops: {exp: 120, gold: 14},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 11
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 2,
                            quantity: 4,
                            location: `frontline`,
                            drops: {exp: 120, gold: 14},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 1,
                            quantity: 5,
                            location: `backline`,
                            drops: {exp: 145, gold: 18},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 12
                    type: `big`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 2,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 120, gold: 14},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblinWarrior`,
                            lvl: 2,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 175, gold: 30},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                        {
                            enemy: `goblin`,
                            lvl: 2,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 120, gold: 14},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 1,
                            quantity: 5,
                            location: `backline`,
                            drops: {exp: 145, gold: 18},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 2500, chance: 1}, {type: `gold`, quantity: 250, chance: 1}],
                },
                { // 13
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 3,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 125, gold: 16},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `goblinWarrior`,
                            lvl: 2,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 175, gold: 30},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                        {
                            enemy: `goblin`,
                            lvl: 3,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 125, gold: 16},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 14
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblinWarrior`,
                            lvl: 2,
                            quantity: 1,
                            location: `frontline`,
                            drops: {exp: 175, gold: 30},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 2,
                            quantity: 5,
                            location: `backline`,
                            drops: {exp: 145, gold: 18},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 15
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `goblinWarrior`,
                            lvl: 2,
                            quantity: 2,
                            location: `frontline`,
                            drops: {exp: 175, gold: 30},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                        {
                            enemy: `goblinGuard`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 175, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.25},
                        },
                        {
                            enemy: `goblinArcher`,
                            lvl: 2,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 145, gold: 18},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                        {
                            enemy: `goblinGuard`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 175, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.25},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // boss
                    type: `boss`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 3,
                            quantity: 4,
                            location: `frontline`,
                            drops: {exp: 125, gold: 15},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                        {
                            enemy: `goblinGuard`,
                            lvl: 1,
                            quantity: 1,
                            location: `frontline`,
                            drops: {exp: 175, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.25},
                        },
                        {
                            enemy: `goblinLord`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 1000, gold: 500},
                            itemDrops: {item: `midGradeMagicStone`, chance: 0.75},
                        },
                        {
                            enemy: `goblinGuard`,
                            lvl: 1,
                            quantity: 1,
                            location: `frontline`,
                            drops: {exp: 175, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.25},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 10000, chance: 1}, {type: `gold`, quantity: 1000, chance: 1}, {type: `item`, quantity: 1, chance: 1, item: `goblinWarHorn`}],
                },
            ],
            firstClearReward: [{type: `exp`, quantity: 25000, chance: 1}, {type: `gold`, quantity: 5000, chance: 1}, {type: `item`, quantity: 2, chance: 1, item: `goblinWarHorn`}],
        },
        {
            name: `Dragon Peaks`,
            outerBac: `assets/DragonPeaks.jpeg`,
            innerBac: `assets/bronze.png`,
            waves: [
                { // 1
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `greenDragon`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 1000, gold: 100},
                            itemDrops: {item: `highGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 2
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `greenDragon`,
                            lvl: 1,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 1000, gold: 100},
                            itemDrops: {item: `highGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 3
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `greenDragon`,
                            lvl: 2,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 1000, gold: 100},
                            itemDrops: {item: `highGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 4
                    type: `big`,
                    enemies: [
                        {
                            enemy: `greenDragon`,
                            lvl: 0,
                            quantity: 3,
                            location: `backline`,
                            drops: {exp: 1000, gold: 100},
                            itemDrops: {item: `highGradeMagicStone`, chance: 0.1},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 2500, chance: 1}, {type: `gold`, quantity: 250, chance: 1}],
                },
                { // 5
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `redDragon`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 2500, gold: 500},
                            itemDrops: {item: `highGradeMagicStone`, chance: 0.25},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
                { // 6
                    type: `normal`,
                    enemies: [
                        {
                            enemy: `greenDragon`,
                            lvl: 2,
                            quantity: 3,
                            location: `frontline`,
                            drops: {exp: 1000, gold: 100},
                            itemDrops: {item: `highGradeMagicStone`, chance: 0.1},
                        },
                        {
                            enemy: `redDragon`,
                            lvl: 0,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 2500, gold: 500},
                            itemDrops: {item: `highGradeMagicStone`, chance: 0.25},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 1000, chance: 1}, {type: `gold`, quantity: 100, chance: 1}],
                },
            ],
            firstClearReward: [{type: `exp`, quantity: 25000, chance: 1}, {type: `gold`, quantity: 5000, chance: 1}, {type: `item`, quantity: 5, chance: 1, item: `dragonScale`}],
        },
    ],
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
    },
};

import {gachaGameCharacters, gachaGameEnemies, gachaGameSummons} from "./characters.js";
import {gachaGameSkills, gachaGameEffects} from "./skills.js";
import {gachaGameItems} from "./items.js";

gachaGameData.characters = gachaGameCharacters;
gachaGameData.enemies = gachaGameEnemies;
gachaGameData.summons = gachaGameSummons;
gachaGameData.skills = gachaGameSkills;
gachaGameData.effects = gachaGameEffects;
gachaGameData.items = gachaGameItems;

export {gachaGameData};
