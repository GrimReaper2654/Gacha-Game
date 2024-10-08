/*
------------------------------------------------------Changelog------------------------------------------------------
Rarities:
normal --> uncommon --> rare --> super rare --> epic --> legendary --> mythical --> godly --> EX
grey        green       blue      purple        silver       gold        red      diamond   black
 0            1          2          3             4           5           6         7        8
 x1         x1.3       x1.7       x2.2           x3          x4           x6        x9      

for (let i = 0; i < 250; i++) {
    game.gamestate.player.characters[0].exp += 75; focusCharacter(0); await sleep(10);
}

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

const hand = 'hand';
const body = 'body';

function deepFreeze(obj) {
    let propNames = Object.getOwnPropertyNames(obj);
    for (let name of propNames) {
        let value = obj[name];
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value);
        }
    }
    return Object.freeze(obj);
};

// load data
import {gachaGameData} from "./data.js";
const data = JSON.parse(JSON.stringify(gachaGameData));
data.items = sortInventory(data.items);
deepFreeze(data);
window.data = data;

const game = {
    gamestate: undefined,
    keypresses: [], // obsolete
    mousepos: {x: 0, y: 0}, // obsolete
    forceMobile: false,
    forceDesktop: false,
    altMobile: false,
    particles: {},
    display: {x: window.innerWidth, y: window.innerHeight},
    tempStorage: {},
    debug: false,
}; window.game = game;

// The support functions that might not be necessary
function generateId() {
    const timestamp = Date.now().toString(36); 
    const randomNum = Math.random().toString(36).slice(2, 11);
    return `${timestamp}-${randomNum}`; 
}; window.generateId = generateId;

function randchoice(list, remove = false) { // chose 1 from a list and update list
    let length = list.length;
    let choice = randint(0, length-1);
    if (remove) {
        let chosen = list.splice(choice, 1);
        return [chosen, list];
    }
    return list[choice];
}; window.randchoice = randchoice;

function randint(min, max, notequalto=false) {
    if (max - min < 1) {
        return min;
    }
    
    var gen;
    var i = 0;
    do {
        gen = Math.floor(Math.random() * (max - min + 1)) + min;
        i += 1;
        if (i >= 100) {
            console.log('ERROR: could not generate suitable number');
            return gen;
        }
    } while (notequalto && (gen === min || gen === max));
    
    return gen;
}; window.randint = randint;

function randProperty(obj) { // stolen from stack overflow
    var keys = Object.keys(obj);
    return obj[keys[keys.length * Math.random() << 0]];
}; window.randProperty = randProperty;

function replacehtml(element, text) {
    document.getElementById(element).innerHTML = text;
}; window.replacehtml = replacehtml;

function addhtml(element, text) {
    document.getElementById(element).innerHTML = document.getElementById(element).innerHTML + text;
}; window.addhtml = addhtml;

function correctAngle(a) {
    a = a%(Math.PI*2);
    return a;
}; window.correctAngle = correctAngle;

function aim(initial, final) {
    if (initial == final) { 
        return 0;
    }
    let diff = {x: final.x - initial.x, y: initial.y - final.y};
    if (diff.x == 0) {
        if (diff.y > 0) {
            return 0;
        } else {
            return Math.PI;
        }
    } else if (diff.y == 0) {
        if (diff.x > 0) {
            return Math.PI/2;
        } else {
            return 3*Math.PI/2;
        }
    }
    let angle = Math.atan(Math.abs(diff.y / diff.x));
    if (diff.x > 0 && diff.y > 0) {
        return Math.PI/2 - angle;
    } else if (diff.x > 0 && diff.y < 0) {
        return Math.PI/2 + angle;
    } else if (diff.x < 0 && diff.y < 0) {
        return 3*Math.PI/2 - angle;
    } else {
        return 3*Math.PI/2 + angle;
    }
}; window.aim = aim;

function roman(number) {
    if (number <= 0 || number >= 4000) {
        var symbols = ['0','1','2','3','4','5','6','7','8','9','¡','£','¢','∞','§','¶','œ','ß','∂','∫','∆','√','µ','†','¥','ø'];
        return `${randchoice(symbols)}${randchoice(symbols)}${randchoice(symbols)}`;
    }
    
    const romanNumerals = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    
    let romanNumeral = '';
    
    for (let key in romanNumerals) {
        while (number >= romanNumerals[key]) {
            romanNumeral += key;
            number -= romanNumerals[key];
        }
    }
    return romanNumeral;
}; window.roman = roman;

function bigNumber(number) {
    const bacs = [`K`, `M`, `B`, `T`, `q`, `Q`, 's', 'S', 'o', 'n', 'd', 'U', 'D']; // caps out at duodectillion (10^39)
    let bac = ``;
    let i = 0;
    while (number >= 1000) {
        number /= 1000;
        bac = bacs[i]? bacs[i] : '∞';
        i++;
    }
    let a = number >= 10? number >= 100? 1 : 10 : 100;
    return bac == '∞'? bac : `${Math.floor(number*a)/a}${bac}`;
}; window.bigNumber = bigNumber;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}; window.sleep = sleep;

function vMath(v1, v2, mode) { 
    switch (mode) {
        case '||':
        case 'magnitude':
            return Math.sqrt(v1.x**2+v1.y**2);
        case '+': 
        case 'addition':
        case 'add':
            return {x: v1.x+v2.x, y: v1.y+v2.y};
        case '-': 
        case 'subtraction':
        case 'subtract':
            return {x: v1.x-v2.x, y: v1.y-v2.y};
        case '*': 
        case 'x': 
        case 'scalar multiplication':
        case 'multiplication':
        case 'multiply': // v2 is now a scalar
            return {x: v1.x*v2, y: v1.y*v2};
        case '/': 
        case 'division':
        case 'divide': // v2 is now a scalar
            return {x: v1.x/v2, y: v1.y/v2};
        case '•': 
        case '.': 
        case 'dot product': 
            return v1.x * v2.x + v1.y * v2.y;
        case 'projection':
        case 'vector resolute':
        return vMath(v2, vMath(v1, v2, '.')/vMath(v2, null, '||')**2, 'x');
        default:
            console.error('what are you trying to do to to that poor vector?');
    }
}; window.vMath = vMath;

function toComponent(m, r) {
    return {x: m * Math.sin(r), y: -m * Math.cos(r), i: m * Math.sin(r), j: -m * Math.cos(r)};
}; window.toComponent = toComponent;

function toPol(i, j) {
    if (i instanceof Object) {
        if (typeof i.i === 'number') return {m: Math.sqrt(i.i**2+i.j**2), r: aim({x: 0, y: 0}, {x: i.i, y: i.j})};
        return {m: Math.sqrt(i.x**2+i.y**2), r: aim({x: 0, y: 0}, {x: i.x, y: i.y})};
    } 
    return {m: Math.sqrt(i**2+j**2), r: aim({x: 0, y: 0}, {x: i, y: j})};
}; window.toPol = toPol;

// a graveyard of failed getCoords functions
/*
function getCoords(id) {
    const element = document.getElementById(id);
    let rect = element.getBoundingClientRect();
    
    let left = window.pageXOffset || document.documentElement.scrollLeft;
    let top = window.pageYOffset || document.documentElement.scrollTop;
    
    let offsetParent = element;
    while (offsetParent) {
        if (offsetParent.style.position === 'absolute') break;
        left += offsetParent.scrollLeft || 0;
        top += offsetParent.scrollTop || 0;
        left += unPixel(offsetParent.style.left) || 0;
        top += unPixel(offsetParent.style.top) || 0;
        left -= unPixel(offsetParent.style.right) || 0;
        top -= unPixel(offsetParent.style.bottom) || 0;
        offsetParent = offsetParent.offsetParent;
    }

    return { 
        x: rect.left + rect.width / 2 + left, 
        y: rect.top + rect.height / 2 + top
    };
};*/
/*
function getCoords(id) {
    let el = document.getElementById(id);
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { y: _y, x: _x };
}*/
/*

function getCoords(id) {
    const relativeRect = document.getElementById(id).getBoundingClientRect();

    // Calculate the centers relative to the viewport
    const relativeCenterX = relativeRect.left + relativeRect.width / 2;
    const relativeCenterY = relativeRect.top + relativeRect.height / 2;
    
    // Calculate the scroll offsets
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;

    // Calculate the offsets needed to align the centers
    const offsetX = (relativeCenterX + scrollX);
    const offsetY = (relativeCenterY + scrollY);

    return { x: offsetX, y: offsetY };
}*/
// old working version
/*
function getCardCoords(card) { // calculate coordinates manually
    let pos = readID(card.id);
    let coords = {x: 175, y: 0}; // idk why
    //console.log(pos);
    switch (pos.row) {
        case 'eb':
            coords.y += 10;
            break;
        case 'ef':
            coords.y += 220;
            break;
        case 'pf':
            coords.y += document.getElementById('battleScreen').getBoundingClientRect().height - 430;
            break;
        case 'pb':
            coords.y += document.getElementById('battleScreen').getBoundingClientRect().height - 220;
            break;
    }
    coords.x += document.getElementById('battleScreen').getBoundingClientRect().width / 2; // centre
    coords.x -= (150 * game.gamestate.battleState[pos.row].length + 20 * (game.gamestate.battleState[pos.row].length - 1)) / 2; // find position 0
    coords.x += 150 * pos.pos + 20 * pos.pos; // move to correct pos
    //console.log(coords);
    return coords;
};*/

function getCardCoords(card) { // calculate coordinates manually
    //console.log(document.getElementById('battleScreen').getBoundingClientRect().width, document.getElementById('battleScreen').getBoundingClientRect().height);
    let pos = undefined;
    if (card.row && typeof card.pos === 'number') pos = card; // allow directly giving position
    else pos = readID(card.id);
    let coords = {x: -10, y: 0}; // idk why
    //console.log(pos);
    switch (pos.row) {
        case 'eb':
            coords.y += 10;
            break;
        case 'ef':
            coords.y += 220;
            break;
        case 'pf':
            coords.y += document.getElementById('battleScreen').getBoundingClientRect().height - 430;
            break;
        case 'pb':
            coords.y += document.getElementById('battleScreen').getBoundingClientRect().height - 220;
            break;
    }
    coords.x += document.getElementById('battleScreen').getBoundingClientRect().width / 2; // centre
    coords.x -= (150 * game.gamestate.battleState[pos.row].length + 20 * (game.gamestate.battleState[pos.row].length - 1)) / 2; // find position 0
    coords.x += 150 * pos.pos + 20 * pos.pos; // move to correct pos
    //console.log(coords);
    return coords;
}; window.getCardCoords = getCardCoords;

function unPixel(px) {
    return parseFloat(px.slice(0, -2));
}; window.unPixel = unPixel;

// Most of game logic and stuff
window.onkeyup = function(e) {
    game.keypresses[e.key.toLowerCase()] = false; 
};

window.onkeydown = function(e) {
    game.keypresses[e.key.toLowerCase()] = true; 
};

document.addEventListener('mousedown', function(event) {
    if (event.button === 0) { // Check if left mouse button was clicked
        game.keypresses.click = true;
    }
});

document.addEventListener('mouseup', function(event) {
    if (event.button === 0) { // Check if left mouse button was released
        game.keypresses.click = false;
    }
});

window.addEventListener("resize", function () {
    game.display = {x: window.innerWidth, y: window.innerHeight};
    resize();
});

function tellPos(p){
    game.mousepos = {x: p.pageX, y:p.pageY};
}; 

window.addEventListener('mousemove', tellPos, false);

function isMobileDevice() {
    let isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isMobile;
}; window.isMobileDevice = isMobileDevice;

function forceMobile() {
    game.forceMobile = true;
    game.forceDesktop = false;
    resize();
    console.warn(`Device type set to mobile`);
    return true;
}; window.forceMobile = forceMobile;

function forceDesktop() {
    game.forceDesktop = true;
    game.forceMobile = false;
    resize();
    console.warn(`Device type set to desktop`);
    return true;
}; window.forceDesktop = forceDesktop;

function altMobile() {
    game.forceMobile = true;
    game.forceDesktop = false;
    game.altMobile = game.altMobile? false : true;
    resize();
    console.warn(`Toggled alternate mobile view to: ${game.altMobile}`);
    return true;
}; window.altMobile = altMobile;

function sortInventory(list, property='name') {
    let nList = [];
    for (let i = 0; i <= EX; i++) {
        let sList = [];
        for (let j = 0; j < list.length; j++) {
            if (list[j].rarity == i) sList.push(list[j]);
        }
        sList.sort((a,b) => a[property].localeCompare(b[property]));
        for (let j = 0; j < sList.length; j++) {
            nList.push(sList[j]);
        }
    }
    return nList;
}; window.sortInventory = sortInventory;

function calcDamage(character, skill) {
    console.log(character);
    if (skill.dmg == 0) return 0;
    let weaponType = skill.weaponType? skill.weaponType : skill.type;
    let dmg = skill.dmg;
    let isNegative = false;
    if (dmg < 0) {
        dmg *= -1;
        isNegative = true;
    }
    console.log(dmg);
    if (weaponType == physical || weaponType == magic) {
        dmg += weaponType == physical? character.physDmgIncrease[0] : character.magiDmgIncrease[0];
        console.log(dmg);
        dmg *= weaponType == physical? character.physDmgIncrease[1] : character.magiDmgIncrease[1];
        console.log(dmg);
        dmg = Math.min(dmg, weaponType == physical? character.physDmgIncrease[2] : character.magiDmgIncrease[2]);
    }
    console.log(dmg);
    switch (skill.multiplier) {
        case str:
            dmg *= character.str;
            break;
        case int:
            dmg *= character.int/100;
            break;
    }
    console.log(dmg);
    if (isNegative) dmg *= -1;
    return Math.floor(dmg);
}; window.calcDamage = calcDamage;

function getCompactStats(item) {
    if (item) return `<strong>${item.displayName}</strong><br>Stats:<br><img src="assets/redSword.png" class="smallIcon"> ATK: ${item.effects.atk.physical[0] >= 0? '+': '-'}${bigNumber(item.effects.atk.physical[0])} ${item.effects.atk.physical[1] >= 0? '+': '-'}${item.effects.atk.physical[1]}%${item.effects.atk.physical[2] > 0? ` <${bigNumber(item.effects.atk.physical[2])}` : ``}<br><img src="assets/blueStar.png" class="smallIcon"> ATK: ${item.effects.atk.magic[0] >= 0? '+': '-'}${bigNumber(item.effects.atk.magic[0])} ${item.effects.atk.magic[1] >= 0? '+': '-'}${item.effects.atk.magic[1]}%${item.effects.atk.magic[2] > 0? ` <${bigNumber(item.effects.atk.magic[2])}` : ``}<br><img src="assets/shield.png" class="smallIcon"> DEF: ${item.effects.def.physical[0] >= 0? '+': '-'}${bigNumber(item.effects.def.physical[0])} +${item.effects.def.physical[1]}%<br><img src="assets/blueShield.png" class="smallIcon"> DEF: ${item.effects.def.magic[0] >= 0? '+': '-'}${bigNumber(item.effects.def.magic[0])} +${item.effects.def.magic[1]}%<br>`;
}; window.getCompactStats = getCompactStats;

function adjustedStats(character) {
    return {
        hp: Math.floor((character.hp + (character.inventory.hand? character.inventory.hand.effects.stat.hp[0] : 0) + (character.inventory.body? character.inventory.body.effects.stat.hp[0] : 0)) * (1 + (character.inventory.hand? character.inventory.hand.effects.stat.hp[1]/100 : 0) + (character.inventory.body? character.inventory.body.effects.stat.hp[1]/100 : 0))),
        mp: Math.floor((character.mp + (character.inventory.hand? character.inventory.hand.effects.stat.mp[0] : 0) + (character.inventory.body? character.inventory.body.effects.stat.mp[0] : 0)) * (1 + (character.inventory.hand? character.inventory.hand.effects.stat.mp[1]/100 : 0) + (character.inventory.body? character.inventory.body.effects.stat.mp[1]/100 : 0))),
        str: Math.floor((character.str * (character.inventory.hand? 1+character.inventory.hand.effects.stat.str : 1) * (character.inventory.body? 1+character.inventory.body.effects.stat.str : 1))*10000)/10000,
        int: Math.floor((character.int * (character.inventory.hand? 1+character.inventory.hand.effects.stat.int/100 : 1) * (character.inventory.body? 1+character.inventory.body.effects.stat.int/100 : 1))),
        armour: {
            physical: [Math.max(0, character.armour.physical[0] + (character.inventory.hand? character.inventory.hand.effects.def.physical[0] : 0) + (character.inventory.body? character.inventory.body.effects.def.physical[0] : 0)), Math.round((character.armour.physical[1] + (100-character.armour.physical[1])*(character.inventory.hand? character.inventory.hand.effects.def.physical[1]/100 : 0) + (100-character.armour.physical[1] + (100-character.armour.physical[1])*(character.inventory.hand? character.inventory.hand.effects.def.physical[1]/100 : 0))*(character.inventory.body? character.inventory.body.effects.def.physical[1]/100 : 0))*100)/100],
            magic: [Math.max(0, character.armour.magic[0] + (character.inventory.hand? character.inventory.hand.effects.def.magic[0] : 0) + (character.inventory.body? character.inventory.body.effects.def.magic[0] : 0)), Math.round((character.armour.magic[1] + (100-character.armour.magic[1])*(character.inventory.hand? character.inventory.hand.effects.def.magic[1]/100 : 0) + (100-character.armour.magic[1] + (100-character.armour.magic[1])*(character.inventory.hand? character.inventory.hand.effects.def.magic[1]/100 : 0))*(character.inventory.body? character.inventory.body.effects.def.magic[1]/100 : 0))*100)/100],
        },
        hpRegen: (character.inventory.hand? character.inventory.hand.effects.stat.hpReg : 0) + (character.inventory.body? character.inventory.body.effects.stat.hpReg : 0),
        mpRegen: character.mpRegen + (character.inventory.hand? character.inventory.hand.effects.stat.mpReg : 0) + (character.inventory.body? character.inventory.body.effects.stat.mpReg : 0),
        physDmgIncrease: [(character.inventory.hand? character.inventory.hand.effects.atk.physical[0] : 0) + (character.inventory.body? character.inventory.body.effects.atk.physical[0] : 0), 1 + (character.inventory.hand? character.inventory.hand.effects.atk.physical[1]/100 : 0) + (character.inventory.body? character.inventory.body.effects.atk.physical[1]/100 : 0), Math.min((character.inventory.hand && character.inventory.hand.effects.atk.physical[2] != -1? character.inventory.hand.effects.atk.physical[2] : Infinity), (character.inventory.body && character.inventory.body.effects.atk.physical[2] != -1? character.inventory.body.effects.atk.physical[2] : Infinity))],
        magiDmgIncrease: [(character.inventory.hand? character.inventory.hand.effects.atk.magic[0] : 0) + (character.inventory.body? character.inventory.body.effects.atk.magic[0] : 0), 1 + (character.inventory.hand? character.inventory.hand.effects.atk.magic[1]/100 : 0) + (character.inventory.body? character.inventory.body.effects.atk.magic[1]/100 : 0), Math.min((character.inventory.hand && character.inventory.hand.effects.atk.magic[2] != -1? character.inventory.hand.effects.atk.magic[2] : Infinity), (character.inventory.body && character.inventory.body.effects.atk.magic[2] != -1? character.inventory.body.effects.atk.magic[2] : Infinity))],
    };
}; window.adjustedStats = adjustedStats;

function blankCard(rarity, id=undefined, onClick=undefined) {
    return `<button ${id? `id="${id}"` : ``}${onClick ? `onclick="${onClick}" ` : ``}class="smallCharacterButton${rarity != -1? ` rank${rarity}Button` : ``}"><p class="noPadding characterTitle"> </p><img src="assets/empty.png" class="characterIcon"><span id="placeholder"><p class="noPadding medium"> </p></span></button>`;
}; window.blankCard = blankCard;

function itemCard(item, itemID=undefined, hideQuantity=false,  isShop=false) {
    let numItems =  isShop? getItemByName(item.name)? getItemByName(item.name).quantity : 0 : item.quantity;
    let title = `<strong>${item.displayName ? item.displayName : item.name}</strong>`;
    let buttonData = `${ isShop==true? `onclick="focusItem(${itemID}, true)" ` : typeof itemID == 'number'? game.gamestate.inBattle ? `onclick="useItem(${itemID})" ` : `onclick="focusItem(${itemID})" ` : ``}class="smallCharacterButton rank${item.rarity}Button" id="${typeof itemID == 'number'? `item${itemID}` : itemID}"`;
    return `<button ${buttonData}><p class="noPadding ${(item.displayName ? item.displayName : item.name).length > 11? `smallC` : `c`}haracterTitle">${title}</p><img src="${item.pfp}" class="characterIcon"><span id="placeholder"><p class="noPadding medium"> </p></span>${numItems > (isShop? 0 : 1) && hideQuantity == false? `<div id="cornerIcon"><span id="down">${numItems > 99 ? `99+`: numItems}</span></div>` : ``}</button>`;
}; window.itemCard = itemCard;

function isItem(item) {
    for (let i = 0; i < data.items.length; i++) {
        if (item.name == data.items[i].name) return true;
    }
    return false;
}; window.isItem = isItem;

function createCharacterCard(character, id=undefined, onClick=undefined) {
    if (character.hidden) return blankCard(character.rarity, id, onClick);
    if (isItem(character)) return itemCard(character, id, true); // in case the character is an item (for pulls)
    let title = `<strong>${character.name}</strong>`;
    let buttonData = `${onClick ? `onclick="${onClick}" ` : ``}class="smallCharacterButton rank${character.rarity}Button" id="${id}"`;
    let desc = `<span id="left"><div id='hpBar'><div id="${id}hp" class="hpBarInner"></div></div><img src="assets/redCross.png" class="smallIcon"><span id="${id}hpDisplay">${bigNumber(Math.floor(character.hp))}</span></span><span id="right"><div id='mpBar'><div id="${id}mp" class="mpBarInner"></div></div><span id="${id}mpDisplay">${bigNumber(Math.floor(character.mp))}</span><img src="assets/blueStar.png" class="smallIcon"></span>`;
    return `<button ${buttonData}>${character.ap > 0? `<div id="cornerIcon"><span id="down">${character.ap > 99? `∞` : (character.ap > 1? character.ap : `!`)}</span></div>` : ``}<p class="noPadding ${character.name.length > 11? `smallC` : `c`}haracterTitle">${title}</p><img src="${character.pfp}" class="characterIcon"><span id="placeholder"><p class="noPadding medium"> </p></span>${desc}</button>`;
}; window.createCharacterCard = createCharacterCard;

function cardLine(cards, pos, onClick) {
    let html = ``;
    for (let i = 0; i < cards.length; i++) {
        cards[i].id = `${pos}${i}ID`;
        html += createCharacterCard(cards[i], `${pos}${i}ID`, onClick? `${onClick}('${pos}${i}ID')`: ``);
    }
    return html;
}; window.cardLine = cardLine;

function massUpdateBars(cards) {
    cards.forEach(obj => {
        updateBar(obj.id+'hp', obj.hp/obj.hpMax, obj.hp);
        updateBar(obj.id+'mp', obj.mp/obj.mpMax, obj.mp);
    });
}; window.massUpdateBars = massUpdateBars;

function renderCards(pOnClick=undefined, eOnClick=undefined, enemyBack=game.gamestate.battleState.eb, enemyFront=game.gamestate.battleState.ef, playerFront=game.gamestate.battleState.pf, playerBack=game.gamestate.battleState.pb) {
    //console.log(pOnClick, eOnClick);
    if (!game.gamestate.inBattle) return;
    replacehtml(`enemyBackline`, cardLine(enemyBack, 'EB', eOnClick));
    replacehtml(`enemyFrontline`, cardLine(enemyFront, 'EF', eOnClick));
    replacehtml(`playerFrontline`, cardLine(playerFront, 'PF', pOnClick));
    replacehtml(`playerBackline`, cardLine(playerBack, 'PB', pOnClick));
    massUpdateBars(game.gamestate.battleState.eb);
    massUpdateBars(game.gamestate.battleState.ef);
    massUpdateBars(game.gamestate.battleState.pf);
    massUpdateBars(game.gamestate.battleState.pb);
    // updateBar(id, percent)
    /*
    let toUpdate = ['eb', 'ef', 'pb', 'pf'];
    for (let i = 0; i < toUpdate.length; i++) {
        for (let j = 0; j < game.gamestate.battleState[toUpdate[i]].length; j++) {
            game.gamestate.battleState[toUpdate[i]][j]
        }
    }*/
}; window.renderCards = renderCards;

function clearParticles() {
    game.particles = {};
    if (document.getElementById('effects')) replacehtml('effects', '');
}; window.clearParticles = clearParticles;

const countValidProperties = (obj) => {
    return Object.keys(obj).filter(key => {
        const value = obj[key];
        return value !== undefined && value !== null && value !== false && value !== 0 && value !== "" && !Number.isNaN(value);
    }).length;
}; window.countValidProperties = countValidProperties;

const handleParticles = (obj) => {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if ((!value || Number.isNaN(value)) && value != -1) {
            delete obj[key];
        } else {
            if (value.life != -1) value.life--;
            if (value.type.includes('spin')) {
                document.getElementById(value.id).style.transform = document.getElementById(value.id).style.transform.replace(`${value.rot}.69deg`, `${value.rot+value.speed}.69deg`);
                value.rot += value.speed;
            }
            if (value.type.includes('float')) {
                document.getElementById(value.id).style.top = `${unPixel(document.getElementById(value.id).style.top) - 2}px`;
            }
            if (value.type.includes('fall')) {
                document.getElementById(value.id).style.top = `${unPixel(document.getElementById(value.id).style.top) + 2}px`;
            }    
            if (value.type.includes('fade')) {
                if (value.life < 25) document.getElementById(value.id).style.opacity *= 0.9;
            }
            if (value.life == 0) {
                document.getElementById(value.id).remove();
                delete obj[key];
            }
        }
    });
    return obj;
}; window.handleParticles = handleParticles;

async function handleEffects() {
    if (countValidProperties(game.particles) == 0) return
    for (let i = 0; i < 9; i++) {
        handleParticles(game.particles);
        await sleep(25);
    }
}; window.handleEffects = handleEffects;

async function aoeEffect(effect, team) {
    let id = `aoeEffect${effect}`;
    console.log('drawing effect');
    if (document.getElementById(id)) return;
    let html = `<img src="assets/${effect}.png" id="${id}"></img>`;
    addhtml('effects', html);
    document.getElementById(id).style.opacity = 1;
    document.getElementById(id).style.position = `absolute`;
    document.getElementById(id).style.top = `${team == 'E'? 0 : document.getElementById('battleScreen').getBoundingClientRect().height-450}px`;
    document.getElementById(id).style.left = `${document.getElementById('battleScreen').getBoundingClientRect().width/2 - 510}px`;
    console.log(document.getElementById(id).style.top, document.getElementById(id).style.left);
    await sleep(1000);
    for (let i = 0; i < 300; i++) {
        document.getElementById(id).style.opacity = document.getElementById(id).style.opacity * 0.99;
        await sleep(5);
    }
    document.getElementById(id).remove();
}; window.aoeEffect = aoeEffect;

async function hitEffect(effect, pos, offset, noRotate=false, duration=250, fadeDuration=50, fadeAmount=0.95) {
    let id = generateId();
    if (effect == 'integral' || effect == 'derivitive') noRotate = true;
    let r = noRotate ? 0 : randint(0,360);
    let html = ``;
    // special animated hit effect
    let icon = ``;
    let bg = ``;
    switch(effect) {
        case `hpUp`:
            icon = `greenCross.png`;
            bg = `greenGlow`;
            break;
        case `defDown`:
            icon = `brokenShield.png`;
            bg = `greyGlow`;
            break;
        case `defUp`:
            icon = `shield.png`;
            bg = `greyGlow`;
            break;
        case `attackUp`:
            icon = `redSword.png`;
            bg = `redGlow`;
            break;
        case `mpDown`:
        case `mpUp`:
            icon = `blueStar.png`;
            bg = `blueGlow`;
            break;
        case `statUp`:
            icon = `yellowArrow.png`;
            bg = `yellowGlow`;
            break;
        case `attackDown`:
            icon = `brokenRedSword.png`;
            bg = `redGlow`;
            break;
        case `poisonUp`:
        case `gravityDown`:
            icon = `purpleParticle.png`;
            bg = `purpleGlow`;
            break;
        default:
            if (effect.includes('Up') || effect.includes('Down')) console.warn(`WARNING: this stat change effect is not supported: ${effect}`);
    }
    if (icon != ``) {
        hitEffect(bg, pos, {x: 87.5-75, y: 100-95}, true, 750, 300, 0.99);
        for (let i = 0; i < 4; i++) {
            let particle = {
                id: generateId(),
                life: 50,
                type: effect.includes('Up')? 'float fade' : 'fall fade',
            };
            let html = `<img src="assets/${icon}" id="${particle.id}" class="mediumIcon">`;
            addhtml('effects', html);
            document.getElementById(particle.id).style.opacity = 1;
            document.getElementById(particle.id).style.position = `absolute`;
            document.getElementById(particle.id).style.top = `${pos.y + 95 + randint(0, 180) - 90 - document.getElementById(particle.id).offsetHeight/2}px`;
            document.getElementById(particle.id).style.left = `${pos.x + 75 + randint(-75, 75) - document.getElementById(particle.id).offsetWidth/2}px`;
            //console.log(document.getElementById(particle.id).style.top, document.getElementById(particle.id).style.left);
            game.particles[particle.id] = particle;
        }
        for (let i = 0; i < 8; i++) {
            let particle = {
                id: generateId(),
                life: 50,
                type: effect.includes('Up')? 'float fade' : 'fall fade',
            };
            let html = `<img src="assets/${icon}" id="${particle.id}" class="smallIcon">`;
            addhtml('effects', html);
            document.getElementById(particle.id).style.opacity = 1;
            document.getElementById(particle.id).style.position = `absolute`;
            document.getElementById(particle.id).style.top = `${pos.y + 95 + randint(0, 180) - 90 - document.getElementById(particle.id).offsetHeight/2}px`;
            document.getElementById(particle.id).style.left = `${pos.x + 75 + randint(-75, 75) - document.getElementById(particle.id).offsetWidth/2}px`;
            //console.log(document.getElementById(particle.id).style.top, document.getElementById(particle.id).style.left);
            game.particles[particle.id] = particle;
        }
    } else {
        // normal hit effect
        html = `<img src="assets/${effect}.png" style="transform: rotate(${r}deg);" id="${id}"></img>`;
        addhtml('effects', html);
        //console.log(pos.y+95-document.getElementById(id).offsetHeight/2+randint(-50, 50));
        //console.log(pos);
        //document.getElementById(id).style.display = 'none';
        document.getElementById(id).style.opacity = 0;
        document.getElementById(id).style.position = `absolute`;
        await sleep(50); // let stuff load
        //console.log(document.getElementById(id).offsetHeight, document.getElementById(id).offsetWidth);
        if (document.getElementById(id).offsetHeight) {
            document.getElementById(id).style.top = `${pos.y+95-document.getElementById(id).offsetHeight/2}px`;
            document.getElementById(id).style.left = `${pos.x+75-document.getElementById(id).offsetWidth/2}px`;
        } else { // If dimensions don't load, assume it is a glow effect
            console.warn('HIT EFFECTS: Dimensions not loaded, assume glow effect');
            document.getElementById(id).style.top = `${pos.y+95-200/2}px`;
            document.getElementById(id).style.left = `${pos.x+75-175/2}px`;
        }
        
        document.getElementById(id).style.opacity = 1;
        //document.getElementById(id).style.display = 'block';
        //console.log(document.getElementById(id).style.top, document.getElementById(id).style.left);
        if (offset) {
            document.getElementById(id).style.top = `${unPixel(document.getElementById(id).style.top) + offset.y}px`;
            document.getElementById(id).style.left = `${unPixel(document.getElementById(id).style.left) + offset.x}px`;
        } else {
            document.getElementById(id).style.top = `${unPixel(document.getElementById(id).style.top) + randint(-50, 50)}px`;
            document.getElementById(id).style.left = `${unPixel(document.getElementById(id).style.left) + randint(-50, 50)}px`;
        }
        //console.log(document.getElementById(id).style.top, document.getElementById(id).style.left);
        //console.log(document.getElementById(id).style.top, document.getElementById(id).style.left);
        await sleep(duration);
        for (let i = 0; i < fadeDuration; i++) {
            document.getElementById(id).style.opacity = document.getElementById(id).style.opacity * fadeAmount;
            await sleep(5);
        }
        document.getElementById(id).remove();
    }
}; window.hitEffect = hitEffect;

async function simulateSmoothProjectileAttack(animation, start, target, dmg, number=true, miss=false) {
    let projectile = animation.projectile;
    let steps = animation.projectileSpeed;
    let fade = animation.projectileFade;
    let id = generateId();
    let end = getCardCoords(target);
    let randOffset = {x: randint(-50, 50), y: randint(-50, 50)};
    end = vMath(end, randOffset, '+');
    let toMove = vMath(end, start, '-');
    //console.log(toPol(toMove));
    let r = toPol(toMove).r * 180 / Math.PI;
    //console.log(r);
    let html = `<img src="assets/${projectile}.png" style="transform: rotate(${r}deg);" id="${id}"></img>`;
    addhtml('effects', html);
    let velocity = vMath(toMove, steps, '/');
    // unfortunately I can't define a variable to be the element otherwise async stuff breaks (am I doing it wrong?)
    document.getElementById(id).style.opacity = 1;
    document.getElementById(id).style.position = `absolute`;
    document.getElementById(id).style.top = `${start.y+95-document.getElementById(id).offsetHeight/2}px`;
    document.getElementById(id).style.left = `${start.x+75-document.getElementById(id).offsetWidth/2}px`;
    for (let i = 0; i < steps; i++) {
        //console.log(i);
        document.getElementById(id).style.top = `${unPixel(document.getElementById(id).style.top)+velocity.y}px`;
        document.getElementById(id).style.left = `${unPixel(document.getElementById(id).style.left)+velocity.x}px`;
        if (steps - i < 30 && fade) document.getElementById(id).style.opacity = document.getElementById(id).style.opacity * 0.95;
        //console.log(document.getElementById(id).style.top, document.getElementById(id).style.left);
        await sleep(10);
    }
    document.getElementById(id).remove();

    changeStat(target, {stat: 'hp', change: -dmg});
    if (number) dmgNumber(target, dmg, miss);
    if (animation.hitEffect != 'none') {
        hitEffect(animation.hitEffect, getCardCoords(target), randOffset);
    }
}; window.simulateSmoothProjectileAttack = simulateSmoothProjectileAttack;

async function simulateProjectileAttack(projectile, start, end, steps, fade) {
    let id = generateId();
    let randOffset = {x: randint(-50, 50), y: randint(-50, 50)};
    end = vMath(end, randOffset, '+');
    let toMove = vMath(end, start, '-');
    //console.log(toPol(toMove));
    let r = toPol(toMove).r * 180 / Math.PI;
    //console.log(r);
    let html = `<img src="assets/${projectile}.png" style="transform: rotate(${r}deg);" id="${id}"></img>`;
    addhtml('effects', html);
    let velocity = vMath(toMove, steps, '/');
    // unfortunately I can't define a variable to be the element otherwise async stuff breaks
    //document.getElementById(id).style.display = 'none';
    document.getElementById(id).style.opacity = 0;
    document.getElementById(id).style.position = `absolute`;
    await sleep(50); // let stuff load
    document.getElementById(id).style.top = `${start.y+95-document.getElementById(id).offsetHeight/2}px`;
    document.getElementById(id).style.left = `${start.x+75-document.getElementById(id).offsetWidth/2}px`;
    document.getElementById(id).style.opacity = 1;
    //document.getElementById(id).style.display = 'block';
    for (let i = 0; i < steps; i++) {
        //console.log(i);
        document.getElementById(id).style.top = `${unPixel(document.getElementById(id).style.top)+velocity.y}px`;
        document.getElementById(id).style.left = `${unPixel(document.getElementById(id).style.left)+velocity.x}px`;
        if (steps - i < 30 && fade) document.getElementById(id).style.opacity = document.getElementById(id).style.opacity * 0.95;
        //console.log(document.getElementById(id).style.top, document.getElementById(id).style.left);
        await sleep(10);
    }
    document.getElementById(id).remove();
    return randOffset;
}; window.simulateProjectileAttack = simulateProjectileAttack;

async function fakeMoveCard(card, targetCard, steps, reset=false, offset={x: 0, y: 0}) {
    let startingPos = getCardCoords(card);
    let pos = targetCard.x? targetCard : getCardCoords(targetCard);
    if (!reset) pos = vMath(pos, {x: 0, y: targetCard.id[0] == 'E' ? 210 : -210}, '+');
    pos = vMath(pos, offset, '+');
    //console.log(getCoordsScuffed(id));
    let original = document.getElementById(card.id);
    let element = undefined;
    //startingPos = getCoords(id);
    if (!document.getElementById(card.id+'animation')) {
        //console.log('ceating clone');
        element = original.cloneNode(true);
        original.style.opacity = 0;
        element.id = element.id+'animation';
        document.getElementById('effects').appendChild(element); // bruh, you can do this?!?! would have been nice to know a few months ago
    } else {
        element = document.getElementById(card.id+'animation');
        startingPos = {x: unPixel(element.style.left), y: unPixel(element.style.top)}; // redundent ik
    }
    //console.log(element.style);
    //startingPos = vMath(getCoords(id+'animation'), {x: parseFloat(element.style.left.slice(0, -2)), y: parseFloat(element.style.top.slice(0, -2))},'+');
    //console.log(pos, startingPos);
    let toMove = vMath(pos, startingPos, '-');
    //console.log(toMove);
    let velocity = vMath(toMove, steps, '/');
    //console.log('v', velocity);
    element.style.position = 'relative';
    element.style.top = `${startingPos.y}px`;
    element.style.left = `${startingPos.x}px`;
    for (let i = 0; i < steps; i++) {
        //console.log('moving');
        element.style.top = `${unPixel(element.style.top)+velocity.y}px`;
        element.style.left = `${unPixel(element.style.left)+velocity.x}px`;
        //console.log(element.style.top, element.style.left);
        await sleep(10);
    }
    element.style.top = `${pos.y}px`;
    element.style.left = `${pos.x}px`;
    if (reset) {
        document.getElementById(card.id+'animation').remove();
        original.style.opacity = 1;
    } 
    //console.log('final', element.style.top, element.style.left);
    //console.log(getCoordsScuffed(id+'animation'));
    
}; window.fakeMoveCard = fakeMoveCard;

async function changeStat(target, effect={stat: '', change: 0}, time=750) {
    if (effect.change == 0) return;                                                                                                                                                                       
    let steps = 20;
    for (let i = 0; i < steps; i++) {
        target[effect.stat] = Math.max(0, Math.min(target[effect.stat] + effect.change/steps, target[effect.stat+'Max']));
        if (target[effect.stat] < 0.25) target[effect.stat] = 0;
        updateBar(target.id+effect.stat, target[effect.stat]/target[effect.stat+'Max'], Math.floor(target[effect.stat]));
        await new Promise(resolve => setTimeout(resolve, time/steps));
        if (target[effect.stat] == 0) break;
    }
}; window.changeStat = changeStat;

function readID(id) {
    return {
        row: id.slice(0, 2).toLowerCase(),
        pos: parseInt(id.slice(2, -2))
    };
}; window.readID = readID;

function getCardById(id) {
    let pos = readID(id);
    if (pos.row == 'rr') return game.tempStorage.rewardCards[pos.pos];
    return game.gamestate.battleState[pos.row][pos.pos];
}; window.getCardById = getCardById;

function getCardByName(name) {
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        if (name == game.gamestate.player.team[i].name) return game.gamestate.player.team[i];
    }
    console.warn(`GET CARD BY NAME: Card with name '${name}' not found in team!`);
    return undefined;
}; window.getCardByName = getCardByName;

function getItemByName(name) {
    for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
        if (name == game.gamestate.player.inventory[i].name) return game.gamestate.player.inventory[i];
    }
    return undefined;
} window.getItemByName = getItemByName;

function calcResistance(dmgType, dmg, target) {
    switch (dmgType) {
        case magic:
            return Math.max(0, (dmg-target.armour.magic[0])*(100-target.armour.magic[1])/100);
        case physical:
            return Math.max(0, (dmg-target.armour.physical[0])*(100-target.armour.physical[1])/100);
        case piercing:
            // if defender has 100% resistance to damage, piercing damage can be blocked by damage negation.
            if (target.armour.physical[1] >= 100 && target.armour.magic[1] >= 100) return Math.max(0, Math.max(dmg-target.armour.physical[0], dmg-target.armour.magic[0]));
            return dmg;
        case normal:
            return Math.max(0, Math.max((dmg-target.armour.physical[0])*(100-target.armour.physical[1])/100, (dmg-target.armour.magic[0])*(100-target.armour.magic[1])/100));
    }
}; window.calcResistance = calcResistance;

function calculateEffect(card, effect) {
    //console.log('calculateEffect');
    if (!effect) return false;
    if (!effect.initialised && !effect.duration == 0) {
        // wtf is this
        if (effect.defChange.physical[0] < 0) effect.defChange.physical[0] = -Math.min(card.armour.physical[0], -effect.defChange.physical[0]);
        card.armour.physical[0] += effect.defChange.physical[0];
        if (effect.defChange.magic[0] < 0) effect.defChange.magic[0] = -Math.min(card.armour.magic[0], -effect.defChange.magic[0]);
        card.armour.magic[0] += effect.defChange.magic[0];
        if (effect.defChange.physical[1] > 0) effect.defChange.physical[1] = Math.floor((100 - card.armour.physical[1]) * effect.defChange.physical[1]/100);
        if (effect.defChange.physical[1] < 0) effect.defChange.physical[1] = -Math.min(card.armour.physical[1], -effect.defChange.physical[1]);
        card.armour.physical[1] += effect.defChange.physical[1];
        if (effect.defChange.magic[1] > 0) effect.defChange.magic[1] = Math.floor((100 - card.armour.magic[1]) * effect.defChange.magic[1]/100);
        if (effect.defChange.magic[1] < 0) effect.defChange.magic[1] = -Math.min(card.armour.magic[1], -effect.defChange.magic[1]);
        card.armour.magic[1] += effect.defChange.magic[1];
        card.str += effect.statChange.str;
        card.str = Math.round(card.str*100)/100;
        card.int += effect.statChange.int;
        card.mpRegen += effect.statChange.reg;
        if (effect.specialEffects) {
            for (let i = 0; i < effect.specialEffects.length; i++) {
                card.specialConditions[effect.specialEffects[i].effect] = effect.specialEffects[i].effect.value;
            }
        }
        effect.initialised = true;
        return effect;
    }
    //console.log('effects updated');
    if (effect.dmg > 0) {
        let miss = randint(0, 100) > effect.accuracy;
        let dmg = calcResistance(effect.type, effect.dmg, card);
        if (!miss) changeStat(card, {stat: 'hp', change: -dmg}, 500);
        dmgNumber(card, miss? 0 : dmg, miss);
    }
    if (effect.change.hp) {
        changeStat(card, {stat: 'hp', change: effect.change.hp}, 500);
        dmgNumber(card, -effect.change.hp);
    }
    if (effect.change.mp) {
        changeStat(card, {stat: 'mp', change: effect.change.mp}, 500);
    }
    effect.duration--;
    if (effect.duration <= 0) {
        //console.log('removing');
        card.armour.physical[0] -= effect.defChange.physical[0];
        card.armour.physical[1] -= effect.defChange.physical[1];
        card.armour.magic[0] -= effect.defChange.magic[0];
        card.armour.magic[1] -= effect.defChange.magic[1];
        card.str -= effect.statChange.str;
        card.str = Math.round(card.str*100)/100;
        card.int -= effect.statChange.int;
        card.mpRegen -= effect.statChange.reg;
        if (effect.specialEffects) {
            for (let i = 0; i < effect.specialEffects.length; i++) {
                card.specialConditions[effect.specialEffects[i].effect] = !effect.specialEffects[i].effect.value;
            }
        }
        return false;
    }
    return effect;
}; window.calculateEffect = calculateEffect;

function handleStatusEffectsRow(row) {
    for (let i = 0; i < row.length; i++) {
        let card = row[i];
        let nEffects = [];
        for (let j = 0; j < card.effects.length; j++) {
            let res = calculateEffect(card, card.effects[j]);
            if (res) nEffects.push(res);
        }
        card.effects = nEffects;
    }
}; window.handleStatusEffectsRow = handleStatusEffectsRow;

function handleStatusEffects() {
    handleStatusEffectsRow(game.gamestate.battleState.eb);
    handleStatusEffectsRow(game.gamestate.battleState.ef);
    handleStatusEffectsRow(game.gamestate.battleState.pf);
    handleStatusEffectsRow(game.gamestate.battleState.pb);
}; window.handleStatusEffects = handleStatusEffects;

function dmgNumber(card, dmg, miss=false) {
    let particle = {
        id: generateId(),
        life: 70,
        type: 'float fade',
    };
    console.log(particle);
    let html = miss? `<div id="${particle.id}" class="resistNum">miss</div>` : `<div id="${particle.id}" class="${dmg > 0? `dmgNum` : (dmg == 0 ? `resistNum` : `healNum`)}">${Math.abs(dmg)}</div>`;
    addhtml('effects', html);
    let coords = getCardCoords(card);
    document.getElementById(particle.id).style.opacity = 1;
    document.getElementById(particle.id).style.position = `absolute`;
    document.getElementById(particle.id).style.top = `${coords.y+randint(60, 150)}px`;
    document.getElementById(particle.id).style.left = `${75+coords.x+randint(-50, 50)-document.getElementById(particle.id).offsetWidth/2}px`;
    game.particles[particle.id] = particle;
}; window.dmgNumber = dmgNumber;

async function simulateSingleAttack(user, skill, target) {
    skill = JSON.parse(JSON.stringify(skill)); // deepcopy is only used in 1 scenario but I'm lazy so its here
    let number = true;
    let miss = false;
    console.log(calcDamage(user, skill));
    let dmg = skill.type == heal || skill.dmg == 0? calcDamage(user, skill) : Math.floor(Math.max(0, calcResistance(skill.type, calcDamage(user, skill), target)));
    if (skill.dmg == 0 || skill.type == effect) number = false; // skills that do not intend to do damage should not have damage numbers
    else if (skill.accuracy != Infinity && randint(0,100) > skill.accuracy) {
        dmg = 0;
        miss = true;
    }
    let done = false;
    let offset = undefined;
    if (skill.animation.range === fullScreen) {
        aoeEffect(skill.animation.projectile, target.id[0]);
        changeStat(target, {stat: 'hp', change: -dmg});
        if (number) dmgNumber(target, dmg, miss);
        return;
    };
    if (skill.animation.range === melee) {
        await fakeMoveCard(user, target, skill.animation.moveSpeed);
    };
    if (skill.animation.projectile != 'none') {
        //console.log('launch projectile');
        let startPos = getCardCoords(user);
        if (document.getElementById(user.id+'animation')) {
            startPos = {x: unPixel(document.getElementById(user.id+'animation').style.left), y: unPixel(document.getElementById(user.id+'animation').style.top)};
        }
        let endPos = getCardCoords(target);
        if (skill.animation.smooth) {
            done = true;
            simulateSmoothProjectileAttack(skill.animation, startPos, target, dmg, number, miss);
        } 
        else offset = await simulateProjectileAttack(skill.animation.projectile, startPos, endPos, skill.animation.projectileSpeed, skill.animation.projectileFade);
    } 
    console.log('effects');
    for (let i = 0; i < skill.effects.length; i++) {
        console.log(skill.effects[i]);
        if (skill.effects[i].type) {
            if (skill.effects[i].type == 'same') skill.effects[i].type = user.type? user.type : 'human';
            console.log(skill.effects[i].type, (target.type? target.type : 'human'));
            if (skill.effects[i].type != (target.type? target.type : 'human')) {
                if (skill.effects.length == 1 && skill.type == effect) done = true; // no animation if the effect does not apply to the target
                continue;
            }
            console.log('success');
        }
        if (randint(0,100) <= skill.effects[i].chance) {
            let effect = JSON.parse(JSON.stringify(data.effects[skill.effects[i].effect]));
            effect.initialised = false;
            console.log(effect);
            target.effects.push(calculateEffect(target, effect));
            console.log(target);
        } else if (skill.effects.length == 1 && skill.type == effect) done = true; // no animation if the effect fails to apply to the target
        
    }
    if (!done) {
        if (target.id[0] == 'E') target.lastHit = user.owner? user.owner : user.name;
        changeStat(target, {stat: 'hp', change: -dmg});
        if (number) dmgNumber(target, dmg, miss);
        if (skill.animation.hitEffect != 'none') {
            await hitEffect(skill.animation.hitEffect, getCardCoords(target), offset);
        }
    }
    await sleep(skill.animation.projectileDelay);
}; window.simulateSingleAttack = simulateSingleAttack;

function skills(card=undefined, enabled=true) { // sidebar skills in combat
    if (card) {
        if (card.ap <= 0) enabled = false; // must have action points to attack. 'enabled' is used to disable actions when there are action points left
        replacehtml(`nav`, `<button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button><button onclick="skills()" class="focusedButton"><h3>Skills</h3></button>`);
        replacehtml(`money`, `<span><strong>${card.name}</strong></span>`);
        console.log('skills');
        let buttonGridHtml = `<div id="stats"><p class="noPadding statsText">  <img src="assets/lightning.png" class="smallIcon"> Actions Left:    ${card.ap > 99? `∞` : card.ap}<br>  <img src="assets/sword.png" class="smallIcon"> Strength:        ×${card.str}<br>  Intelligence:      ${card.int}<br>  <img src="assets/shield.png" class="smallIcon"> Physical Armour: ${card.armour.physical[0]}, ${card.armour.physical[1]}%<br>  <img src="assets/blueShield.png" class="smallIcon"> Magic Armour:    ${card.armour.magic[0]}, ${card.armour.magic[1]}%</p></div>`;
        for (let i = 0; i < card.skills.length; i++) {
            console.log(card.skills[i]);
            let dmg = calcDamage(card, data.skills[card.skills[i]]);
            console.log(dmg);
            let title = `<strong>${data.skills[card.skills[i]].name}</strong>`;
            let dmgDesc = `${data.skills[card.skills[i]].type != summon? `${dmg == 0? `` : `${dmg > 0? `Damage:` : `Heal:`} <img src="assets/${dmg > 0? `lightning` : `greenCross`}.png" class="smallIcon"> ${dmg > 0? dmg : -dmg}`}` : `Summons: ${dmg}`}${data.skills[card.skills[i]].attacks > 1? ` × ${data.skills[card.skills[i]].attacks}` : ``}`;
            let desc = `${data.skills[card.skills[i]].desc.replaceAll(`[attacker]`, card.name).replaceAll(`[pronoun]`, card.gender == female? `her` : `his`)}<br>${dmgDesc}<br><img src="assets/explosion.png" class="smallIcon"> ${data.skills[card.skills[i]].targeting}<br>${(data.skills[card.skills[i]].cost.hp || data.skills[card.skills[i]].cost.mp)? `Costs:` : ``} ${data.skills[card.skills[i]].cost.hp ? `<img src="assets/redCross.png" class="smallIcon"> ${data.skills[card.skills[i]].cost.hp}` : ``} ${data.skills[card.skills[i]].cost.mp ? `<img src="assets/blueStar.png" class="smallIcon"> ${data.skills[card.skills[i]].cost.mp}` : ``}`;
            let buttonData = `${enabled? `onclick="useSkill('${card.skills[i]}')" ` : ``}id="${data.skills[card.skills[i]].name}" class="pullButton greyButton smallerFont"`;
            buttonGridHtml += `<span><button ${buttonData}><p class="noPadding"><strong>${title}</strong><br>${desc}</p></button></span>`;
        }
        console.log(buttonGridHtml);
        replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
    } else {
        replacehtml(`nav`, `<button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button><button onclick="skills()" class="focusedButton"><h3>Skills</h3></button>`);
        replacehtml(`money`, `<span><strong>Select Card</strong></span>`);
        replacehtml(`grid`, `<div id="buttonGridInventory"></div>`);
    }
    resize();
}; window.skills = skills;

function handleSummon(cardRow, summonedEntity, summonEffect) {
    game.gamestate.battleState[cardRow].push(JSON.parse(JSON.stringify(summonedEntity)));
    hitEffect(summonEffect, getCardCoords({row: cardRow, pos: game.gamestate.battleState[cardRow].length-1}), {x: 0, y: 0}, true, 750);
}; window.handleSummon = handleSummon;

async function simulateSkill(user, skill, target=undefined) { 
    console.log('skill used');
    user.ap--;
    addBattleControls(true);
    renderCards();
    skills(user, false);
    if (skill.cost.hp) {
        changeStat(user, {stat: 'mp', change: -skill.cost.mp}); 
        await changeStat(user, {stat: 'hp', change: -skill.cost.hp});
    } else if (skill.cost.mp) {
        await changeStat(user, {stat: 'mp', change: -skill.cost.mp}); 
    }
    await sleep(10);
    if (skill.animation.range === melee) await fakeMoveCard(user, target, Math.min(200, Math.max(50, 150 - ((user.agi? user.agi : 100) + (skill.agi? skill.agi : 0))/2)));
    switch (skill.targeting) {
        case aoe:
            console.log('aoe skill used');
            for (let i = 0; i < skill.attacks; i++) {
                if (target.id[0] == 'E') { // target is enemy team
                    console.log('enemy targeted');
                    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
                        console.log('attacking ef');
                        simulateSingleAttack(user, skill, game.gamestate.battleState.ef[i]);
                    }
                    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
                        console.log('attacking eb');
                        simulateSingleAttack(user, skill, game.gamestate.battleState.eb[i]);
                    }
                } else { // target is player team
                    console.log('player targeted');
                    for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
                        simulateSingleAttack(user, skill, game.gamestate.battleState.pf[i]);
                    }
                    for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
                        simulateSingleAttack(user, skill, game.gamestate.battleState.pb[i]);
                    }
                }
                if (skill.attacks > 1 && i < skill.attacks-1) await sleep(200);
            }
            break;
        case multi:
            let targets = target.id[0] == 'E' ? [].concat(game.gamestate.battleState.ef, game.gamestate.battleState.eb) : [].concat(game.gamestate.battleState.pf, game.gamestate.battleState.pb);
            for (let i = 0; i < skill.attacks; i++) {
                let chosen = (randchoice([0,1]) || skill.isRandom) ? randchoice(targets) : target;
                if (i == 0) chosen = target; // first attack always hits targeted enemy
                //console.log(chosen.id);
                await simulateSingleAttack(user, skill, chosen);
            }
            break;
        case selfOnly:
        case single:
            for (let i = 0; i < skill.attacks; i++) {
                await simulateSingleAttack(user, skill, target);
            }
            break;
        case summon:
            let toSummon = skill.attacks;
            let summonedEntity = JSON.parse(JSON.stringify({...data.summons[skill.dmg], ...data.enemyData}));
            summonedEntity.ap = 1;
            summonedEntity.hpMax = summonedEntity.hp;
            summonedEntity.mpMax = summonedEntity.mp;
            if (user.id[0] == 'P') {
                summonedEntity.skills.push('reposition');
                while (toSummon > 0 && game.gamestate.battleState.pb.length < 6) {
                    toSummon--;
                    handleSummon('pb', summonedEntity, skill.animation.hitEffect);
                }
                while (toSummon > 0 && game.gamestate.battleState.pf.length < 6) {
                    toSummon--;
                    handleSummon('pf', summonedEntity, skill.animation.hitEffect);
                }
            } else {
                while (toSummon > 0 && game.gamestate.battleState.ef.length < 6) {
                    toSummon--;
                    handleSummon('ef', summonedEntity, skill.animation.hitEffect);
                }
                while (toSummon > 0 && game.gamestate.battleState.eb.length < 6) {
                    toSummon--;
                    handleSummon('eb', summonedEntity, skill.animation.hitEffect);
                }
            }
            break;
        default:
            console.error(`ERROR: unknown skill targeting: ${skill.targeting}`);
    }
    if (skill.animation.range === melee) {
        if (skill.animation.smooth) await sleep(750 + skill.attacks * 5);
        await fakeMoveCard(user, user, user.agi? Math.min(250, Math.max(100, 200 - user.agi/2)) : 150, true);
    }
    if ((skill.animation.smooth || skill.targeting == aoe) && skill.animation.range != 'melee') { // estimate attack time (pretty reliable ngl)
        console.log('wait', Math.max(0, skill.attacks * (skill.animation.projectileDelay + skill.animation.moveSpeed)-(skill.targeting == aoe? 0 : 2500)) + (skill.animation.projectile != 'none'? skill.animation.projectileSpeed*10 : 0));
        await sleep(Math.max(0, skill.attacks * (skill.animation.projectileDelay + skill.animation.moveSpeed) - (skill.targeting == aoe? 0 : 2500)));
        if (skill.animation.projectile != 'none') await sleep(skill.animation.projectileSpeed * 20);
        console.log('expected attack duration');
    }
    console.log('buffer start');
    if (skill.targeting != summon) await sleep(750);
    await sleep(250);
    console.log('buffer end');
    await checkAllDead();
    renderCards(`selectAction`, `selectAction`);
    addBattleControls();
    skills(user, user.ap > 0);
    if (user.ap > 0) selectAction(user.id);
}; window.simulateSkill = simulateSkill;

async function simulateItem(itemId, cardId) {
    renderCards();
    console.log(`simulating item`);
    for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
        document.getElementById(`item${i}`).className = document.getElementById(`item${i}`).className.replace(` selected`, ``);
    }
    let item = game.gamestate.player.inventory[itemId];
    let card = getCardById(cardId);
    console.log(item);
    console.log(card);
    item.quantity--;
    if (item.quantity <= 0) {
        let newItem = [];
        for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
            if (game.gamestate.player.inventory[i].quantity > 0) newItem.push(game.gamestate.player.inventory[i]);
        }
        game.gamestate.player.inventory = newItem;
    }
    inventory();
    let animation = true;
    for (let i = 0; i < item.effects.length; i++) {
        if (randint(0,100) <= item.effects[i].chance) {
            let effect = JSON.parse(JSON.stringify(data.effects[item.effects[i].effect]));
            effect.initialised = false;
            console.log(effect);
            let res = calculateEffect(card, effect);
            if (res) card.effects.push(res);
            console.log(card);
        } else if (item.effects.length == 1) animation = false; // no animation if the effect fails to apply to the target
    }
    if (animation) await hitEffect(item.hitEffect, getCardCoords(card));
    await sleep(1000);
    await checkAllDead();
    renderCards(`selectAction`, `selectAction`);
}; window.simulateItem = simulateItem;

function useItem(id) {
    for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
        document.getElementById(`item${i}`).className = document.getElementById(`item${i}`).className.replace(` selected`, ``);
    }
    if (game.gamestate.player.inventory[id].useable && game.gamestate.battleState.tempStorage.activeItemId != id && game.gamestate.player.inventory[id].quantity > 0) {
        document.getElementById(`item${id}`).className = document.getElementById(`item${id}`).className + ` selected`;
        game.gamestate.battleState.tempStorage.activeItemId = id;
        renderCards(`selectItemTarget`, `selectItemTarget`);
    } else {
        game.gamestate.battleState.tempStorage.activeItemId = undefined;
        renderCards(`selectAction`, `selectAction`);
    }
}; window.useItem = useItem;

function selectItemTarget(id) {
    simulateItem(game.gamestate.battleState.tempStorage.activeItemId, id);
}; window.selectItemTarget = selectItemTarget;

function selectAction(id) {
    let card = getCardById(id);
    // if (!card.ap) return; 
    let cardHtml = document.getElementById(id);
    for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
        //console.log(`${id.slice(0, 2)}${i}ID`);
        document.getElementById(`PB${i}ID`).className = document.getElementById(`PB${i}ID`).className.replace(` selected`, ``);
    }
    for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
        document.getElementById(`PF${i}ID`).className = document.getElementById(`PF${i}ID`).className.replace(` selected`, ``);
    }
    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
        //console.log(`${id.slice(0, 2)}${i}ID`);
        document.getElementById(`EB${i}ID`).className = document.getElementById(`EB${i}ID`).className.replace(` selected`, ``);
    }
    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
        document.getElementById(`EF${i}ID`).className = document.getElementById(`EF${i}ID`).className.replace(` selected`, ``);
    }
    cardHtml.className += ` selected`;
    game.gamestate.battleState.tempStorage.activeCardId = id;
    skills(card);
}; window.selectAction = selectAction;

function selectTarget(id) {
    let targetedCard = getCardById(id);
    let activeCard = getCardById(game.gamestate.battleState.tempStorage.activeCardId);
    let skillUsed = data.skills[game.gamestate.battleState.tempStorage.skillId];
    //console.log(targetedCard);
    //console.log(activeCard);
    //console.log(skillUsed);
    
    game.gamestate.battleState.tempStorage.activeCardId = undefined;
    game.gamestate.battleState.tempStorage.skillId = undefined;
    simulateSkill(activeCard, skillUsed, targetedCard);
}; window.selectTarget = selectTarget;

async function repositionCard(card) {
    card.ap--;
    renderCards();
    let newID = `${card.id[0]}${card.id[1] == `F`? `B` : `F`}${card.id[1] == `F`? game.gamestate.battleState[`${card.id[0].toLowerCase()}b`].length: game.gamestate.battleState[`${card.id[0].toLowerCase()}f`].length}ID`;
    console.log(newID);
    fakeMoveCard(card, {id: newID}, 50, true, {x: -85, y: 0});
    document.getElementById(card.id).style['opacity'] = 0;
    document.getElementById(card.id).style['max-width'] = `150px`;
    document.getElementById(card.id).style['border'] = `none`;
    document.getElementById(card.id).style['overflow-x'] = 'hidden';
    for (let i = 0; i < 50; i++) {
        await sleep(10);
        document.getElementById(card.id).style['max-width'] = `${unPixel(document.getElementById(card.id).style['max-width'])-3}px`;
    }
    document.getElementById(card.id).remove();
    if (card.id[1] == `F`) {
        let newF = [];
        for (let i = 0; i < game.gamestate.battleState[`${card.id[0].toLowerCase()}f`].length; i++) {
            if (game.gamestate.battleState[`${card.id[0].toLowerCase()}f`][i].id != card.id) newF.push(game.gamestate.battleState[`${card.id[0].toLowerCase()}f`][i]);
        }
        game.gamestate.battleState[`${card.id[0].toLowerCase()}b`].push(card);
        game.gamestate.battleState[`${card.id[0].toLowerCase()}f`] = newF;
    } else {
        let newB = [];
        for (let i = 0; i < game.gamestate.battleState[`${card.id[0].toLowerCase()}b`].length; i++) {
            if (game.gamestate.battleState[`${card.id[0].toLowerCase()}b`][i].id != card.id) newB.push(game.gamestate.battleState[`${card.id[0].toLowerCase()}b`][i]);
        }
        game.gamestate.battleState[`${card.id[0].toLowerCase()}f`].push(card);
        game.gamestate.battleState[`${card.id[0].toLowerCase()}b`] = newB;
    }
    if (card.id[0] == 'P') renderCards(`selectAction`, `selectAction`);
    else renderCards();
    skills(card, card.ap > 0);
    if (card.ap > 0) selectAction(card.id);
}; window.repositionCard = repositionCard;

function useSkill(skillId=undefined) {
    let skill = data.skills[skillId];
    console.log(`skill selected`);
    console.log(skill);
    if (skill.cost.mp > getCardById(game.gamestate.battleState.tempStorage.activeCardId).mp) return; // must have sufficient mana
    if (skill.type == summon && (game.gamestate.battleState.pf.length + game.gamestate.battleState.pf.length) >= 12) return; // can't summon of rows are full
    document.getElementById(`buttonGridInventory`).innerHTML = document.getElementById(`buttonGridInventory`).innerHTML.replace(` selected`, ``);
    document.getElementById(skill.name).className += ` selected`;
    if (skill.instantUse) {
        if (skill.name == 'Reposition') {
            console.log('repositioning card');
            repositionCard(getCardById(game.gamestate.battleState.tempStorage.activeCardId));
        } else {
            simulateSkill(getCardById(game.gamestate.battleState.tempStorage.activeCardId), skill, getCardById(game.gamestate.battleState.tempStorage.activeCardId));
        }
    } else {
        game.gamestate.battleState.tempStorage.skillId = skillId;
        renderCards(`selectTarget`, `selectTarget`);
    }
}; window.useSkill = useSkill;

function regenCardMana(card) {
    if (card.id && !card.specialConditions.noRegen) {
        changeStat(card, {stat: 'mp', change: card.mpRegen}, 500);
    } else console.warn(`REGEN MP: Could not find card id. This can be safely ignored if a battle was just started and ids were not generated yet.`);
}; window.regenCardMana = regenCardMana;

function regenMana() {
    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
        regenCardMana(game.gamestate.battleState.eb[i]);
    }
    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
        regenCardMana(game.gamestate.battleState.ef[i]);
    }
    for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
        regenCardMana(game.gamestate.battleState.pb[i]);
    }
    for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
        regenCardMana(game.gamestate.battleState.pf[i]);
    }
}; window.regenMana = regenMana;

function giveRewards(drops, killer=undefined) {
    if (killer) killer = getCardByName(killer); 
    for (let i = 0; i < drops.length; i++) {
        if (randint(0, 100) < drops[i].chance) {
            switch (drops[i].type) {
                case exp:
                    if (killer) killer.expToAdd += drops[i].quantity;
                    else {
                        let perCharacter = Math.floor(drops[i].quantity / game.gamestate.player.team.length);
                        for (let i = 0; i < game.gamestate.player.team.length; i++) {
                            game.gamestate.player.team[i].expToAdd += perCharacter;
                        }
                    }
                    for (let i = 0; i < game.gamestate.player.team.length; i++) {
                        console.log(game.gamestate.player.team[i].name, ': ', game.gamestate.player.team[i].expToAdd);
                    }
                    break;
                case item:
                    break;
                    addItemToInventory(); // TODO: add this function
                case gold:
                    game.gamestate.player.money += drops[i].quantity; // TODO: make this nicer
                    break;
                default:
                    console.warn(`REWARDS: Unknown reward type: ${drops[i.type]}`);
            }
        }
    }
}; window.giveRewards = giveRewards;

async function deathEffect(card) {;
    document.getElementById(card.id).style['opacity'] = 1;
    for (let i = 0; i < 20; i++) {
        await sleep(15);
        if (document.getElementById(card.id)) document.getElementById(card.id).style['opacity'] = document.getElementById(card.id).style['opacity'] - 0.05;
        else return;
    }
    document.getElementById(card.id).style['opacity'] = 0;
    document.getElementById(card.id).style['max-width'] = `150px`;
    document.getElementById(card.id).style['border'] = `none`;
    document.getElementById(card.id).style['overflow-x'] = 'hidden';
    for (let i = 0; i < 50; i++) {
        await sleep(15);
        if (document.getElementById(card.id)) document.getElementById(card.id).style['max-width'] = `${unPixel(document.getElementById(card.id).style['max-width'])-3}px`;
        else return;
    }
    await sleep(15);
    if (document.getElementById(card.id)) document.getElementById(card.id).remove();
}; window.deathEffect = deathEffect;

function checkDead(row) {
    let wait = false;
    let nRow = [];
    for (let i = 0; i < row.length; i++) {
        if (row[i].hp > 0) {
            nRow.push(row[i]);
        } else {
            wait = true;
            row[i].alive = false; // this keeps track of whether player characters are dead so they can be revived later
            if (row[i].id[0] == 'E') giveRewards(data.drops.enemy[row[i].enemyType], row[i].lastHit);
            deathEffect(row[i]);
        }
    }
    return [nRow, wait];
}; window.checkDead = checkDead;

async function checkAllDead() {
    let deaths = [false, false, false, false];
    [game.gamestate.battleState.eb, deaths[0]] = checkDead(game.gamestate.battleState.eb);
    [game.gamestate.battleState.ef, deaths[1]] = checkDead(game.gamestate.battleState.ef);
    [game.gamestate.battleState.pb, deaths[2]] = checkDead(game.gamestate.battleState.pb);
    [game.gamestate.battleState.pf, deaths[3]] = checkDead(game.gamestate.battleState.pf);
    if (deaths[0] || deaths[1] || deaths[2] || deaths[3]) await sleep(1250);
}; window.checkAllDead = checkAllDead;

async function handleEnemyAttack(enemy) {
    let skillToUse = data.skills[randchoice(enemy.skills)];
    console.log(skillToUse);
    if (skillToUse.name == 'Reposition') {
        console.log('repositioning card');
        await repositionCard(enemy);
        await sleep(500);
        return;
    } 
    let target = game.gamestate.battleState.pf.length > 0? randchoice(game.gamestate.battleState.pf) : randchoice(game.gamestate.battleState.pb);
    if (skillToUse.instantUse) target = enemy;
    console.log(target);
    await simulateSkill(enemy, skillToUse, target);
}; window.handleEnemyAttack = handleEnemyAttack;

function resetCharacterStats() {
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        let card = game.gamestate.player.team[i];
        console.log(card);
        console.log(game.gamestate.player.characters[0]);
        let baseStats = JSON.parse(card.baseStats);
        card.hp = baseStats.hp;
        card.mp = baseStats.mp;
        card.str = baseStats.str;
        card.int = baseStats.int;
        card.mpRegen = baseStats.mpRegen;
        card.armour = baseStats.armour;
        card.skills = card.skills.slice(0, -1); // remove the reposition skill (it will be added back in the next battle)
        delete card.hpRegen;
        delete card.physDmgIncrease;
        delete card.magiDmgIncrease;
        delete card.hpMax;
        delete card.mpMax;
        delete card.ap;
        delete card.effects;
        delete card.specialConditions;
        for (let i = 0; i < game.gamestate.player.characters.length; i++) {
            if (game.gamestate.player.characters[i].name == card.name) {
                game.gamestate.player.characters[i] = card;
            }
        }
    }
}; window.resetCharacterStats = resetCharacterStats;

function playerTurn() {
    game.gamestate.battleState.turn = 'player';
    for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
        game.gamestate.battleState.pb[i].ap = 1;
        if (game.gamestate.battleState.pb[i].additionalAp) game.gamestate.battleState.pb[i].ap += game.gamestate.battleState.pb[i].additionalAp;
    }
    for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
        game.gamestate.battleState.pf[i].ap = 1;
        if (game.gamestate.battleState.pf[i].additionalAp) game.gamestate.battleState.pf[i].ap += game.gamestate.battleState.pf[i].additionalAp;
    }
    if (game.gamestate.inBattle) addBattleControls();
    if (game.gamestate.inBattle) renderCards(`selectAction`, `selectAction`);
    if (game.gamestate.inBattle) resize();
}; window.playerTurn = playerTurn;

async function enemyTurn() {
    console.log('player turn ended, enemy attacking');
    game.gamestate.battleState.turn = 'enemy';
    game.gamestate.battleState.tempStorage.activeCardId = undefined;
    game.gamestate.battleState.tempStorage.skillId = undefined;
    game.gamestate.battleState.tempStorage.activeItemId = undefined;
    if (game.gamestate.inBattle) addBattleControls(true);
    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
        game.gamestate.battleState.eb[i].ap = 1;
        if (game.gamestate.battleState.eb[i].additionalAp) game.gamestate.battleState.eb[i].ap += game.gamestate.battleState.eb[i].additionalAp;
    }
    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
        game.gamestate.battleState.ef[i].ap = 1;
        if (game.gamestate.battleState.ef[i].additionalAp) game.gamestate.battleState.ef[i].ap += game.gamestate.battleState.ef[i].additionalAp;
    }
    if (game.gamestate.inBattle) renderCards();
    if (game.gamestate.inBattle) resize();
    let cont = true;
    while (cont) { 
        cont = false;
        for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
            if (game.gamestate.battleState.ef[i].ap > 0) {
                await handleEnemyAttack(game.gamestate.battleState.ef[i]);
                cont = true;
                break;
            }
        }
        if (cont) continue;
        for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
            if (game.gamestate.battleState.eb[i].ap > 0) {
                await handleEnemyAttack(game.gamestate.battleState.eb[i]);
                cont = true;
                break;
            }
        }
    }
    
    console.log('end enemy turn, start handle effects');
    if (game.gamestate.inBattle) handleStatusEffects();
    if (game.gamestate.inBattle) regenMana();
    if (game.gamestate.inBattle) await sleep(550);
    if (game.gamestate.inBattle) await checkAllDead();
    console.log('end handle effects');
    if (game.gamestate.inBattle) playerTurn();
}; window.enemyTurn = enemyTurn;

function startWave() {
    let dungeon = data.dungeons[game.gamestate.dungeon];
    let eb = game.gamestate.battleState.eb;
    let ef = game.gamestate.battleState.ef;
    for (let i = 0; i < dungeon.waves[game.gamestate.battleState.wave].enemies.length; i++) {
        let enemyData = dungeon.waves[game.gamestate.battleState.wave].enemies[i];
        let enemy = {...JSON.parse(JSON.stringify(data.enemies[enemyData.enemy])), ...data.enemyData};
        if (enemy.hp.constructor === Array) enemy.hp = enemy.hp[enemyData.lvl];
        if (enemy.mp.constructor === Array) enemy.mp = enemy.mp[enemyData.lvl];
        if (enemy.str.constructor === Array) enemy.str = enemy.str[enemyData.lvl];
        if (enemy.int.constructor === Array) enemy.int = enemy.int[enemyData.lvl];
        if (enemy.mpRegen.constructor === Array) enemy.mpRegen = enemy.mpRegen[enemyData.lvl];
        enemy.hpMax = enemy.hp;
        enemy.mpMax = enemy.mp;
        enemy.rarity += enemyData.lvl;
        enemy.drops = enemyData.drops;
        enemy.itemDrops = enemyData.itemDrops;
        if (enemyData.location == `frontline`) {
            for (let i = 0; i < enemyData.quantity; i++) {
                enemy.id = `EF${i}ID`;
                ef.push(JSON.parse(JSON.stringify(enemy)));
            } 
        } else {
            for (let i = 0; i < enemyData.quantity; i++) {
                enemy.id = `EB${i}ID`;
                eb.push(JSON.parse(JSON.stringify(enemy)));
            } 
        }
    }
}; window.startWave = startWave;

async function retreat() {
    if (game.gamestate.battleState.tempStorage.retreat == 'awaitingConfirmation') {
        game.gamestate.battleState.retreat = true;
        game.gamestate.battleState.tempStorage.retreat = undefined;
        document.getElementById("retreatButton").classList.replace(`greenButton`, `redButton`);
        replacehtml(`retreatButton`, `Retreated!`);
        console.log('retreat confirmed');
    }
    else { // five seconds to confirm before retreat will reset
        game.gamestate.battleState.tempStorage.retreat = 'awaitingConfirmation';
        document.getElementById("retreatButton").classList.replace(`greenButton`, `redButton`);
        await sleep(5000);
        game.gamestate.battleState.tempStorage.retreat = undefined;
        if (!game.gamestate.battleState.retreat && document.getElementById("retreatButton")) document.getElementById("retreatButton").classList.replace(`redButton`, `greenButton`);
    }
}; window.retreat = retreat;

function addBattleControls(disabled=false) { // addBattleControls();
    replacehtml(`main`, `<button ${disabled? `` : `onclick="enemyTurn()"`} id="endTurnButton" class="endTurn${disabled? ` disabled` : ``}">End Turn</button><button onclick="retreat()" id="retreatButton" class="retreat ${game.gamestate.battleState.retreat? `redButton` : `greenButton`}">${game.gamestate.battleState.retreat? `Retreated!` : `Retreat`}</button>`);
}; window.addBattleControls = addBattleControls;

async function runDungeon() {
    let dungeon = data.dungeons[game.gamestate.dungeon];
    let battleState = game.gamestate.battleState;
    for (battleState.wave; battleState.wave < dungeon.waves.length; battleState.wave++) {
        battleState.turn = `player`; // player always gets first move
        regenMana(); // extra regen mana before every wave
        startWave();
        renderCards();
        console.log('battle');
        playerTurn();
        while (battleState.ef.length + battleState.eb.length > 0) {
            /* Kill all enemies
            game.gamestate.battleState.ef = [];
            game.gamestate.battleState.eb = [];
            */
            await sleep(250);
            if (battleState.pf.length + battleState.pb.length == 0 || (game.gamestate.battleState.retreat && game.gamestate.battleState.turn == 'player')) {
                console.log('Dungeon Failed')
                replacehtml(`gameHints`, game.gamestate.battleState.retreat? `Retreated!` : `Dungeon Failed!`);
                game.gamestate.battleState.retreat = false;
                await sleep(2500);
                return;
            }
        }
        console.log(`Wave Cleared`);
        giveRewards(data.drops.dungeon[dungeon.waves[battleState.wave].type]);
        renderCards();
        await sleep(1000);
        // Do a wave cleared animation or something
    }
    console.log('Dungeon cleared');
    replacehtml(`gameHints`, `Dungeon Cleared!`);
    await sleep(2500);
    giveRewards(data.drops.clear[dungeon.id]);
    if (!game.gamestate.dungeonsCleared[dungeon.id]) {
        game.gamestate.dungeonsCleared[dungeon.id] = true,
        giveRewards(data.drops.clear[dungeon.id+'First']);
    }
    // give rewards and stuff
}; window.runDungeon = runDungeon;

async function startDungeon() {
    let dungeon = data.dungeons[game.gamestate.dungeon];
    exitFocus();
    replacehtml(`bac`, `<img src="${dungeon.innerBac}" id="bigBacImg"><div id="battleScreen"></div>`); // battle screen is in background as it can be scrolled
    replacehtml(`main`, ``);
    // scroll the page to centre the battle
    document.getElementById(`bac`).scrollLeft = 185;
    inventory();
    replacehtml(`battleScreen`, `<div id="gameHints"></div><div id="enemyBackline" class="battleCardContainer"></div><div id="enemyFrontline" class="battleCardContainer"></div><div id="playerFrontline" class="battleCardContainer"></div><div id="playerBackline" class="battleCardContainer"></div><div id="effects"></div><div id="dialogueBox"></div>`);
    addBattleControls();
    let battleState = game.gamestate.battleState;
    battleState.eb = [];
    battleState.ef = [];
    battleState.pb = [];
    battleState.pf = [];
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        let card = game.gamestate.player.team[i];
        let characterData = JSON.stringify(card);
        let updatedStats = adjustedStats(card);
        card.hp = updatedStats.hp;
        card.mp = updatedStats.mp;
        card.str = updatedStats.str;
        card.int = updatedStats.int;
        card.mpRegen = updatedStats.mpRegen;
        card.hpRegen = updatedStats.hpRegen;
        card.armour = updatedStats.armour;
        card.physDmgIncrease = updatedStats.physDmgIncrease;
        card.magiDmgIncrease = updatedStats.magiDmgIncrease;
        card.baseStats = characterData;
        card.hpMax = card.hp;
        card.mpMax = card.mp;
        card.hpRegen = updatedStats.hpRegen;
        card.ap = 0;
        card.effects = [];
        card.specialConditions = {};
        card.skills.push('reposition');
        battleState.pb.push(card);
    }
    game.gamestate.inBattle = true;
    game.gamestate.battleState.wave = 0;
    game.gamestate.battleState.turn = 'player'; // this lets inventory know that it can be opened
    resize();
    inventory(); 
    console.log('dungeon started');
    await runDungeon();
    game.gamestate.inBattle = false;
    resetCharacterStats();
    home();
    updateTeam();
    save();
}; window.startDungeon = startDungeon;

function rank(n) {
    switch (n) {
        case 0:
            return '[N]';
        case 1:
            return '[UC]';
        case 2:
            return '[R]';
        case 3:
            return '[SR]';
        case 4:
            return '[E]';
        case 5:
            return '[L]';
        case 6:
            return '[M]';
        case 7:
            return '[G]';
        case 8:
            return '[EX]';
        default:
            return '[unknown]';
    }
}; window.rank = rank;

function resize() { // css calc is sometimes not enough (or I have a skill issue)
    // due to my lack of css knowledge or plain laziness I have devised a system to change css styles without needing to edit style.css
    // I feel like I am relying on this way too much
    // Expect css update soon (not very soon)
    // Nobody even reads this apart from me, idk who I'm talking to
    console.log('resized');
    if ((isMobileDevice() || game.forceMobile) && !game.forceDesktop) { // crappy mobile version
        document.body.style['overflow-x'] = `hidden`;
        document.body.style['overflow-y'] = `hidden`;
        let sidebarWidth = ((game.gamestate && game.gamestate.inBattle)? 740 : Math.max(740, Math.floor((game.display.x*2 - game.display.y*2 - 60) / 340) * 340 + 60)) + 40;
        let battleWidth = Math.max(game.display.x*2 - sidebarWidth, 1200);
        let batleHeight = Math.max(game.display.y*2, 1100);
        let battleCardsPosition = (battleWidth - 1020) / 2;
        if (document.getElementById('gameContainer')) document.getElementById('gameContainer').style['zoom'] = `0.5`;
        if (document.getElementById('sidebar')) document.getElementById('sidebar').style['width'] = `${sidebarWidth}px`;
        if (document.getElementById('sidebar')) document.getElementById('sidebar').style['height'] = `200vh`;
        if (document.getElementById('bac')) document.getElementById('bac').style['max-width'] = `${game.display.x*2 - sidebarWidth}px`;
        if (document.getElementById('bac')) document.getElementById('bac').style['max-height'] = `${game.display.y*2}px`;
        if (document.getElementById('bacImg')) document.getElementById('bacImg').style[(game.display.x*2 - sidebarWidth > game.display.y*2)? 'width' : 'height'] = `${Math.max(game.display.x*2 - sidebarWidth, game.display.y*2)}px`;
        if (document.getElementById('bacImg')) document.getElementById('bacImg').style[(game.display.x*2 - sidebarWidth < game.display.y*2)? 'width' : 'height'] = `auto`;
        if (document.getElementById('nav')) document.getElementById('nav').style['zoom'] = `2`;
        if (document.getElementById('money')) document.getElementById('money').style['zoom'] = `2`;
        if (document.getElementById('buttonGridInventory')) document.getElementById('buttonGridInventory').style['zoom'] = `2`;
        if (document.getElementById('buttonGridPull')) document.getElementById('buttonGridPull').style['zoom'] = `2`;
        if (document.getElementById('buttonGridShop')) document.getElementById('buttonGridShop').style['zoom'] = `2`;
        if (document.getElementById('dungeonName')) document.getElementById('dungeonName').style['width'] = `${game.display.x*2 - sidebarWidth}px`;
        if (document.getElementById('dungeonName')) document.getElementById('dungeonName').style['transform'] = `scale(1.5, 1.5)`;
        if (document.getElementById('dungeonNav')) document.getElementById('dungeonNav').style['width'] = `${game.display.x*2 - sidebarWidth}px`;
        if (document.getElementById('prevDungeon')) document.getElementById('prevDungeon').style['left'] = `20px`;
        if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['left'] = `${game.display.x*2 - sidebarWidth - 90}px`;
        if (document.getElementById('prevDungeon')) document.getElementById('prevDungeon').style['top'] = `90vh`;
        if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['top'] = `90vh`;
        if (document.getElementById('prevDungeon')) document.getElementById('prevDungeon').style['transform'] = `scale(1.5, 2.25)`;
        if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['transform'] = `scale(-1.5, 2.25)`;
        if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style['left'] = `${((game.display.x*2 - sidebarWidth) - 685) / 2}px`;
        if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style['top'] = `calc(200vh - 235px)`;
        if (document.getElementById('playButton')) document.getElementById('playButton').style['left'] = `${((game.display.x*2 - sidebarWidth) - 200) / 2}px`;
        if (document.getElementById('playButton')) document.getElementById('playButton').style['top'] = `calc(200vh - 350px)`;
        if (document.getElementById('playButton')) document.getElementById('playButton').style['transform'] = `scale(1.5, 1.5)`;
        if (document.getElementById('focus')) document.getElementById('focus').style['position'] = `absolute`;
        if (document.getElementById('focus')) document.getElementById('focus').style['top'] = `20px`;
        if (document.getElementById('focus')) document.getElementById('focus').style['left'] = `20px`;
        if (document.getElementById('focus')) document.getElementById('focus').style['height'] = `calc(200vh - 40px)`;
        if (document.getElementById('focus')) document.getElementById('focus').style['width'] = `${game.display.x*2 - sidebarWidth - 40}px`;
        if (document.getElementById('focusDescription')) document.getElementById('focusDescription').style['zoom'] = `175%`;
        if (document.getElementById('focusStats')) document.getElementById('focusStats').style['zoom'] = `110%`;
        if (document.getElementById('focusSkills')) document.getElementById('focusSkills').style['zoom'] = `175%`;
        if (document.getElementById('battleScreen')) document.getElementById('battleScreen').style['width'] = `${battleWidth}px`;
        if (document.getElementById('battleScreen')) document.getElementById('battleScreen').style['height'] = `${batleHeight}px`;
        if (document.getElementById('bigBacImg')) document.getElementById('bigBacImg').style['width'] = `${battleWidth}px`;
        if (document.getElementById('bigBacImg')) document.getElementById('bigBacImg').style['height'] = `${batleHeight}px`;
        if (document.getElementById('enemyBackline')) document.getElementById('enemyBackline').style.left = `${battleCardsPosition}px`;
        if (document.getElementById('enemyFrontline')) document.getElementById('enemyFrontline').style.left = `${battleCardsPosition}px`;
        if (document.getElementById('playerFrontline')) document.getElementById('playerFrontline').style.left = `${battleCardsPosition}px`;
        if (document.getElementById('playerBackline')) document.getElementById('playerBackline').style.left = `${battleCardsPosition}px`;
        if (document.getElementById('playerFrontline')) document.getElementById('playerFrontline').style.top = `${batleHeight - 430}px`;
        if (document.getElementById('playerBackline')) document.getElementById('playerBackline').style.top = `${batleHeight - 220}px`;
        if (document.getElementById('endTurnButton')) document.getElementById('endTurnButton').style.right = `${sidebarWidth + 10}px`;
        if (document.getElementById('retreatButton')) document.getElementById('retreatButton').style.right = `${sidebarWidth + 10}px`;
        if (document.getElementById('endTurnButton')) document.getElementById('endTurnButton').style.bottom = `20px`;
        
        if (game.altMobile) {
            if (document.getElementById('prevDungeon')) document.getElementById('prevDungeon').style['top'] = `50vh`;
            if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['top'] = `50vh`;
            if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style['top'] = `calc(100vh - 235px)`;
            if (document.getElementById('playButton')) document.getElementById('playButton').style['top'] = `calc(100vh - 350px)`;
        }
    } else {
        let sidebarWidth = ((game.gamestate && game.gamestate.inBattle)? 370 : Math.max(370, (Math.ceil((game.display.x - game.display.y - 30) / 170)-1) * 170 + 30))+40;
        let battleWidth = Math.max(game.display.x - sidebarWidth, 1200);
        let batleHeight = Math.max(game.display.y, 1100);
        let battleCardsPosition = (battleWidth - 1020) / 2;
        if (document.getElementById('sidebar')) document.getElementById('sidebar').style.width = `${sidebarWidth}px`;
        if (document.getElementById('bac')) document.getElementById('bac').style['max-width'] = `${game.display.x - sidebarWidth}px`;
        if (document.getElementById('bac')) document.getElementById('bac').style['max-height'] = `100vh`;
        if (document.getElementById('bacImg')) document.getElementById('bacImg').style['min-width'] = `${Math.max(game.display.x - sidebarWidth, game.display.y)}px`;
        if (document.getElementById('bacImg')) document.getElementById('bacImg').style['min-height'] = `${Math.max(game.display.x - sidebarWidth, game.display.y)}px`;
        if (document.getElementById('dungeonName')) document.getElementById('dungeonName').style['width'] = `${game.display.x - sidebarWidth}px`;
        if (document.getElementById('dungeonNav')) document.getElementById('dungeonNav').style['width'] = `${game.display.x - sidebarWidth}px`;
        if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['left'] = `${game.display.x - sidebarWidth - 80}px`; // grrrr there has to be a better way
        if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style.left = `${((game.display.x - sidebarWidth) - 685) / 2}px`;
        if (document.getElementById('playButton')) document.getElementById('playButton').style.left = `${((game.display.x - sidebarWidth) - 200) / 2}px`;
        if (document.getElementById('focus')) document.getElementById('focus').style.width = `${game.display.x - sidebarWidth - 10}px`;
        if (document.getElementById('battleScreen')) document.getElementById('battleScreen').style['width'] = `${battleWidth}px`;
        if (document.getElementById('battleScreen')) document.getElementById('battleScreen').style['height'] = `${batleHeight}px`;
        if (document.getElementById('bigBacImg')) document.getElementById('bigBacImg').style['width'] = `${battleWidth}px`;
        if (document.getElementById('bigBacImg')) document.getElementById('bigBacImg').style['height'] = `${batleHeight}px`;
        if (document.getElementById('enemyBackline')) document.getElementById('enemyBackline').style.left = `${battleCardsPosition}px`;
        if (document.getElementById('enemyFrontline')) document.getElementById('enemyFrontline').style.left = `${battleCardsPosition}px`;
        if (document.getElementById('playerFrontline')) document.getElementById('playerFrontline').style.left = `${battleCardsPosition}px`;
        if (document.getElementById('playerBackline')) document.getElementById('playerBackline').style.left = `${battleCardsPosition}px`;
        if (document.getElementById('playerFrontline')) document.getElementById('playerFrontline').style.top = `${batleHeight - 430}px`;
        if (document.getElementById('playerBackline')) document.getElementById('playerBackline').style.top = `${batleHeight - 220}px`;
        if (document.getElementById('endTurnButton')) document.getElementById('endTurnButton').style.right = `${sidebarWidth + 10}px`;
        if (document.getElementById('retreatButton')) document.getElementById('retreatButton').style.right = `${sidebarWidth + 10}px`;
    }
}; window.resize = resize;

function fetchBar(id) {
    //console.log(getComputedStyle(document.getElementById(id)).minWidth);
    if (document.getElementById(id)) return parseFloat(getComputedStyle(document.getElementById(id)).minWidth.slice(0, -2))/60;
    else console.error(`can not find card id: ${id}`);
}; window.fetchBar = fetchBar;

function updateBar(id, percent, value=-1000000000) {
    percent = Math.min(percent, 100);
    if (document.getElementById(id)) {
        document.getElementById(id).style.minWidth = `${Math.max(0, percent)*60}px`;
        if (value > -1000000000) document.getElementById(id+`Display`).innerHTML = bigNumber(Math.floor(value)); // scuffed but necessary (idk what this does anymore)
    }
    else console.error(`can not find card id: ${id}`);
}; window.updateBar = updateBar;

function inTeam(characterId) {
    let playerTeam = game.gamestate.player.team;
    for (let i = 0; i < playerTeam.length; i++) {
        if (playerTeam[i] && playerTeam[i].name == game.gamestate.player.characters[characterId].name) return true;
    }
    return false;
}; window.inTeam = inTeam;

function addToTeam(characterId) {
    let character = game.gamestate.player.characters[characterId];
    game.gamestate.player.team.push(character);
    updateTeam();
    focusCharacter(characterId);
    save();
}; window.addToTeam = addToTeam;

function removeFromTeam(characterId) {
    let character = game.gamestate.player.characters[characterId];
    let playerTeam = game.gamestate.player.team;
    let nTeam = []
    for (let i = 0; i < playerTeam.length; i++) {
        if (playerTeam[i] && playerTeam[i].name != character.name) {
            nTeam.push(playerTeam[i]);
        }
    }
    game.gamestate.player.team = nTeam;
    updateTeam();
    focusCharacter(characterId);
    save();
}; window.removeFromTeam = removeFromTeam;

function inventorySellItem(itemId, isShop=false) {
    let item = isShop? getItemByName(data.items[itemId].name) : game.gamestate.player.inventory[itemId];
    item.quantity -= 1;
    game.gamestate.player.money += item.sellPrice;
    if (item.quantity <= 0) {
        let newItem = [];
        for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
            if (game.gamestate.player.inventory[i].quantity > 0) newItem.push(game.gamestate.player.inventory[i]);
        }
        game.gamestate.player.inventory = newItem;
        if (!isShop) exitFocus();
        else focusItem(itemId, isShop);
    } else {
        focusItem(itemId, isShop);
    }
    if (isShop) shop();
    else inventory();
    save();
}; window.inventorySellItem = inventorySellItem;

function inventoryBuyItem(itemId, isShop=false) {
    let item = isShop? data.items[itemId] : game.gamestate.player.inventory[itemId];
    addItem(item);
    game.gamestate.player.money -= item.purchacePrice;
    focusItem(itemId, isShop);
    if (isShop) shop();
    else inventory();
    save();
}; window.inventoryBuyItem = inventoryBuyItem;

function replaceWeapon(characterId, weaponId) {
    let character = game.gamestate.player.characters[characterId];
    let item = game.gamestate.player.inventory[weaponId];
    if (character.inventory[item.effects.slot]) addItem(character.inventory[item.effects.slot]);
    character.inventory[item.effects.slot] = JSON.parse(JSON.stringify(item))
    character.inventory[item.effects.slot].quantity = 1;
    item.quantity--;
    if (item.quantity <= 0) {
        let newItems = [];
        for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
            if (game.gamestate.player.inventory[i].quantity > 0) newItems.push(game.gamestate.player.inventory[i]);
        }
        game.gamestate.player.inventory = newItems;
    }
    replaceWeaponMenu(characterId);
    focusCharacter(characterId);
    updateTeam();
    save();
}; window.replaceWeapon = replaceWeapon;

function replaceWeaponMenu(characterId) {
    inventory(false, function(item) {return item.equipable}); 
    replacehtml(`money`, `<span><strong>Equip Item</strong></span>`); // Use the inventory as a template
    Array.from(document.getElementById('buttonGridInventory').children).forEach(child => {
        if (child instanceof HTMLButtonElement) {
            const popup = document.createElement('span');
            popup.className = "popup";
            popup.innerHTML = getCompactStats(game.gamestate.player.inventory[child.id.slice(4)]);
            child.appendChild(popup);
            child.onclick = function() {replaceWeapon(characterId, child.id.slice(4))};
        }
    });
}; window.replaceWeaponMenu = replaceWeaponMenu;

function focusItem(itemId, isShop=false) {
    let item = isShop? data.items[itemId] : game.gamestate.player.inventory[itemId];
    console.log(item);
    let numItems = isShop? (getItemByName(item.name)? getItemByName(item.name).quantity : 0) : item.quantity;
    let stats = `<img src="assets/box.png" class="mediumIconDown"> ${numItems} in inventory<br>`;
    stats += `<br><span class="veryBig"><strong>Stats:</strong></span><br>`;
    if (item.effects) {
        if (item.useable) {
            for (let j = 0; j < item.effects.length; j++) {
                let effect = data.effects[item.effects[j].effect];
                stats += `Applies effect:<br>`;
                for (let k = 0; k < effect.stats.length; k++) {
                    stats += `<img src="assets/${effect.stats[k].icon}" class="mediumIconDown"> ${effect.stats[k].desc}<br>`;
                }
            }
        } else if (item.equipable) {
            stats += `When ${item.effects.slot == hand? `in main hand` : `on body`}:<br>`;
            if (JSON.stringify(item.effects.atk.physical) != JSON.stringify([0,0,-1])) {
                stats += `<img src="assets/redSword.png" class="mediumIconDown">${item.effects.atk.physical[0]? ` +${item.effects.atk.physical[0]} `: ``}${item.effects.atk.physical[0] && item.effects.atk.physical[1]? `or`: ``}${item.effects.atk.physical[1]? ` +${item.effects.atk.physical[1]}%`: ``} dmg ${item.effects.atk.physical[2] == -1? ``: `(max ${item.effects.atk.physical[2]})`}<br>`;
            }
            if (JSON.stringify(item.effects.atk.magic) != JSON.stringify([0,0,-1])) {
                stats += `<img src="assets/blueStar.png" class="mediumIconDown">${item.effects.atk.magic[0]? ` +${item.effects.atk.magic[0]} `: ``}${item.effects.atk.magic[0] && item.effects.atk.magic[1]? `or`: ``}${item.effects.atk.magic[1]? ` +${item.effects.atk.magic[1]}%`: ``} dmg ${item.effects.atk.magic[2] == -1? ``: `(max ${item.effects.atk.magic[2]})`}<br>`;
            }
            if (JSON.stringify(item.effects.def.physical) != JSON.stringify([0,0])) {
                stats += `${item.effects.def.physical[0]? `<img src="assets/shield.png" class="mediumIconDown"> +${item.effects.def.physical[0]} physical negation<br>`: ``}${item.effects.def.physical[1]? `<img src="assets/shield.png" class="mediumIconDown"> +${item.effects.def.physical[1]}% physical resistance<br>`: ``}`;
            }
            if (JSON.stringify(item.effects.def.magic) != JSON.stringify([0,0])) {
                stats += `${item.effects.def.magic[0]? `<img src="assets/blueShield.png" class="mediumIconDown"> +${item.effects.def.magic[0]} magical negation<br>`: ``}${item.effects.def.magic[1]? `<img src="assets/blueShield.png" class="mediumIconDown"> +${item.effects.def.magic[1]}% magical resistance<br>`: ``}`;
            }
            if (item.effects.stat.str != 0) {
                stats += `<img src="assets/redSword.png" class="mediumIconDown"> ${item.effects.stat.str > 0? `+` : ``}${item.effects.stat.str*100}% strength<br>`;
            }
            if (item.effects.stat.int != 0) {
                stats += `<img src="assets/blueStar.png" class="mediumIconDown"> ${item.effects.stat.int > 0? `+` : ``}${item.effects.stat.int}% intelligence<br>`;
            }
            if (JSON.stringify(item.effects.stat.hp) != JSON.stringify([0,0])) {
                stats += `${item.effects.stat.hp[0]? `<img src="assets/redCross.png" class="mediumIconDown"> +${item.effects.stat.hp[0]} max hp<br>`: ``}${item.effects.stat.hp[1]? `<img src="assets/redCross.png" class="mediumIconDown"> +${item.effects.stat.hp[1]}% max hp<br>`: ``}`;
            }
            if (JSON.stringify(item.effects.stat.mp) != JSON.stringify([0,0])) {
                stats += `${item.effects.stat.mp[0]? `<img src="assets/blueStar.png" class="mediumIconDown"> +${item.effects.stat.mp[0]} max mp<br>`: ``}${item.effects.stat.mp[1]? `<img src="assets/blueStar.png" class="mediumIconDown"> +${item.effects.stat.mp[1]}% max mp<br>`: ``}`;
            }
            if (item.effects.stat.hpReg != 0) {
                stats += `<img src="assets/${item.effects.stat.hpReg > 0? `greenCross` : `redDrop`}.png" class="mediumIconDown"> ${item.effects.stat.hpReg > 0? `+` : ``}${item.effects.stat.hpReg} hp regen per round<br>`;
            }
            if (item.effects.stat.mpReg != 0) {
                stats += `<img src="assets/blueStar.png" class="mediumIconDown"> ${item.effects.stat.mpReg > 0? `+` : ``}${item.effects.stat.mpReg} mp regen per round<br>`;
            }
            if (item.effects.attackEffects.length > 0) {
                stats += `<br>Applies effect to target:<br>`;
                for (let effect of item.effects.attackEffects) {
                    for (let k = 0; k < data.effects[effect].stats.length; k++) {
                        stats += `<img src="assets/${data.effects[effect].stats[k].icon}" class="mediumIconDown"> ${data.effects[effect].stats[k].desc}<br>`;
                    }
                }
            }
        }
    }
    let shop = `<div id="inventoryShop">`;
    if (item.purchaceable) shop += `<button ${(game.gamestate.player.money >= item.purchacePrice ? `onclick="inventoryBuyItem(${itemId}, ${isShop})"` : `class="disabled2"`)} id="buyButton"> Buy 1 ($${bigNumber(item.purchacePrice)})</button>`;
    if (item.purchaceable && item.sellable) shop += `<span id="wasteOfSpace"></span>`;
    console.log(numItems);
    if (item.sellable) shop += `<button ${numItems > 0? `onclick="inventorySellItem(${itemId}, ${isShop})"` : `class="disabled2"`} id="sellButton">Sell 1 ($${bigNumber(item.sellPrice)})</button>`;
    shop += `</div>`;
    document.getElementById('focus').style.display = `block`;
    replacehtml(`focusTitle`, `<span id="rank${item.rarity}Text"><strong>${rank(item.rarity)} ${item.name} </strong></span>`);
    replacehtml(`focusImageContainer`, `<img src="${item.pfp}" class="focusIcon">`);
    replacehtml(`focusDescription`, item.description);
    replacehtml(`focusStats`, stats);
    replacehtml(`focusSkills`, shop);
}; window.focusItem = focusItem;

function focusCharacter(characterId, addExp=true) { 
    let character = game.gamestate.player.characters[characterId];
    if (addExp) increaseExp(characterId);
    let items = `<button id="focusItemHand" class="itemContainer" onClick="replaceWeaponMenu(${characterId}, 'hand')"><img src="${character.inventory.hand? character.inventory.hand.pfp : 'assets/greySword.png'}" class="characterIcon${character.inventory.hand? `` : ` disabled2 watermark`}">${character.inventory.hand? `<span class="popup">${getCompactStats(character.inventory.hand)}</span>` : ``}</button><button id="focusItemBody" class="itemContainer" onClick="replaceWeaponMenu(${characterId}, 'body')"><img src="${character.inventory.body? character.inventory.body.pfp : 'assets/greyChestplate.png'}" class="characterIcon${character.inventory.hand? `` : ` disabled2 watermark`}">${character.inventory.body? `<span class="popup">${getCompactStats(character.inventory.body)}</span>` : ``}</button><br>`;
    let stats = `<strong>Stats:</strong><br><img src="assets/redCross.png" class="mediumIconDown"> ${adjustedStats(character).hp} health points<br><img src="assets/blueStar.png" class="mediumIconDown"> ${adjustedStats(character).mp} mana points<br><img src="assets/shield.png" class="mediumIconDown"> ${adjustedStats(character).armour.physical[0]} physical negation<br><img src="assets/shield.png" class="mediumIconDown"> ${adjustedStats(character).armour.physical[1]}% physical resistance<br><img src="assets/blueShield.png" class="mediumIconDown"> ${adjustedStats(character).armour.magic[0]} magical negation<br><img src="assets/blueShield.png" class="mediumIconDown"> ${adjustedStats(character).armour.magic[1]}% magical resistance<br>`;
    let skills = `<br><span class="veryBig"><strong>Skills:</strong></span><br>`;
    for (let i = 0; i < character.skills.length; i++) {
        let skill = `<span class="bigger">${data.skills[character.skills[i]].name}</span><br>`;
        skill += `<span class="smaller">${data.skills[character.skills[i]].desc.replace('[attacker]', character.name).replace('[pronoun]', character.gender == female ? 'her' : 'his')}</span><br>`;
        let dmg = calcDamage({...character, ...adjustedStats(character)}, data.skills[character.skills[i]]);
        if (data.skills[character.skills[i]].dmg > 0) skill += `<img src="assets/lightning.png" class="smallIcon"> ${dmg} damage<br>`;
        else if (data.skills[character.skills[i]].dmg < 0) skill += `<img src="assets/greenCross.png" class="smallIcon"> ${-dmg} heal<br>`;
        if (data.skills[character.skills[i]].extraStats) {
            for (let j = 0; j < data.skills[character.skills[i]].extraStats.length; j++) {
                skill += `<img src="assets/${data.skills[character.skills[i]].extraStats[j].icon}" class="smallIcon"> ${data.skills[character.skills[i]].extraStats[j].desc}<br>`;
            }
        }
        if (data.skills[character.skills[i]].effects) {
            for (let j = 0; j < data.skills[character.skills[i]].effects.length; j++) {
                let effect = data.effects[data.skills[character.skills[i]].effects[j].effect];
                //console.log(effect);
                skill += `${data.skills[character.skills[i]].effects[j].chance == 100? `applies` : `${data.skills[character.skills[i]].effects[j].chance}% chance to apply`} effect:<br>`;
                for (let k = 0; k < effect.stats.length; k++) {
                    skill += `<img src="assets/${effect.stats[k].icon}" class="smallIcon"> ${effect.stats[k].desc}<br>`;
                }
            }
        }
        if (data.skills[character.skills[i]].cost.hp) skill += `<img src="assets/redDrop.png" class="smallIcon"> consumes ${data.skills[character.skills[i]].cost.hp} hp<br>`;
        if (data.skills[character.skills[i]].cost.mp) skill += `<img src="assets/blueStar.png" class="smallIcon"> consumes ${data.skills[character.skills[i]].cost.mp} mp<br>`;
        if (data.skills[character.skills[i]].attacks > 1) skill += `<img src="assets/lightnings.png" class="smallIcon"> ${data.skills[character.skills[i]].attacks} attacks<br>`;
        skill += `<img src="assets/explosion.png" class="smallIcon"> ${data.skills[character.skills[i]].selfOnly? 'self only' : data.skills[character.skills[i]].targeting}<br>`;
        skill += `<br>`;
        skills += skill;
    }
    let shop = `<div id="inventoryShop">`;
    if (inTeam(characterId)) shop += `<button onclick="removeFromTeam(${characterId})" id="sellButton">Remove from Team</button>`;
    else if (game.gamestate.player.team.length < 4 && character.alive) shop += `<button onclick="addToTeam(${characterId})" id="buyButton">Add to Team</button>`;
    else shop += `<button id="cantBuyButton">Add to Team</button>`;
    if (!character.alive) shop += `<button id="sellButton" class="disabled">Revive</button>`;
    shop += `</div>`;
    document.getElementById('focus').style.display = `block`;
    replacehtml(`focusTitle`, `<span id="rank${character.rarity}Text"><strong>${rank(character.rarity)} ${character.alive? `` : `<s>`}${character.title} ${character.name}${character.alive? `` : `</s>`} </strong></span>`);
    replacehtml(`focusImageContainer`, `<img src="${character.pfp}" class="focusIcon${character.alive? `` : ` grey  disabled`}">`);
    replacehtml(`focusDescription`, `${character.description}${character.alive? `` : ` ${character.name} has died!`}`);
    replacehtml(`focusStats`, items + getExpBar(character) + stats);
    replacehtml(`focusSkills`, shop + skills);
}; window.focusCharacter = focusCharacter;

function exitFocus() {
    document.getElementById('focus').style.display = `none`;
}; window.exitFocus = exitFocus;

function getExpBar(character, set=false) {
    let levelUpExp = eval(data.leveling.replace('[l]', character.level).replace('[r]', character.rarity));
    let expBar = `<div id="expBarInner" style="width:${character.exp / levelUpExp * 100}%"></div><div id="expDescription">Level ${character.level}: ${character.exp > 1000000000? bigNumber(character.exp) : character.exp}/${levelUpExp > 1000000000? bigNumber(levelUpExp) : levelUpExp}</div>`;
    if (!set) return `<div id="expBarOuter">${expBar}</div>`;
    if (document.getElementById('expBarOuter')) replacehtml('expBarOuter', expBar);
}; window.getExpBar = getExpBar;

async function increaseExp(characterId, expIncrease=-1, minRate=10, maxRate=Infinity) {
    let character = game.gamestate.player.characters[characterId];
    if (expIncrease == -1) {
        console.log('adding stored exp');
        expIncrease = character.expToAdd;
        character.expToAdd = 0;
    }
    let rate = Math.floor(Math.min(maxRate, Math.max(minRate, expIncrease/90)));
    while (expIncrease > 0) {
        character.exp += Math.min(rate, expIncrease);
        expIncrease -= rate;
        await sleep(15);
        getExpBar(character, true);
        handleLevelUp(characterId);
    }
    if (expIncrease < 0) expIncrease = 0;
    save();
}; window.increaseExp = increaseExp;

function handleLevelUp(characterId) {
    let character = game.gamestate.player.characters[characterId];
    let levelUpExp = eval(data.leveling.replace('[l]', character.level).replace('[r]', character.rarity));
    let leveledUp = false;
    while (character.exp > levelUpExp) {
        character.exp -= levelUpExp;
        character.level++;
        character.hp += data.levelUpStatChange[character.rarity].hp * (character.spec == hp? 1.5 : 1) * (character.spec == mp? 0.5 : 1);
        character.mp += data.levelUpStatChange[character.rarity].mp * (character.spec == mp? 1.5 : 1) * (character.spec == hp? 0.5 : 1);
        character.str *= data.levelUpStatChange[character.rarity].str;
        character.int *= data.levelUpStatChange[character.rarity].int;
        character.str = Math.ceil(character.str*1000)/1000;
        character.int = Math.ceil(character.int);
        levelUpExp = eval(data.leveling.replace('[l]', character.level).replace('[r]', character.rarity));
        leveledUp = true;
    }
    if (leveledUp) {
        focusCharacter(characterId, false);
        characters();
        updateTeam();
    }
}; window.handleLevelUp = handleLevelUp;

function updateTeam() {
    let canBattle = false;
    let buttonGridHtml = ``;
    let nTeam = [];
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        if (game.gamestate.player.team[i].alive) {
            nTeam.push(game.gamestate.player.team[i]);
        }
    }
    game.gamestate.player.team = nTeam;
    for (let i = 0; i < 4; i++) {
        if (game.gamestate.player.team[i] != undefined) {
            buttonGridHtml += createCharacterCard({...game.gamestate.player.team[i], ...adjustedStats(game.gamestate.player.team[i])});
            canBattle = true;
        } else {
            buttonGridHtml += blankCard(-1);
        }
    }
    console.log(buttonGridHtml);
    replacehtml(`teamSelection`, `<div id="teamContainer">${buttonGridHtml}</div>`);
    if (canBattle) {
        replacehtml(`playButton`, `<button onclick="startDungeon()" id="readyPlayButton">Enter Dungeon</button>`);
    } else {
        replacehtml(`playButton`, `<button id="notReadyPlayButton">Enter Dungeon</button>`);
    }
}; window.updateTeam = updateTeam;

function addCharacter(character) {
    for (let i = 0; i < game.gamestate.player.characters.length; i++) {
        if (character.name == game.gamestate.player.characters[i].name) {
            game.gamestate.player.characters[i].expToAdd += Math.floor(Math.max(eval(data.leveling.replace('[l]', game.gamestate.player.characters[i].level).replace('[r]', game.gamestate.player.characters[i].rarity))*0.5, 5000*(game.gamestate.player.characters[i].rarity+1)**1.5));
            return;
        }
    }
    game.gamestate.player.characters.push(character);
}; window.addCharacter = addCharacter;

function addItem(itemData) {
    let item = JSON.parse(JSON.stringify(itemData));
    for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
        if (item.name == game.gamestate.player.inventory[i].name) {
            game.gamestate.player.inventory[i].quantity++;
            return;
        }
    }
    item.quantity = 1;
    game.gamestate.player.inventory.push(item);
}; window.addItem = addItem;

function acceptReward(id) {
    let selected = getCardById(id);
    selected.hidden = undefined;
    replacehtml(`rewards`, cardLine(game.tempStorage.rewardCards, 'RR', 'acceptReward'));
    for (let i = 0; i < game.tempStorage.rewardCards.length; i++) {
        if (game.tempStorage.rewardCards[i].hidden) document.getElementById(`RR${i}ID`).classList.add('hasQuestionMark');
    }
}; window.acceptReward = acceptReward;

function lightRay(r = 0, centre={x: 0, y: 0}) {
    let particle = {
        id: generateId(),
        life: -1,
        speed: 1,
        rot: r,
        type: 'spin',
    };

    console.log(particle);
    let html = `<div id="${particle.id}" class="lightRay"></div>`;
    addhtml('effects', html);
    document.getElementById(particle.id).style.opacity = 1;
    document.getElementById(particle.id).style.transform = `scale(2, 2) rotate(${r}.69deg)`;
    console.log(document.getElementById(particle.id).style.transform);
    document.getElementById(particle.id).style.top = centre.y? `${centre.y - 180}px`: `calc(50vh - 180px)`;
    document.getElementById(particle.id).style.left = centre.x? `${centre.x - 1080}px`: `calc(50vw - ${180*4}px)`;
    game.particles[particle.id] = particle;
}; window.lightRay = lightRay;

async function gachaPull(id) {
    console.log(id);
    let pullUsed = data.pulls[id];

    // calculate costs
    if (game.gamestate.player.money >= pullUsed.cost) game.gamestate.player.money -= pullUsed.cost;
    else return;
    let nPulls = [];
    for (let i = 0; i < game.gamestate.pulls.length; i++) {
        if (game.gamestate.pulls[i].id == id && game.gamestate.pulls[i].quantity) {
            if (game.gamestate.pulls[i].quantity) {
                game.gamestate.pulls[i].quantity--;
                if (game.gamestate.pulls[i].quantity <= 0) continue;
            }
        }
        nPulls.push(game.gamestate.pulls[i]);
    }
    game.gamestate.pulls = nPulls;

    // fancy effects
    exitFocus();
    let bgGlow = {
        id: generateId(),
        life: -1,
        type: '',
    };
    let bg = {
        id: generateId(),
        life: -1,
        type: '',
    };
    addhtml('effects', `<div id="${bg.id}" class="pullBackground"></div><div id="${bgGlow.id}" class="pullBackgroundGlow"></div>`);
    game.particles[bg.id] = bg;
    game.particles[bgGlow.id] = bgGlow;
    let lights = 10
    for (let i = 0; i < lights; i++) {
        lightRay(360/lights*i+randint(0, 40)-20);
    }
    // TODO: Implement Confetti

    // give rewards
    let cards = [];
    for (let i = 0; i < pullUsed.attempts; i++) {
        let rng = randint(1,100);
        //rng--;
        let rarity = 8; // If the system breaks, get an EX rank character
        for (let i = 0; i < pullUsed.rates.length; i++) {
            if (rng <= pullUsed.rates[i]) {
                rarity = i;
                break;
            }
            else rng -= pullUsed.rates[i];
        }
        if (randint(1,100) < pullUsed.itemCharacterBias) {
            console.log('item');
            let card = JSON.parse(JSON.stringify({...randProperty(data.pullItems[rarity]), ...{hidden: true}}));
            cards.push(card);
            addItem(card);
            //game.gamestate.player.inventory.push(card);
        } else {
            let card = JSON.parse(JSON.stringify({...randProperty(data.characters[rarity]), ...data.characterData, ...{hidden: true}}));
            cards.push(card);
            addCharacter(card);
        }
    }
    game.tempStorage.rewardCards = cards;
    save(); // no cheesing the pulls by reloading
    addhtml('effects', `<div id="rewards" class="rewardCardContainer" style="z-index: 2; top: calc(50vh - ${cards.length > 5? 315 : 210}px); left: calc(50vw - 425px);"></div><button onclick="clearParticles()" id="closeRewards">Close</button>`);
    replacehtml(`rewards`, cardLine(cards, 'RR', 'acceptReward'));
    for (let i = 0; i < game.tempStorage.rewardCards.length; i++) {
        document.getElementById(`RR${i}ID`).classList.add('hasQuestionMark');
    }
    // reload the pulls
    pull();
}; window.gachaPull = gachaPull;

function pull() {
    replacehtml(`nav`, `<button onclick="pull()" class="focusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button><button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${bigNumber(game.gamestate.player.money)}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.pulls.length; i++) {
        let pull = data.pulls[game.gamestate.pulls[i].id];
        let title = `<strong>${pull.name}${game.gamestate.pulls[i].quantity? `(${game.gamestate.pulls[i].quantity})` : ``}</strong>`;
        let desc = `$${bigNumber(pull.cost)}`;
        let buttonData = `onclick="gachaPull('${pull.pullData.id}')" class="pullButton ${pull.colour}Button"`;
        buttonGridHtml += `<button ${buttonData}><p>${title}<br>${desc}</p></button>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridPull">${buttonGridHtml}</div>`);
    resize();
}; window.pull = pull;

function inventory(forceBattleMode=false, filter=function(item) {return true}) {
    console.log('inventory');
    game.gamestate.player.inventory = sortInventory(game.gamestate.player.inventory);
    if (game.gamestate.inBattle || forceBattleMode) {
        filter = function(item) {return item.useable};
        if (game.gamestate.battleState.turn != 'player') return;
        game.gamestate.battleState.tempStorage.activeCardId = undefined;
        game.gamestate.battleState.tempStorage.skillId = undefined;
        renderCards();
        for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
            document.getElementById(`PB${i}ID`).className = document.getElementById(`PB${i}ID`).className.replace(` selected`, ``);
        }
        for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
            document.getElementById(`PF${i}ID`).className = document.getElementById(`PF${i}ID`).className.replace(` selected`, ``);
        }
        for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
            document.getElementById(`EB${i}ID`).className = document.getElementById(`EB${i}ID`).className.replace(` selected`, ``);
        }
        for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
            document.getElementById(`EF${i}ID`).className = document.getElementById(`EF${i}ID`).className.replace(` selected`, ``);
        }
        renderCards(`selectAction`, `selectAction`);
        replacehtml(`nav`, `<button onclick="inventory()" class="focusedButton"><h3>Inventory</h3></button><button onclick="skills()" class="unFocusedButton"><h3>Skills</h3></button>`);
        replacehtml(`money`, `<span><strong>Use Item</strong></span>`);
    }
    else {
        replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="focusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button><button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>`);
        replacehtml(`money`, `<span><strong>Money: $${bigNumber(game.gamestate.player.money)}</strong></span>`);
    }
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
        if (filter(game.gamestate.player.inventory[i])) {
            buttonGridHtml += itemCard(game.gamestate.player.inventory[i], i);
        }
    }
    if (buttonGridHtml == ``) {
        buttonGridHtml = `<p>Inventory is empty</p>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
    resize();
}; window.inventory = inventory;

function characters() {
    game.gamestate.player.characters = sortInventory(game.gamestate.player.characters);
    replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="focusedButton"><h3>Characters</h3></button><button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${bigNumber(game.gamestate.player.money)}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.player.characters.length; i++) {
        if (game.gamestate.player.characters[i].hidden) game.gamestate.player.characters[i].hidden = undefined; // unhide any hidden characters
        let title = `<strong>${game.gamestate.player.characters[i].alive? `` : `<s>`}${game.gamestate.player.characters[i].name}${game.gamestate.player.characters[i].alive? `` : `</s>`}</strong>`;
        let desc = `<img src="assets/redCross.png" class="smallIcon"> ${bigNumber(adjustedStats(game.gamestate.player.characters[i]).hp)}\n<img src="assets/blueStar.png" class="smallIcon"> ${bigNumber(adjustedStats(game.gamestate.player.characters[i]).mp)}\n<img src="assets/lightning.png" class="smallIcon"> ${game.gamestate.player.characters[i].stats.atk}\n<img src="assets/shield.png" class="smallIcon"> ${game.gamestate.player.characters[i].stats.def}`;
        let buttonData = `onclick="focusCharacter(${i})" class="characterButton" id="rank${game.gamestate.player.characters[i].rarity}Button"`;
        buttonGridHtml += `<span><button ${buttonData}><p class="noPadding characterTitle">${title}</p><img src="${game.gamestate.player.characters[i].pfp}" class="characterIcon${game.gamestate.player.characters[i].alive? `` : ` grey disabled`}"><p class="noPadding statsText">${desc}</p></button></span>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
    resize();
}; window.characters = characters;

function shop() {
    replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button><button onclick="shop()" class="focusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${bigNumber(game.gamestate.player.money)}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < data.items.length; i++) {
        if (data.items[i].purchaceable) buttonGridHtml += itemCard(data.items[i], i, false, true).replace(`<span id="placeholder"><p class="noPadding medium"> `, `<span id="placeholder"><p class="noPadding medium">$${data.items[i].purchacePrice}`);
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
    resize();
}; window.shop = shop;

function clearData() {
    localStorage.removeItem('GatchaGameGamestate');
    console.log('cleared previous data');
}; window.clearData = clearData;

function save() {
    if (game.debug) {
        console.warn(`Saving is disabled in debug mode!`);
        return;
    }
    console.log(`Game Saved`);
    localStorage.setItem('GatchaGameGamestate', JSON.stringify(game.gamestate));
}; window.save = save;

function debug() {
    console.log(`Giving Player Debug Items`);
    game.gamestate.player.inventory = [];
    game.gamestate.player.characters = [];
    game.gamestate.player.money = 69420;
    for (let i = 0; i < data.items.length; i++) {
        game.gamestate.player.inventory.push(JSON.parse(JSON.stringify(data.items[i])));
        game.gamestate.player.inventory[i].quantity = randint(1,100);
    }
    for (let i = 0; i < data.characters.length; i++) {
        Object.keys(data.characters[i]).forEach(function(key) {
            game.gamestate.player.characters.push(JSON.parse(JSON.stringify({...data.characters[i][key], ...data.characterData})));
        });
    }
}; window.debug = debug;

async function startGame(debug=false) {
    game.debug = debug;
    var savedPlayer = debug? null : localStorage.getItem('GatchaGameGamestate');
    if (savedPlayer) {
        console.log('loading previous save');
        game.gamestate = JSON.parse(savedPlayer);
        console.log(savedPlayer);
    } else {
        // No saved data found
        console.log('no save found, creating new player');
        game.gamestate = JSON.parse(JSON.stringify(data.startingGamestate));

        game.gamestate.pulls.push(JSON.parse(JSON.stringify(data.pulls.startingBonus.pullData))); // give player starting bonus
        game.gamestate.pulls.push(JSON.parse(JSON.stringify(data.pulls.starterPull.pullData)));
        game.gamestate.pulls.push(JSON.parse(JSON.stringify(data.pulls.normalPull.pullData)));
        game.gamestate.pulls.push(JSON.parse(JSON.stringify(data.pulls.bronzePull.pullData)));
        game.gamestate.pulls.push(JSON.parse(JSON.stringify(data.pulls.silverPull.pullData)));
        game.gamestate.pulls.push(JSON.parse(JSON.stringify(data.pulls.goldPull.pullData)));
        game.gamestate.pulls.push(JSON.parse(JSON.stringify(data.pulls.megaGoldPull.pullData)));
        game.gamestate.pulls.push(JSON.parse(JSON.stringify(data.pulls.spedPull.pullData)));

        game.gamestate.player.characters.push(JSON.parse(JSON.stringify({...data.characters[8]['Eco'], ...data.characterData})));
        game.gamestate.player.characters.push(JSON.parse(JSON.stringify({...data.characters[8]['Eric'], ...data.characterData})));
    };

    await sleep(100);

    home();

    // update effects for the rest of the session
    await sleep(100);
    console.log('starting up effects');
    while (1) {
        await new Promise(resolve => setTimeout(resolve, 250));
        handleEffects();
    }
}; window.startGame = startGame;

function setDungeon(dungeon) {
    game.gamestate.dungeon = dungeon;
    replacehtml(`bac`, `<img src="${data.dungeons[game.gamestate.dungeon].outerBac}" id="bacImg"> `);
    replacehtml(`dungeonTitle`, `<div id="dungeonName">${data.dungeons[game.gamestate.dungeon].name}</div>`);
    let navHtml = `<div id="prevDungeon" class="leftNextButtonBack"><button class="leftNextButton${data.dungeons[game.gamestate.dungeon-1]? `` : ` disabled`}" ${data.dungeons[game.gamestate.dungeon-1]? `onclick="setDungeon(${game.gamestate.dungeon-1})"` : ``}></button></div> <div id="nextDungeon" class="rightNextButtonBack"><button class="rightNextButton${data.dungeons[game.gamestate.dungeon+1]? `` : ` disabled`}" ${data.dungeons[game.gamestate.dungeon+1]? `onclick="setDungeon(${game.gamestate.dungeon+1})"` : ``}></button></div>`;
    replacehtml(`dungeonNav`, navHtml);
    resize();
    save();
}; window.setDungeon = setDungeon;

async function home() {
    let homePage = `
    <div id="bac">
        <img src="${data.dungeons[game.gamestate.dungeon].outerBac}" id="bacImg"> 
    </div>
    <span id="main">
        <div id="dungeonTitle"></div>
        <div id="dungeonNav"></div>
        <div id="playButton"></div>
        <div id="teamSelection"></div>
        <div id="focus">
            <div id="focusTopRow">
                <span id="focusTitle"><strong></strong></span>
                <span id="exitFocus">
                    <button onclick="exitFocus()" class="closeButton"><img src="assets/greyX.png" class="mediumIcon"></button>
                </span>
            </div>
            <div id="focusBody">
                <div id="focusImageContainer"></div>
                <span id="focusDescription"></span>
                <div id="focusStats"></div>
                <div id="focusSkills"></div>
            </div>
        </div>
        <div id="effects"></div>
    </span>
    <span id="sidebar">
        <div id="nav">
            <button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button>
            <button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button>
            <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button>
            <button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>
        </div>
        <div id="money"></div>
        <div id="grid">
            <div id="buttonGridPull"></div>
        </div>
    </span>
    `;
    replacehtml(`gameContainer`, homePage);
    setDungeon(game.gamestate.dungeon);
    resize();
    updateTeam();

}; window.home = home;

function beg() {
    console.log('A kind stranger gifts you $10000000!');
    game.gamestate.player.money += 10000000
}; window.beg = beg;

console.error('ERROR: The operation completed successfully.');
