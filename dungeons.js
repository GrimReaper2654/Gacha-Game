const goblinDen = {
    id: `goblinDen`,
    name: `Goblin Den`,
    outerBac: `assets/goblinDen.jpeg`,
    innerBac: `assets/mossyStone.jpeg`,
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
                    enemy: `goblinGuard`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
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
            ],
        },
    ],
};

const dragonPeaks = {
    id: `goblinDen`,
    name: `Dragon Peaks`,
    outerBac: `assets/dragonPeaks.jpeg`,
    innerBac: `assets/stone.jpeg`,
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

const shadowCavern = {
    id: `shadowCavern`,
    name: `Shadow Cavern`,
    outerBac: `assets/shadowCavern.jpeg`,
    innerBac: `assets/darkStone.jpeg`,
    waves: [
        { // 1
            type: `normal`,
            enemies: [
                {
                    enemy: `shadowBat`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `spider`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 1,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 2,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `shadowBat`,
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
                    enemy: `shadowBat`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `spider`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 1,
                    quantity: 2,
                    location: `backline`,
                },
            ],
        },
        { // 3
            type: `normal`,
            enemies: [
                {
                    enemy: `shadowBat`,
                    lvl: 2,
                    quantity: 3,
                    location: `frontline`,
                },
            ],
        },
        { // 4
            type: `big`,
            enemies: [
                {
                    enemy: `shadowBat`,
                    lvl: 0,
                    quantity: 4,
                    location: `frontline`,
                },
                {
                    enemy: `spider`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 0,
                    quantity: 6,
                    location: `backline`,
                },
            ],
        },
        { // 5
            type: `normal`,
            enemies: [
                {
                    enemy: `scorpion`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
        { // 6
            type: `normal`,
            enemies: [
                {
                    enemy: `spider`,
                    lvl: 1,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 3,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 7
            type: `normal`,
            enemies: [
                {
                    enemy: `snake`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 2,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 3,
                    quantity: 2,
                    location: `backline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 2,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 8
            type: `boss`,
            enemies: [
                {
                    enemy: `snake`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `scorpion`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `snake`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `spider`,
                    lvl: 1,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `shadowBat`,
                    lvl: 3,
                    quantity: 2,
                    location: `backline`,
                },
                {
                    enemy: `spider`,
                    lvl: 1,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
    ],
};

const macelineFactory = {
    id: `macelineFactory`,
    name: `MacELine™ Factory`,
    outerBac: `assets/MacELineFactory.jpeg`,
    innerBac: `assets/factoryBackground.jpeg`,
    waves: [
        { // 1
            type: `normal`,
            enemies: [
                {
                    enemy: `macelineGuard`,
                    lvl: 0,
                    quantity: 2,
                    location: `frontline`,
                },
            ],
        },
        { // 2
            type: `normal`,
            enemies: [
                {
                    enemy: `macelineGuard`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `securityDrone`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 3
            type: `normal`,
            enemies: [
                {
                    enemy: `securityDrone`,
                    lvl: 0,
                    quantity: 4,
                    location: `backline`,
                },
            ],
        },
        { // 4
            type: `big`,
            enemies: [
                {
                    enemy: `macelineWorker`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `assembler`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 5
            type: `normal`,
            enemies: [
                {
                    enemy: `scrapBotMelee`,
                    lvl: 0,
                    quantity: 6,
                    location: `frontline`,
                },
                {
                    enemy: `scrapBotRanged`,
                    lvl: 0,
                    quantity: 6,
                    location: `backline`,
                },
            ],
        },
        { // 6
            type: `normal`,
            enemies: [
                {
                    enemy: `macelineWorker`,
                    lvl: 0,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `securityDrone`,
                    lvl: 0,
                    quantity: 2,
                    location: `backline`,
                },
            ],
        },
        { // 7
            type: `normal`,
            enemies: [
                {
                    enemy: `macelineGuard`,
                    lvl: 1,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `macelineWorker`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `macelineGuard`,
                    lvl: 1,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `scrapBotRanged`,
                    lvl: 0,
                    quantity: 5,
                    location: `backline`,
                },
            ],
        },
        { // 8
            type: `big`,
            enemies: [
                {
                    enemy: `securityMech`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `assembler`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 9
            type: `normal`,
            enemies: [
                {
                    enemy: `macelineWorker`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `securityMech`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `macelineWorker`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `securityDrone`,
                    lvl: 0,
                    quantity: 4,
                    location: `backline`,
                },
            ],
        },
        { // 10
            type: `normal`,
            enemies: [
                {
                    enemy: `macelineWorker`,
                    lvl: 2,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `assembler`,
                    lvl: 0,
                    quantity: 3,
                    location: `backline`,
                },
            ],
        },
        { // 11
            type: `normal`,
            enemies: [
                {
                    enemy: `securityMech`,
                    lvl: 1,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `macelineWorker`,
                    lvl: 2,
                    quantity: 3,
                    location: `backline`,
                },
            ],
        },
        { // 12
            type: `big`,
            enemies: [
                {
                    enemy: `assembler`,
                    lvl: 0,
                    quantity: 6,
                    location: `backline`,
                },
            ],
        },
        { // 13
            type: `normal`,
            enemies: [
                {
                    enemy: `macelineWorker`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `securityMech`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `macelineWorker`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `securityDrone`,
                    lvl: 0,
                    quantity: 4,
                    location: `backline`,
                },
            ],
        },
        { // 14
            type: `normal`,
            enemies: [
                {
                    enemy: `macelineWorker`,
                    lvl: 2,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `assembler`,
                    lvl: 0,
                    quantity: 3,
                    location: `backline`,
                },
            ],
        },
        { // 15
            type: `normal`,
            enemies: [
                {
                    enemy: `securityMech`,
                    lvl: 1,
                    quantity: 2,
                    location: `frontline`,
                },
                {
                    enemy: `macelineWorker`,
                    lvl: 2,
                    quantity: 3,
                    location: `backline`,
                },
            ],
        },
        { // 16
            type: `boss`,
            enemies: [
                {
                    enemy: `securityMech`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `assembler`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `mace`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `assembler`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
    ],
};

const militaryBase = {
    id: `militaryBase`,
    name: `Terrorist Base`,
    outerBac: `assets/militaryBase.jpeg`,
    innerBac: `assets/desert.jpeg`,
    waves: [
        { // 1
            type: `normal`,
            enemies: [
                {
                    enemy: `terrorist`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
        { // 2
            type: `normal`,
            enemies: [
                {
                    enemy: `terrorist`,
                    lvl: 1,
                    quantity: 2,
                    location: `frontline`,
                },
            ],
        },
        { // 3
            type: `normal`,
            enemies: [
                {
                    enemy: `terrorist`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `bomber`,
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
                    enemy: `bomber`,
                    lvl: 0,
                    quantity: 6,
                    location: `frontline`,
                },
            ],
        },
        { // 5
            type: `normal`,
            enemies: [
                {
                    enemy: `terrorist`,
                    lvl: 2,
                    quantity: 3,
                    location: `frontline`,
                },
            ],
        },
        { // 6
            type: `normal`,
            enemies: [
                {
                    enemy: `terroristRobot`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
        { // 7
            type: `normal`,
            enemies: [
                {
                    enemy: `terrorist`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `terroristRobot`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `terrorist`,
                    lvl: 1,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `bomber`,
                    lvl: 0,
                    quantity: 2,
                    location: `backline`,
                },
            ],
        },
        { // 8
            type: `big`,
            enemies: [
                {
                    enemy: `terrorist`,
                    lvl: 2,
                    quantity: 6,
                    location: `frontline`,
                },
                {
                    enemy: `terroristRobot`,
                    lvl: 0,
                    quantity: 6,
                    location: `backline`,
                },
            ],
        },
        { // 9
            type: `normal`,
            enemies: [
                {
                    enemy: `reaperDrone`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
        { // 10
            type: `normal`,
            enemies: [
                {
                    enemy: `terrorist`,
                    lvl: 2,
                    quantity: 6,
                    location: `frontline`,
                },
                {
                    enemy: `reaperDrone`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
        { // 11
            type: `normal`,
            enemies: [
                {
                    enemy: `securityMech`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `terroristRobot`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `securityMech`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
                {
                    enemy: `reaperDrone`,
                    lvl: 0,
                    quantity: 2,
                    location: `backline`,
                },
            ],
        },
        { // 12
            type: `boss`,
            enemies: [
                {
                    enemy: `terrorist`,
                    lvl: 3,
                    quantity: 6,
                    location: `frontline`,
                },
                {
                    enemy: `reaperDrone`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `redacted`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
                {
                    enemy: `reaperDrone`,
                    lvl: 0,
                    quantity: 1,
                    location: `backline`,
                },
            ],
        },
    ],
};

const chickenLake = {
    id: `debugDungeon`,
    name: `Lake of Chimkin`,
    outerBac: `assets/lake.jpeg`,
    innerBac: `assets/rockyLake.jpeg`,
    waves: [
        { // 1
            type: `boss`,
            enemies: [
                {
                    enemy: `chickenWeaker`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
        { // 2
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
        { // 3
            type: `boss`,
            enemies: [
                {
                    enemy: `stronkChicken`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
        { // 4
            type: `boss`,
            enemies: [
                {
                    enemy: `moreStronkChicken`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
        { // 5
            type: `boss`,
            enemies: [
                {
                    enemy: `stronkestChicken`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
    ],
};

const debugDungeon = {
    id: `debugDungeon`,
    name: `Debug Dungeon`,
    outerBac: `assets/VScodeBackgroundGrey.png`,
    innerBac: `assets/VScodeBackgroundGrey.png`,
    waves: [
        { // 1
            type: `boss`,
            enemies: [
                {
                    enemy: `choyu`,
                    lvl: 0,
                    quantity: 1,
                    location: `frontline`,
                },
            ],
        },
    ],
};

const gachaGameDungeons = [goblinDen, shadowCavern, macelineFactory, militaryBase, dragonPeaks, chickenLake, debugDungeon];
export {gachaGameDungeons};