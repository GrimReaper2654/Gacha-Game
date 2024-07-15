const goblinDen = {
    id: `goblinDen`,
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
                },
            ],
        },
        { // 2
            type: `normal`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 0,
                    quantity: 4,
                    location: `frontline`,
                },
            ],
        },
        { // 3
            type: `normal`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 0,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 4
            type: `big`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 0,
                    quantity: 5,
                    location: `frontline`,
                },
                {
                    enemy: `goblin`,
                    lvl: 0,
                    quantity: 4,
                    location: `backline`,
                },
            ],
        },
        { // 5
            type: `normal`,
            enemies: [
                {
                    enemy: `goblinWarrior`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 0,
                    quantity: 2,
                    location: `backline`,
                },
            ],
        },
        { // 6
            type: `normal`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 0,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblinWarrior`,
                    lvl: 0,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblin`,
                    lvl: 0,
                    quantity: 2,
                    location: `frontline`,
                },
                
            ],
        },
        { // 7
            type: `normal`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 1,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `goblinWarrior`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                
            ],
        },
        { // 8
            type: `big`,
            enemies: [
                {
                    enemy: `goblinWarrior`,
                    lvl: 1,
                    quantity: 6,
                    location: `frontline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 0,
                    quantity: 4,
                    location: `backline`,
                },
            ],
        },
        { // 9
            type: `normal`,
            enemies: [
                {
                    enemy: `goblinWarrior`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `goblin`,
                    lvl: 1,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblinWarrior`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
        { // 10
            type: `normal`,
            enemies: [
                {
                    enemy: `goblinWarrior`,
                    lvl: 2,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblin`,
                    lvl: 2,
                    quantity: 3,
                    location: `backline`,
                },
            ],
        },
        { // 11
            type: `normal`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 2,
                    quantity: 4,
                    location: `frontline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 1,
                    quantity: 5,
                    location: `backline`,
                },
            ],
        },
        { // 12
            type: `big`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 2,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblinWarrior`,
                    lvl: 2,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblin`,
                    lvl: 2,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 1,
                    quantity: 5,
                    location: `backline`,
                },
            ],
        },
        { // 13
            type: `normal`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 3,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblinWarrior`,
                    lvl: 2,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblin`,
                    lvl: 3,
                    quantity: 2,
                    location: `frontline`,
                },
            ],
        },
        { // 14
            type: `normal`,
            enemies: [
                {
                    enemy: `goblinWarrior`,
                    lvl: 2,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 2,
                    quantity: 5,
                    location: `backline`,
                },
            ],
        },
        { // 15
            type: `normal`,
            enemies: [
                {
                    enemy: `goblinWarrior`,
                    lvl: 2,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `goblinGuard`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `goblinArcher`,
                    lvl: 2,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `goblinGuard`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // boss
            type: `boss`,
            enemies: [
                {
                    enemy: `goblin`,
                    lvl: 3,
                    quantity: 4,
                    location: `frontline`,
                },
                {
                    enemy: `goblinGuard`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `goblinLord`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `goblinGuard`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
    ],
};

const dragonPeaks = {
    id: `goblinDen`,
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
                },
            ],
        },
        { // 2
            type: `normal`,
            enemies: [
                {
                    enemy: `greenDragon`,
                    lvl: 1,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 3
            type: `normal`,
            enemies: [
                {
                    enemy: `crystalDragon`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 4
            type: `big`,
            enemies: [
                {
                    enemy: `greenDragon`,
                    lvl: 0,
                    quantity: 3,
                    location: `backline`,
                },
            ],
        },
        { // 5
            type: `normal`,
            enemies: [
                {
                    enemy: `electroDragon`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 6
            type: `normal`,
            enemies: [
                {
                    enemy: `redDragon`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 7
            type: `normal`,
            enemies: [
                {
                    enemy: `redDragonKing`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 8
            type: `boss`,
            enemies: [
                {
                    enemy: `blackDragon`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
    ],
};

const debugDungeon = {
    id: `debugDungeon`,
    name: `Debug Dungeon`,
    outerBac: `assets/lake.jpeg`,
    innerBac: `assets/bronze.png`,
    waves: [
        { // 1
            type: `boss`,
            enemies: [
                {
                    enemy: `chicken`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
    ],
};

const gachaGameDungeons = [goblinDen, dragonPeaks, debugDungeon];
export {gachaGameDungeons};