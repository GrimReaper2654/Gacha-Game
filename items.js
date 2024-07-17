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

const gold = 'gold';
const exp = 'exp';
const item = 'item';

const healthPots = [
    {
        id: `potHp1`,
        name: `Crude Health Potion`,
        displayName: `Health Potion\n `,
        description: `A concoction of various herbs that has some healing properties. The effects are weak, but it's better than nothing.`,
        rarity: N,
        pfp: `assets/pot2.jpeg`,
        useable: true,
        effects: [{effect: 'minorInstantHealth', chance: 100}],
        hitEffect: `hpUp`,
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 10,
        quantity: 0,
        stackSize: 999999999,
    },
    {
        id: `potHp2`,
        name: `Lesser Health Potion`,
        displayName: `Health Potion\n `,
        description: `A poorly crafted health potion crafted with low grade ingredients. It might just be enough for your troops to withstand an extra hit or two.`,
        rarity: UC,
        pfp: `assets/pot7.jpeg`,
        useable: true,
        effects: [{effect: 'lesserInstantHealth', chance: 100}],
        hitEffect: `hpUp`,
        purchaceable: true,
        purchacePrice: 100,
        sellable: true,
        sellPrice: 25,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potHp3`,
        name: `Mediocre Health Potion`,
        displayName: `Health Potion\n `,
        description: `The standard health potion sold in most high end stores. Very useful but expensive.`,
        rarity: R,
        pfp: `assets/pot8.jpeg`,
        useable: true,
        effects: [{effect: 'mediumInstantHealth', chance: 100}],
        hitEffect: `hpUp`,
        purchaceable: true,
        purchacePrice: 400,
        sellable: true,
        sellPrice: 150,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potHpRgn1`,
        name: `Potion of Regeneration`,
        displayName: `Regen Potion\n `,
        description: `An experimental healing potion designed by a master alchemist. The consumer will continuously regenerate health for a lengthy period of time.`,
        rarity: R,
        pfp: `assets/pot5.jpeg`,
        useable: true,
        effects: [{effect: 'lesserInstantHealth', chance: 100}, {effect: 'mediumHealOverTime', chance: 100}],
        hitEffect: `hpUp`,
        purchaceable: true,
        purchacePrice: 300,
        sellable: true,
        sellPrice: 125,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potHp4`,
        name: `Greater Health Potion`,
        displayName: `Health Potion\n `,
        description: `An incredible healing potion refined for years by a master alchemist. A single potion can heal even the most grevious injuries and replenishes lost mana.`,
        rarity: E,
        pfp: `assets/pot1.jpeg`,
        useable: true,
        effects: [{effect: 'greaterInstantHealth', chance: 100}, {effect: 'lesserInstantMana', chance: 100}],
        hitEffect: `hpUp`,
        purchaceable: true,
        purchacePrice: 2500,
        sellable: true,
        sellPrice: 1000,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potHp5`,
        name: `Superior Health Potion`,
        displayName: `Health Potion\n `,
        description: `A great alchemist didicated their entire lives to the refinement of this incredible healing potion. There are so few of them in existance that even the largest kingdoms only have a few stockpiled in their treasury.`,
        rarity: L,
        pfp: `assets/pot4.jpeg`,
        useable: true,
        effects: [{effect: 'superiorInstantHealth', chance: 100}, {effect: 'mediumHealOverTime', chance: 100}, {effect: 'mediumInstantMana', chance: 100}],
        hitEffect: `hpUp`,
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 10000,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potHp6`,
        name: `Ascended Health Potion`,
        displayName: `Health Potion\n `,
        description: `A priceless relic from the age of the gods, this potion can bring even the strongest of heroes back to full health. It would surely be worth millions of gold.`,
        rarity: G,
        pfp: `assets/pot10.jpeg`,
        useable: true,
        effects: [{effect: 'ascendedInstantHealth', chance: 100}, {effect: 'ascendedHealOverTime', chance: 100}, {effect: 'mediumInstantMana', chance: 100}],
        hitEffect: `hpUp`,
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 1000000,
        quantity: 1,
        stackSize: 999999999,
    },
];

const buffPots = [
    {
        id: `potDef1`,
        name: `Lesser Reinforcement Potion`,
        displayName: `Reinforcement Potion`,
        description: `Consuming this potion grants a significant increase in resistance against all attacks. Does not come with pain surpression.`,
        rarity: R,
        pfp: `assets/pot17.jpeg`,
        useable: true,
        effects: [{effect: 'lesserResistDamage', chance: 100}],
        hitEffect: `defUp`,
        purchaceable: true,
        purchacePrice: 500,
        sellable: true,
        sellPrice: 100,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potDef2`,
        name: `Greater Reinforcement Potion`,
        displayName: `Reinforcement Potion`,
        description: `Consuming this potion grants a significant increase in resistance against all attacks. Does not come with pain surpression.`,
        rarity: E,
        pfp: `assets/pot16.jpeg`,
        useable: true,
        effects: [{effect: 'greaterResistDamage', chance: 100}],
        hitEffect: `defUp`,
        purchaceable: true,
        purchacePrice: 2000,
        sellable: true,
        sellPrice: 500,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potMp1`,
        name: `Crude Mana Potion`,
        displayName: `Mana Potion\n `,
        description: `Condensed mana ready for consumption. Grants mp immediately after use.`,
        rarity: N,
        pfp: `assets/pot19.jpeg`,
        useable: true,
        effects: [{effect: 'minorInstantMana', chance: 100}],
        hitEffect: `mpUp`,
        purchaceable: true,
        purchacePrice: 50,
        sellable: true,
        sellPrice: 10,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potMp2`,
        name: `Lesser Mana Potion`,
        displayName: `Mana Potion\n `,
        description: `Condensed mana ready for consumption. Grants mp immediately after use.`,
        rarity: UC,
        pfp: `assets/pot20.jpeg`,
        useable: true,
        effects: [{effect: 'lesserInstantMana', chance: 100}],
        hitEffect: `mpUp`,
        purchaceable: true,
        purchacePrice: 100,
        sellable: true,
        sellPrice: 25,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potMp3`,
        name: `Mediocre Mana Potion`,
        displayName: `Mana Potion\n `,
        description: `Condensed mana ready for consumption. Grants mp immediately after use.`,
        rarity: R,
        pfp: `assets/pot18.jpeg`,
        useable: true,
        effects: [{effect: 'mediumInstantMana', chance: 100}],
        hitEffect: `mpUp`,
        purchaceable: true,
        purchacePrice: 600,
        sellable: true,
        sellPrice: 100,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potMp4`,
        name: `Greater Mana Potion`,
        displayName: `Mana Potion\n `,
        description: `Condensed mana ready for consumption. Grants mp immediately after use.`,
        rarity: E,
        pfp: `assets/pot21.jpeg`,
        useable: true,
        effects: [{effect: 'greaterInstantMana', chance: 100}],
        hitEffect: `mpUp`,
        purchaceable: true,
        purchacePrice: 2750,
        sellable: true,
        sellPrice: 600,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `potMp4`,
        name: `Superior Mana Potion`,
        displayName: `Mana Potion\n `,
        description: `Condensed mana ready for consumption. Grants mp immediately after use.`,
        rarity: L,
        pfp: `assets/pot22.jpeg`,
        useable: true,
        effects: [{effect: 'superiorInstantMana', chance: 100}],
        hitEffect: `mpUp`,
        purchaceable: true,
        purchacePrice: 7500,
        sellable: true,
        sellPrice: 2000,
        quantity: 1,
        stackSize: 999999999,
    },
];

const offensiveItems = [
    {
        id: `lightning1`,
        name: `Lesser Lightning Spell`,
        displayName: `Lightning Spell`,
        description: `A vial of lightning elemental mana that has a tendency to explode.`,
        rarity: R,
        pfp: `assets/pot12.jpeg`,
        useable: true,
        effects: [{effect: 'lesserLightningSpell', chance: 100}],
        hitEffect: `lightning`,
        purchaceable: true,
        purchacePrice: 500,
        sellable: true,
        sellPrice: 200,
        quantity: 0,
        stackSize: 999999999,
    },
    {
        id: `lightning2`,
        name: `Greater Lightning Spell`,
        displayName: `Lightning Spell`,
        description: `A bottle of potent lightning elemental mana primed to blast enemies into bits.`,
        rarity: E,
        pfp: `assets/pot14.jpeg`,
        useable: true,
        effects: [{effect: 'greaterLightningSpell', chance: 100}],
        hitEffect: `lightning`,
        purchaceable: true,
        purchacePrice: 3000,
        sellable: true,
        sellPrice: 1000,
        quantity: 0,
        stackSize: 999999999,
    },
    {
        id: `lightning3`,
        name: `Ascended Lightning Spell`,
        displayName: `Lightning Spell`,
        description: `A bottle of pure lightning elemental mana that unleashes a storm of destructive energy when broken.`,
        rarity: G,
        pfp: `assets/pot13.jpeg`,
        useable: true,
        effects: [{effect: 'ascendedLightningSpell', chance: 100}],
        hitEffect: `lightning`,
        purchaceable: true,
        purchacePrice: 2500000,
        sellable: true,
        sellPrice: 750000,
        quantity: 0,
        stackSize: 999999999,
    },
    {
        id: `poison`,
        name: `Poison Vial`,
        displayName: `Poison Vial\n `,
        description: `A vial of posionous gas that isn't very nice to inhale.`,
        rarity: SR,
        pfp: `assets/pot15.jpeg`,
        useable: true,
        effects: [{effect: 'greaterPoison', chance: 100}],
        hitEffect: `poisonUp`,
        purchaceable: true,
        purchacePrice: 1500,
        sellable: true,
        sellPrice: 400,
        quantity: 0,
        stackSize: 999999999,
    },
    {
        id: `terroristBomb`,
        name: `Terrorist Bomb`,
        displayName: `Terrorist Bomb\n `,
        description: `A bomb commonly used by terrorists.`,
        rarity: EX,
        pfp: `assets/terroristBomb.png`,
        useable: true,
        effects: [{effect: 'terroristBomb', chance: 100}],
        hitEffect: `explosion`,
        purchaceable: true,
        purchacePrice: 25000,
        sellable: false,
        sellPrice: 0,
        quantity: 0,
        stackSize: 999999999,
    },
];

const stones = [
    {
        id: `stone1`,
        name: `Crude Magic Stone`,
        displayName: `Magic Stone\n `,
        description: `A rock that very faintly emits mana. It doesn't look very useful...`,
        rarity: N,
        pfp: `assets/blueRocks.png`,
        useable: false,
        effects: [],
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 20,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `stone2`,
        name: `Low Grade Magic Stone`,
        displayName: `Magic Stone\n `,
        description: `A rock that faintly emits mana. Perhaps it could have some uses.`,
        rarity: UC,
        pfp: `assets/blueRocks.png`,
        useable: false,
        effects: [],
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 100,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `stone3`,
        name: `Medium Grade Magic Stone`,
        displayName: `Magic Stone\n `,
        description: `A beautiful rock with mana swirling within it. This magic stone could be used to forge equipment or brew potions.`,
        rarity: R,
        pfp: `assets/blueRocks.png`,
        useable: false,
        effects: [],
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 600,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `stone4`,
        name: `High Grade Magic Stone`,
        displayName: `Magic Stone\n `,
        description: `A beautiful rock surrounded by an aura of mana. It has many useful magical properties.`,
        rarity: E,
        pfp: `assets/blueRocks.png`,
        useable: false,
        effects: [],
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 2000,
        quantity: 1,
        stackSize: 999999999,
    },
    {
        id: `stone5`,
        name: `Perfected Magic Stone`,
        displayName: `Magic Stone\n `,
        description: `A flawless magical stone containing immense mana.`,
        rarity: L,
        pfp: `assets/blueRocks.png`,
        useable: false,
        effects: [],
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 10000,
        quantity: 1,
        stackSize: 999999999,
    },
];

const gachaGameDrops = {
    dungeon: {
        normal: [{type: exp, quantity: 1000, chance: 100}, {type: gold, quantity: 100, chance: 100}],
        big: [{type: exp, quantity: 2500, chance: 100}, {type: gold, quantity: 250, chance: 100}],
        boss: [{type: exp, quantity: 10000, chance: 100}, {type: gold, quantity: 1000, chance: 100}],
    },
    clear: {
        goblinDen: [{type: item, quantity: 1, chance: 100, item: `goblinWarHorn`}],
        shadowCavern: [{type: exp, quantity: 5000, chance: 100}],
        dragonPeaks: [{type: exp, quantity: 25000, chance: 100}, {type: item, quantity: 5, chance: 100, item: `dragonScale`}],
        debugDungeon: [{type: exp, quantity: 100000, chance: 100}, {type: gold, quantity: 5000, chance: 100}],
        
        firstClear: [{type: exp, quantity: 50000, chance: 100}, {type: gold, quantity: 5000, chance: 100}],
    }, 
    enemy: {
        goblinGrunt: [{type: exp, quantity: 100, chance: 100}, {type: item, quantity: 1, chance: 25, item: 'stone1'}],
        goblinArcher: [{type: exp, quantity: 150, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone1'}],
        goblinWarrior: [{type: exp, quantity: 200, chance: 100}, {type: item, quantity: 1, chance: 75, item: 'stone1'}],
        goblinGuard: [{type: exp, quantity: 250, chance: 100}, {type: item, quantity: 1, chance: 75, item: 'stone1'}],
        goblinBoss: [{type: exp, quantity: 1000, chance: 100}, {type: item, quantity: 1, chance: 100, item: 'stone2'}],

        dragonGreen: [{type: exp, quantity: 5000, chance: 100}, {type: item, quantity: 1, chance: 25, item: 'stone4'}],
        dragonRainbow: [{type: exp, quantity: 9000, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone4'}],
        dragonBlue: [{type: exp, quantity: 15000, chance: 100}, {type: item, quantity: 1, chance: 90, item: 'stone4'}],
        dragonRed: [{type: exp, quantity: 25000, chance: 100}, {type: item, quantity: 1, chance: 75, item: 'stone4'}],
        dragonBlack: [{type: exp, quantity: 75000, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone5'}],
        dragonRedBig: [{type: exp, quantity: 75000, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone5'}],

        shadowBat: [{type: exp, quantity: 250, chance: 100}, {type: item, quantity: 1, chance: 25, item: 'stone1'}],
        spider: [{type: exp, quantity: 300, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone1'}],
        scorpion: [{type: exp, quantity: 500, chance: 100}, {type: item, quantity: 1, chance: 40, item: 'stone2'}],
        snake: [{type: exp, quantity: 500, chance: 100}, {type: item, quantity: 1, chance: 60, item: 'stone2'}],

        chicken: [{type: exp, quantity: 25000, chance: 100}, {type: item, quantity: 1, chance: 25, item: 'stone5'}],
        chickenStrong: [{type: exp, quantity: 75000, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone5'}],
        chickenVeryStrong: [{type: exp, quantity: 200000, chance: 100}, {type: item, quantity: 1, chance: 75, item: 'stone5'}],
    },
};

const gachaGameItems = [].concat(healthPots, buffPots, offensiveItems, stones);

export {gachaGameItems, gachaGameDrops};