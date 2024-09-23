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

const hand = 'hand';
const body = 'body';

const healthPots = [
    {
        name: `Crude Health Potion`,
        displayName: `Health Pot`,
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
         quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Lesser Health Potion`,
        displayName: `Health Pot`,
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
        isReward: true,
    },
    {
        name: `Mediocre Health Potion`,
        displayName: `Health Pot`,
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
        isReward: true,
    },
    {
        name: `Potion of Regeneration`,
        displayName: `Regen Pot`,
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
        isReward: true,
    },
    {
        name: `Greater Health Potion`,
        displayName: `Health Pot`,
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
        isReward: true,
    },
    {
        name: `Superior Health Potion`,
        displayName: `Health Pot`,
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
        isReward: true,
    },
    {
        name: `Ascended Health Potion`,
        displayName: `Health Pot`,
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
        isReward: true,
    },
];

const buffPots = [
    {
        name: `Lesser Reinforcement Potion`,
        displayName: `Defence Pot`,
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
        isReward: true,
    },
    {
        name: `Greater Reinforcement Potion`,
        displayName: `Defence Pot`,
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
        isReward: true,
    },
    {
        name: `Crude Mana Potion`,
        displayName: `Mana Pot`,
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
        isReward: true,
    },
    {
        name: `Lesser Mana Potion`,
        displayName: `Mana Pot`,
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
        isReward: true,
    },
    {
        name: `Mediocre Mana Potion`,
        displayName: `Mana Pot`,
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
        isReward: true,
    },
    {
        name: `Greater Mana Potion`,
        displayName: `Mana Pot`,
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
        isReward: true,
    },
    {
        name: `Superior Mana Potion`,
        displayName: `Mana Pot`,
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
        isReward: true,
    },
];

const offensiveItems = [
    {
        name: `Lesser Lightning Spell`,
        displayName: `Lightning`,
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
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Greater Lightning Spell`,
        displayName: `Lightning`,
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
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Ascended Lightning Spell`,
        displayName: `Lightning`,
        description: `A bottle of pure lightning elemental mana that unleashes a storm of destructive energy when broken.`,
        rarity: G,
        pfp: `assets/pot13.jpeg`,
        useable: true,
        effects: [{effect: 'ascendedLightningSpell', chance: 100}],
        hitEffect: `lightning`,
        purchaceable: true,
        purchacePrice: 25000,
        sellable: true,
        sellPrice: 7500,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Poison Vial`,
        displayName: `Poison Vial`,
        description: `A vial of posionous gas that isn't very nice to inhale.`,
        rarity: SR,
        pfp: `assets/pot15.jpeg`,
        useable: true,
        effects: [{effect: 'poisonPotion', chance: 100}],
        hitEffect: `poisonUp`,
        purchaceable: true,
        purchacePrice: 1500,
        sellable: true,
        sellPrice: 400,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Terrorist Bomb`,
        displayName: `Bomb`,
        description: `A bomb commonly used by terrorists.`,
        rarity: M,
        pfp: `assets/terroristBomb.jpeg`,
        useable: true,
        effects: [{effect: 'terroristBomb', chance: 100}],
        hitEffect: `explosion`,
        purchaceable: true,
        purchacePrice: 15000,
        sellable: false,
        sellPrice: 0,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Terrorist Nuke`,
        displayName: `Nuke`,
        description: `A mini nuke commonly used by terrorists.`,
        rarity: EX,
        pfp: `assets/terroristNuke.jpeg`,
        useable: true,
        effects: [{effect: 'terroristNuke', chance: 100}],
        hitEffect: `explosion`,
        purchaceable: true,
        purchacePrice: 500000,
        sellable: false,
        sellPrice: 0,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
];

const stones = [
    {
        name: `Crude Magic Stone`,
        displayName: `Magic Stone`,
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
        name: `Low Grade Magic Stone`,
        displayName: `Magic Stone`,
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
        name: `Medium Grade Magic Stone`,
        displayName: `Magic Stone`,
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
        name: `High Grade Magic Stone`,
        displayName: `Magic Stone`,
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
        name: `Perfected Magic Stone`,
        displayName: `Magic Stone`,
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

const misc = [
    {
        name: `Gold Bars`,
        displayName: `Gold Bars`,
        description: `Very expensive. Would make a good investment if the stock market is ever added to the game (it will not be). `,
        rarity: L,
        pfp: `assets/gold.jpeg`,
        useable: false,
        effects: [],
        purchaceable: true,
        purchacePrice: 250000,
        sellable: true,
        sellPrice: 250000,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Roast Chmkin`,
        displayName: `Chimkin`,
        description: `A delicious roast chicken prepared by π-thagoreas herself. This meal restores both health and mana.`,
        rarity: UC,
        pfp: `assets/roastChicken.jpeg`,
        useable: true,
        effects: [{effect: 'lesserInstantHealth', chance: 100}, {effect: 'lesserInstantMana', chance: 100}],
        hitEffect: `hpUp`,
        purchaceable: false,
        purchacePrice: 0,
        sellable: false,
        sellPrice: 0,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Amulet of Protection`,
        displayName: `Amulet`,
        description: `Originally created and owned by WSM, this magical amulet was stolen by MacELine™ and mass produced. It can protect the user from almost all attacks but unlike the original, will shatter after some time.`,
        rarity: SR,
        pfp: `assets/amulet.jpeg`,
        useable: true,
        effects: [{effect: 'greaterRaiseGuard', chance: 100}],
        hitEffect: `defUp`,
        purchaceable: true,
        purchacePrice: 2000,
        sellable: true,
        sellPrice: 750,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `MacELine™ Steroids`,
        displayName: `Steroids`,
        description: `After a visit to Doctor Prawns' clinic, MacE had an ephiphany and invented the MacELine™ Steroids. These performance enhancing drugs can greatly increase one's strength with no side effects at all and are avalaible at all MacELine™ stores.`,
        rarity: L,
        pfp: `assets/pills.jpeg`,
        useable: true,
        effects: [{effect: 'superiorStrengthEnhancement', chance: 100}],
        hitEffect: `attackUp`,
        purchaceable: true,
        purchacePrice: 5000,
        sellable: true,
        sellPrice: 1500,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `A.J. Sadler Math Specialist Unit 3&4`,
        displayName: `Textbook`,
        description: `This textbook greatly increases the intelligence of the reader but also inflicts significant emotional damage and causes crippling depression.`,
        rarity: G,
        pfp: `assets/specTextbook.png`,
        useable: true,
        effects: [{effect: 'smart', chance: 100}, {effect: 'spec', chance: 100}],
        hitEffect: `attackUp`,
        purchaceable: true,
        purchacePrice: 40000,
        sellable: true,
        sellPrice: 10000,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
];

const weapons = [
    {
        name: `Iron Sword`,
        displayName: `Iron Sword`,
        description: `A crude sword made from low grade iron. It's a little rusty so beware of tetanus.`,
        rarity: N,
        pfp: `assets/ironSword.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [5, 0, 60], magic: [0, 0, -1]},
            def: {physical: [1, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 50,
        sellable: true,
        sellPrice: 10,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Crude Steel Sword`,
        displayName: `Steel Sword`,
        description: `A basic sword made from steel. Sharp and sturdy enough to use in combat.`,
        rarity: N,
        pfp: `assets/steelSword.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [7, 0, 75], magic: [0, 0, -1]},
            def: {physical: [1, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 100,
        sellable: true,
        sellPrice: 25,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Fine Steel Sword`,
        displayName: `Steel Sword`,
        description: `A steel sword forged by a skilled blacksmith. It's sharper than most other swords on the market.`,
        rarity: UC,
        pfp: `assets/steelSword.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [8, 25, 80], magic: [0, 0, -1]},
            def: {physical: [1, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 250,
        sellable: true,
        sellPrice: 50,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Steel Rapier`,
        displayName: `Steel Sword`,
        description: `A lightweight and thin steel blade. Designed for swift light attacks.`,
        rarity: UC,
        pfp: `assets/steelRapier.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [12, 0, 35], magic: [0, 0, -1]},
            def: {physical: [1, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 250,
        sellable: true,
        sellPrice: 50,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Steel Greatsword`,
        displayName: `Steel Sword`,
        description: `A sharp and heavy chunk of metal on a stick. Designed for large powerful swings.`,
        rarity: UC,
        pfp: `assets/steelSword.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [5, 50, 150], magic: [0, 0, -1]},
            def: {physical: [3, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 250,
        sellable: true,
        sellPrice: 50,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Diamond Sword`,
        displayName: `Diamond Sword`,
        description: `Enchanted with Sharpness 32k`,
        rarity: G,
        pfp: `assets/diamondSword.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [1500, 0, -1], magic: [0, 0, -1]},
            def: {physical: [5, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 1000000,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Excaliber`,
        displayName: `Excaliber`,
        description: `A legendary sword wielded by the hero. Posessing this sword grants the wielder plot armour.`,
        rarity: M,
        pfp: `assets/sword.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [20, 45, 1000], magic: [0, 10, -1]},
            def: {physical: [10, 0], magic: [0, 0]},
            stat: {
                str: 1,
                int: 100,
                hp: [0, 2], // double health
                mp: [0, 2], // double mana
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 1000000,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Demon Sword`,
        displayName: `Demon Sword`,
        description: `A demonic sword wielded by a bad guy. It grants the wielder great power at a cost.`,
        rarity: M,
        pfp: `assets/sword.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [25, 60, 1250], magic: [5, 25, -1]},
            def: {physical: [15, 0], magic: [0, 0]},
            stat: {
                str: 1.5,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: -10, // take 10 damage every round
                mpReg: -15,   // lose 15 mana every round
            },
            attackEffects: []
        },
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 1000000,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Iphone 14`,
        displayName: `Iphone 14`,
        description: `Has subway surfers installed.`,
        rarity: EX,
        pfp: `assets/phone.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [0, 0, -1], magic: [0, 0, -1]},
            def: {physical: [5, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: -1,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: false,
        purchacePrice: 0,
        sellable: false,
        sellPrice: 0,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },

    {
        name: `Basic Staff`,
        displayName: `Basic Staff`,
        description: `A crude staff made from a tree branch. Can channel magic or be used as a club.`,
        rarity: N,
        pfp: `assets/staff.png`,
        useable: false,
        equipable: true,
        effects: {
            slot: hand,
            atk: {physical: [1, 0, 30], magic: [5, 0, 100]},
            def: {physical: [0, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 50,
        sellable: true,
        sellPrice: 10,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
];

const armours = [
    {
        name: `Cloth Armour`,
        displayName: `Cloth Armour`,
        description: `A simple armour made from cloth. Does not provide much protection but doesn't hinder movement.`,
        rarity: N,
        pfp: `assets/armour1.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: body,
            atk: {physical: [0, 0, -1], magic: [0, 0, -1]},
            def: {physical: [2, 0], magic: [0, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 50,
        sellable: true,
        sellPrice: 10,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Leather Armour`,
        displayName: `Leather Armour`,
        description: `A simple armour made from leather. Does not provide much protection but doesn't hinder movement.`,
        rarity: N,
        pfp: `assets/armour2.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: body,
            atk: {physical: [0, 0, -1], magic: [0, 0, -1]},
            def: {physical: [3, 5], magic: [2, 0]},
            stat: {
                str: 0,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 75,
        sellable: true,
        sellPrice: 15,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Light Iron Armour`,
        displayName: `Light Armour`,
        description: `A lightweight set of iron armour. Provides decent protection but slightly restricts movement.`,
        rarity: N,
        pfp: `assets/armour3.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: body,
            atk: {physical: [0, 0, -1], magic: [0, 0, -1]},
            def: {physical: [7, 5], magic: [3, 5]},
            stat: {
                str: -0.1, // reduce strength by 10%
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 150,
        sellable: true,
        sellPrice: 25,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Iron Armour`,
        displayName: `Plate Armour`,
        description: `A full set of iron plate armour. Provides decent protection but slightly restricts movement.`,
        rarity: N,
        pfp: `assets/armour3.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: body,
            atk: {physical: [0, 0, -1], magic: [0, 0, -1]},
            def: {physical: [10, 15], magic: [5, 10]},
            stat: {
                str: -0.15,
                int: 0,
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 0,
            },
            attackEffects: []
        },
        purchaceable: true,
        purchacePrice: 250,
        sellable: true,
        sellPrice: 50,
        quantity: 1,
        stackSize: 999999999,
        isReward: false,
    },
    {
        name: `Plot Armour`,
        displayName: `Plot Armour`,
        description: `When the protagonist really needs to not die.`,
        rarity: EX,
        pfp: `assets/armour3.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: body,
            atk: {physical: [0, 0, -1], magic: [0, 0, -1]},
            def: {physical: [0, 100], magic: [0, 100]},
            stat: {
                str: 100,  // increase strength by 100 times
                int: 10000,   // increase intelligence by 100 times
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 100, // regenerate 100 hp every round
                mpReg: 100, // regenerate 100 extra mp every round
            },
            attackEffects: []
        },
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 100000,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
    {
        name: `Bikini Armour`,
        displayName: `Bikini Armour`,
        description: `Very revealing. True gamers will put on anything that has marginally better stats.`,
        rarity: EX,
        pfp: `assets/armour3.jpeg`,
        useable: false,
        equipable: true,
        effects: {
            slot: body,
            atk: {physical: [0, 0, -1], magic: [0, 0, -1]},
            def: {physical: [225, 25], magic: [150, 25]},
            stat: {
                str: 0.25, // increase strength by 25%
                int: 25,   // increase intelligence by 25%
                hp: [0, 0],
                mp: [0, 0],
                hpReg: 0,
                mpReg: 25, // regenerate 25 extra mp every round
            },
            attackEffects: []
        },
        purchaceable: false,
        purchacePrice: 0,
        sellable: true,
        sellPrice: 100000,
        quantity: 1,
        stackSize: 999999999,
        isReward: true,
    },
];

const gachaGameDrops = {
    dungeon: {
        normal: [{type: exp, quantity: 1000, chance: 100}, {type: gold, quantity: 100, chance: 100}],
        big: [{type: exp, quantity: 2500, chance: 100}, {type: gold, quantity: 250, chance: 100}],
        boss: [{type: exp, quantity: 10000, chance: 100}, {type: gold, quantity: 1000, chance: 100}],
    },
    clear: {
        goblinDen: [{type: exp, quantity: 7500, chance: 100}, {type: gold, quantity: 1000, chance: 100}],
        shadowCavern: [{type: exp, quantity: 10000, chance: 100}, {type: gold, quantity: 1000, chance: 100}],
        militaryBase: [{type: exp, quantity: 20000, chance: 100}, {type: gold, quantity: 2000, chance: 100}],
        dragonPeaks: [{type: exp, quantity: 50000, chance: 100}, {type: gold, quantity: 10000, chance: 100}],
        macelineFactory: [{type: exp, quantity: 25000, chance: 100}, {type: gold, quantity: 5000, chance: 100}],
        chickenLake: [{type: exp, quantity: 250000, chance: 100}, {type: gold, quantity: 10000, chance: 100}],
        debugDungeon: [{type: exp, quantity: 1000000, chance: 100}],

        goblinDenFirst: [{type: exp, quantity: 50000, chance: 100}],
        shadowCavernFirst: [{type: exp, quantity: 25000, chance: 100}],
        militaryBaseFirst: [{type: exp, quantity: 50000, chance: 100}, {type: gold, quantity: 2000, chance: 100}],
        dragonPeaksFirst: [{type: exp, quantity: 100000, chance: 100}, {type: gold, quantity: 10000, chance: 100}],
        macelineFactoryFirst: [{type: exp, quantity: 75000, chance: 100}, {type: gold, quantity: 10000, chance: 100}],
        chickenLakeFirst: [{type: exp, quantity: 1000000, chance: 100}, {type: gold, quantity: 50000, chance: 100}],
        debugDungeonFirst: [{type: exp, quantity: 1000000, chance: 100}],
    }, 
    enemy: {
        goblinGrunt: [{type: exp, quantity: 100, chance: 100}, {type: gold, quantity: 25, chance: 100}, {type: item, quantity: 1, chance: 25, item: 'stone1'}],
        goblinArcher: [{type: exp, quantity: 150, chance: 100}, {type: gold, quantity: 30, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone1'}],
        goblinWarrior: [{type: exp, quantity: 300, chance: 100}, {type: gold, quantity: 50, chance: 100}, {type: item, quantity: 1, chance: 75, item: 'stone1'}],
        goblinGuard: [{type: exp, quantity: 500, chance: 100}, {type: gold, quantity: 90, chance: 100}, {type: item, quantity: 1, chance: 75, item: 'stone1'}],
        goblinBoss: [{type: exp, quantity: 2500, chance: 100}, {type: gold, quantity: 400, chance: 100}, {type: item, quantity: 1, chance: 100, item: 'stone2'}],

        dragonGreen: [{type: exp, quantity: 2500, chance: 100}, {type: gold, quantity: 500, chance: 100}, {type: item, quantity: 1, chance: 25, item: 'stone4'}],
        dragonRainbow: [{type: exp, quantity: 7500, chance: 100}, {type: gold, quantity: 1000, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone4'}],
        dragonBlue: [{type: exp, quantity: 15000, chance: 100}, {type: gold, quantity: 3000, chance: 100}, {type: item, quantity: 1, chance: 90, item: 'stone4'}],
        dragonRed: [{type: exp, quantity: 25000, chance: 100}, {type: gold, quantity: 5000, chance: 100}, {type: item, quantity: 1, chance: 75, item: 'stone4'}],
        dragonBlack: [{type: exp, quantity: 75000, chance: 100}, {type: gold, quantity: 10000, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone5'}],
        dragonRedBig: [{type: exp, quantity: 75000, chance: 100}, {type: gold, quantity: 10000, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone5'}],

        shadowBat: [{type: exp, quantity: 250, chance: 100}, {type: gold, quantity: 25, chance: 100}, {type: item, quantity: 1, chance: 25, item: 'stone1'}],
        spider: [{type: exp, quantity: 500, chance: 100}, {type: gold, quantity: 50, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone1'}],
        scorpion: [{type: exp, quantity: 1000, chance: 100}, {type: gold, quantity: 150, chance: 100}, {type: item, quantity: 1, chance: 40, item: 'stone2'}],
        snake: [{type: exp, quantity: 1000, chance: 100}, {type: gold, quantity: 150, chance: 100}, {type: item, quantity: 1, chance: 60, item: 'stone2'}],

        chickenWeaker: [{type: exp, quantity: 10000, chance: 100}, {type: gold, quantity: 2500, chance: 100}, {type: item, quantity: 1, chance: 10, item: 'stone5'}],
        chicken: [{type: exp, quantity: 25000, chance: 100}, {type: gold, quantity: 5000, chance: 100}, {type: item, quantity: 1, chance: 25, item: 'stone5'}],
        chickenStrong: [{type: exp, quantity: 100000, chance: 100}, {type: gold, quantity: 10000, chance: 100}, {type: item, quantity: 1, chance: 50, item: 'stone5'}],
        chickenStronger: [{type: exp, quantity: 250000, chance: 100}, {type: gold, quantity: 20000, chance: 100}, {type: item, quantity: 1, chance: 75, item: 'stone5'}],
        chickenVeryStrong: [{type: exp, quantity: 750000, chance: 100}, {type: gold, quantity: 40000, chance: 100}, {type: item, quantity: 1, chance: 100, item: 'stone5'}],
        chickenStrongest: [{type: exp, quantity: 5000000, chance: 100}, {type: gold, quantity: 100000, chance: 100}, {type: item, quantity: 1, chance: 100, item: 'stone5'}],

        scrapBotMelee: [{type: exp, quantity: 100, chance: 100}, {type: gold, quantity: 10, chance: 100}],
        scrapBotRanged: [{type: exp, quantity: 100, chance: 100}, {type: gold, quantity: 10, chance: 100}],
        macelineGuard: [{type: exp, quantity: 1000, chance: 100}, {type: gold, quantity: 100, chance: 100}],
        securityDrone: [{type: exp, quantity: 2000, chance: 100}, {type: gold, quantity: 250, chance: 100}],
        assemblingMachine: [{type: exp, quantity: 6000, chance: 100}, {type: gold, quantity: 500, chance: 100}],
        macelineWorker: [{type: exp, quantity: 7500, chance: 100}, {type: gold, quantity: 1000, chance: 100}],
        securityMech: [{type: exp, quantity: 15000, chance: 100}, {type: gold, quantity: 5000, chance: 100}],
        macelinePrototype: [{type: exp, quantity: 30000, chance: 100}, {type: gold, quantity: 10000, chance: 100}],
        mace: [{type: exp, quantity: 50000, chance: 100}, {type: gold, quantity: 20000, chance: 100}],

        terrorist: [{type: exp, quantity: 750, chance: 100}, {type: gold, quantity: 100, chance: 100}],
        bomber: [{type: exp, quantity: 1000, chance: 100}, {type: gold, quantity: 100, chance: 100}],
        terroristRobot: [{type: exp, quantity: 2000, chance: 100}, {type: gold, quantity: 500, chance: 100}],
        reaperDrone: [{type: exp, quantity: 7500, chance: 100}, {type: gold, quantity: 2500, chance: 100}],
        redacted: [{type: exp, quantity: 25000, chance: 100}, {type: gold, quantity: 10000, chance: 100}],

        choyu: [{type: exp, quantity: 5000000, chance: 100}, {type: gold, quantity: 1000000, chance: 100}],
    },
};

const gachaGameAllItems = [].concat(healthPots, buffPots, offensiveItems, stones, weapons, armours, misc);
const gachaGameRewardItems = [];
for (let i = 0; i <= 8; i++) {
    gachaGameRewardItems.push([]);
}
for (let i = 0; i < gachaGameAllItems.length; i++) {
    if (gachaGameAllItems[i].isReward) gachaGameRewardItems[gachaGameAllItems[i].rarity].push(JSON.parse(JSON.stringify(gachaGameAllItems[i])));
}

export {gachaGameRewardItems, gachaGameAllItems, gachaGameDrops};