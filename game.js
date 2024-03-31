/*
------------------------------------------------------Changelog------------------------------------------------------
Rarities:
normal --> uncommon --> rare --> super rare --> epic --> legendary --> godly --> EX
grey        green       blue      purple         red       gold       diamond   black
 0            1          2          3             4          5           6        7
 x1         x1.3       x1.7       x2.2           x3        x3.8         x5      x6.5

---------------------------------------------------------------------------------------------------------------------
*/

// Constants
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

const none = 'none';

const physical = 'physical';
const magic = 'magic';
const piercing = 'piercing';
const normal = 'normal';

const male = 'male';
const female = 'female';

const grey = 'grey';
const red = 'red';
const bronze = 'bronze';
const silver = 'silver';
const gold = 'gold';
const black = 'black';

// The support functions that might not be necessary
function isin(a, b) { // check is a in b
    for (var i = 0; i < b.length; i += 1) {
        if (a == b[i]) {
            return true;
        }
    }
    return false;
};

function randchoice(list, remove = false) { // chose 1 from a list and update list
    let length = list.length;
    let choice = randint(0, length-1);
    if (remove) {
        let chosen = list.splice(choice, 1);
        return [chosen, list];
    }
    return list[choice];
};

// Randint returns random interger between min and max (both included)
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
}

function replacehtml(element, text) {
    document.getElementById(element).innerHTML = text;
};

function addImage(img, x, y, cx, cy, scale, r, absolute, opacity=1) {
    var c = document.getElementById('main');
    var ctx = c.getContext("2d");
    ctx.globalAlpha = opacity;
    if (absolute) {
        ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
        ctx.rotate(r);
        ctx.drawImage(img, -cx, -cy);
    } else {
        ctx.setTransform(scale, 0, 0, scale, x-player.x+display.x/2, y-player.y+display.y/2); // position relative to player
        ctx.rotate(r);
        ctx.drawImage(img, -cx, -cy);
    }
    ctx.globalAlpha = 1.0;
};

function clearCanvas(canvas) {
    var c = document.getElementById(canvas);
    var ctx = c.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, display.x, display.y);
    ctx.restore();
};

function drawLine(pos, r, length, style, absolute) {
    var c = document.getElementById("main");
    var ctx = c.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (style) {
        ctx.strokeStyle = style.colour;
        ctx.lineWidth = style.width*data.constants.zoom;
        ctx.globalAlpha = style.opacity;
    }
    ctx.beginPath();
    if (absolute) {
        ctx.moveTo(pos.x*data.constants.zoom, pos.y*data.constants.zoom);
        ctx.lineTo((pos.x + length * Math.cos(r))*data.constants.zoom, (pos.y + length * Math.sin(r))*data.constants.zoom);
    } else {
        ctx.moveTo((pos.x-player.x)*data.constants.zoom+display.x/2, (pos.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((pos.x-player.x + length * Math.cos(r))*data.constants.zoom+display.x/2, (pos.y-player.y + length * Math.sin(r))*data.constants.zoom+display.y/2);
    }
    ctx.stroke();
    ctx.restore();
};

function getDist(sPos, tPos) { 
    // Mathematics METHods
    var dx = tPos.x - sPos.x;
    var dy = tPos.y - sPos.y;
    var dist = Math.sqrt(dx*dx+dy*dy);
    return dist;
};

function correctAngle(a) {
    a = a%(Math.PI*2);
    return a;
};

function adjustAngle(a) {
    if (a > Math.PI) {
        a -= 2*Math.PI;
    }
    return a;
};

function rotateAngle(r, rTarget, increment) {
    if (Math.abs(r) > Math.PI*4 || Math.abs(rTarget) > Math.PI*4) {
        throw "Error: You f*cked up the angle thing again...";
    }
    if (r == rTarget) {
        return correctAngle(r);
    }else if (rTarget - r <= Math.PI && rTarget - r > 0) {
        if (rTarget - r < increment) {
            r = rTarget;
        } else {
            r += increment;
        }
        return r;
    } else if (r - rTarget < Math.PI && r - rTarget > 0) {
        if (r - rTarget < increment) {
            r = rTarget;
        } else {
            r -= increment;
        }
        return correctAngle(r);
    } else {
        if (r < rTarget) {
            r += Math.PI*2;
        } else {
            rTarget += Math.PI*2;
        }
        return correctAngle(rotateAngle(r, rTarget, increment));
    }
};

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
};

function offsetPoints(points, offset) {
    for (let i = 0; i < points.length; i++){
        points[i].x += offset.x;
        points[i].y += offset.y;
    }
    return points;
};

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
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function toColour(colour) {
    return `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`;
};

function drawCircle(x, y, radius, fill, stroke, strokeWidth, opacity, absolute) { // draw a circle
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    ctx.globalAlpha = opacity;
    if (absolute) {
        ctx.arc(x*data.constants.zoom, y*data.constants.zoom, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    } else {
        ctx.arc((-player.x+x)*data.constants.zoom+display.x/2, (-player.y+y)*data.constants.zoom+display.y/2, radius*data.constants.zoom, 0, 2 * Math.PI, false);
    }
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth*data.constants.zoom;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
};

function displaytxt(txt, pos) {
    var canvas = document.getElementById("canvasOverlay");
    var ctx = canvas.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // Set the font and text color
    ctx.font = "20px Verdana";
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    // Display the points on the canvas
    ctx.fillText(txt, pos.x*data.constants.zoom, pos.y*data.constants.zoom);
    ctx.stroke();
    ctx.restore();
};

function rotatePolygon(point, r) {
    let points = JSON.parse(JSON.stringify(point));
    for (let i = 0; i < points.length; i++) {
        points[i].x = point[i].x * Math.cos(r) - point[i].y * Math.sin(r); 
        points[i].y = point[i].x * Math.sin(r) + point[i].y * Math.cos(r); 
    }
    return points
};

function drawPolygon(point, offset, r, fill, stroke, absolute, debug=false) {
    let points = JSON.parse(JSON.stringify(point));
    //console.log(points);
    if (points.length < 3) {
        throw "Error: Your polygon needs to have at least 3 points dumbass";
    }
    points = rotatePolygon(points, r)
    var canvas = document.getElementById('main');
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    if (absolute) {
        ctx.moveTo((points[0].x + offset.x)*data.constants.zoom, (points[0].y + offset.y)*data.constants.zoom);
        if (debug) {displaytxt(`(${Math.round((points[0].x + offset.x)*data.constants.zoom)}, ${Math.round((points[0].y + offset.y)*data.constants.zoom)})`, {x: (points[0].x + offset.x)*data.constants.zoom, y: (points[0].y + offset.y)*data.constants.zoom});}
    } else {
        ctx.moveTo((points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2, (points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2);
        if (debug) {displaytxt(`(${Math.round((points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2)}, ${Math.round((points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2)})`, {x: (points[0].x-player.x + offset.x)*data.constants.zoom+display.x/2, y: (points[0].y-player.y + offset.y)*data.constants.zoom+display.y/2});}
        //if (debug) {displaytxt(`(${Math.round(points[0].x-player.x+display.x/2 + offset.x)}, ${Math.round(points[0].y-player.y+display.y/2 + offset.y)})`, {x: points[0].x-player.x+display.x/2 + offset.x, y: points[0].y-player.y+display.y/2 + offset.y});}
    }
    for (let i = 1; i < points.length; i++) {
        if (absolute) {
            ctx.lineTo((points[i].x + offset.x)*data.constants.zoom, (points[i].y + offset.y)*data.constants.zoom);
            if (debug) {displaytxt(`(${Math.round((points[i].x + offset.x)*data.constants.zoom)}, ${Math.round((points[i].y + offset.y)*data.constants.zoom)})`, {x: (points[i].x + offset.x)*data.constants.zoom, y: (points[i].y + offset.y)*data.constants.zoom});}
        } else {
            ctx.lineTo((points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2, (points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2);
            if (debug) {displaytxt(`(${Math.round((points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2)}, ${Math.round((points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2)})`, {x: (points[i].x-player.x + offset.x)*data.constants.zoom+display.x/2, y: (points[i].y-player.y + offset.y)*data.constants.zoom+display.y/2});}
            //if (debug) {displaytxt(`(${Math.round(points[i].x-player.x+display.x/2 + offset.x)}, ${Math.round(points[i].y-player.y+display.y/2 + offset.y)})`, {x: points[i].x-player.x+display.x/2 + offset.x, y: points[i].y-player.y+display.y/2 + offset.y});}
        }
    }
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = stroke.width*data.constants.zoom;
        ctx.strokeStyle = stroke.colour;
        ctx.stroke();
    }
};

function rect(coords, size, style, absolute=false, canvas='main') {
    var canvas = document.getElementById(canvas);
    var ctx = canvas.getContext("2d");
    ctx.resetTransform();
    ctx.beginPath();
    if (absolute) {
        ctx.moveTo(coords.x*data.constants.zoom, coords.y*data.constants.zoom);
        ctx.lineTo(coords.x*data.constants.zoom, (coords.y+size.y)*data.constants.zoom);
        ctx.lineTo((coords.x+size.x)*data.constants.zoom, (coords.y+size.y)*data.constants.zoom);
        ctx.lineTo((coords.x+size.x)*data.constants.zoom, coords.y*data.constants.zoom);
    } else {
        ctx.moveTo((coords.x-player.x)*data.constants.zoom+display.x/2, (coords.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((coords.x-player.x)*data.constants.zoom+display.x/2, (coords.y+size.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((coords.x+size.x-player.x)*data.constants.zoom+display.x/2, (coords.y+size.y-player.y)*data.constants.zoom+display.y/2);
        ctx.lineTo((coords.x+size.x-player.x)*data.constants.zoom+display.x/2, (coords.y-player.y)*data.constants.zoom+display.y/2);
    }
    ctx.closePath();
    ctx.fillStyle = style.fill;
    ctx.fill();
    ctx.lineWidth = style.stroke.width*data.constants.zoom;
    ctx.strokeStyle = style.stroke.colour;
    ctx.stroke();
}

function renderBar(centre, shift, size, value, increments, padding, spacing, bgStyle, fillStyle) {
    let vPadding = {x: padding, y: padding};
    let startPos = vMath(centre, vMath(size, 0.5, '*'), '-');
    if (shift != 0) {
        startPos = vMath(startPos, shift, '+');
    }
    let blockSize = {x: (size.x - spacing * (increments-1)) / increments, y: size.y};
    rect(vMath(startPos, vPadding, '-'), vMath(size, vMath(vPadding, 2, '*'), '+'), bgStyle);
    for (let i = 0; i < value; i++) {
        rect(startPos, blockSize, fillStyle);
        startPos.x += spacing + blockSize.x;
    }
};

function normalDistribution(mean, sDiv) {
    let u = 0;
    let v = 0;
    while (u === 0) u = Math.random(); 
    while (v === 0) v = Math.random(); 
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return mean + z * sDiv;
};

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
        case 'cross product': // chat gpt, I believe in you (I doubt this is correct)
            return v1.x * v2.y - v1.y * v2.x;
        case 'projection':
        case 'vector resolute':
        return vMath(v2, vMath(v1, v2, '.')/vMath(v2, null, '||')**2, 'x');
        default:
            throw 'what are you trying to do to to that poor vector?';
    }
};

function toComponent(m, r) {
    return {x: m * Math.sin(r), y: -m * Math.cos(r)};
};

function toPol(i, j) {
    return {m: Math.sqrt(i**2+j**2), r: aim({x: 0, y: 0}, {x: i, y: j})};
};

const data = {
    startingGamestate: {
        player: {
            inventory: [
                {
                    name: `Crude Health Potion`,
                    description: `A concoction of various herbs that has some healing properties. The effects are weak, but it's better than nothing.`,
                    stats: `Recovers:\n15 hp over 3 rounds`,
                    rarity: N,
                    pfp: `assets/pot2.jpeg`,
                    hp: 5,
                    mp: 0,
                    str: 0,
                    int: 0,
                    uses: 1,
                    effects: [{id: 'hot', lvl: 5, duration: 2}],
                    purchaceable: false,
                    purchacePrice: 0,
                    sellable: true,
                    sellPrice: 10,
                    quantity: 1,
                    stackSize: Infinity,
                },
                {
                    name: `Lesser Health Potion`,
                    description: `A poorly crafted health potion crafted with low grade ingredients. It might just be enough for your heroes to withstand an extra hit or two.`,
                    stats: `Recovers:\n30 hp instantly\n5 mp instantly`,
                    rarity: UC,
                    pfp: `assets/pot7.jpeg`,
                    hp: 30,
                    mp: 5,
                    str: 0,
                    int: 0,
                    uses: 1,
                    effects: [],
                    purchaceable: true,
                    purchacePrice: 100,
                    sellable: true,
                    sellPrice: 25,
                    quantity: 1,
                    stackSize: Infinity,
                },
                {
                    name: `Mediocre Health Potion`,
                    description: `The standard health potion sold in most high end stores. Comes with a slight heal over time effect.`,
                    stats: `Recovers:\n50 hp instantly\n20 hp over the next 2 rounds\n5 mp instantly`,
                    rarity: R,
                    pfp: `assets/pot8.jpeg`,
                    hp: 50,
                    mp: 5,
                    str: 0,
                    int: 0,
                    uses: 1,
                    effects: [{id: 'hot', lvl: 10, duration: 2}],
                    purchaceable: true,
                    purchacePrice: 400,
                    sellable: true,
                    sellPrice: 150,
                    quantity: 1,
                    stackSize: Infinity,
                },
                {
                    name: `Potion of Regeneration`,
                    description: `An experimental healing potion designed by a master alchemist. The healing effect is spread out over a longer period of time alowing it to be cheaper but less useful in battle.`,
                    stats: `Recovers:\n120 hp over 6 rounds\n10 mp instantly`,
                    rarity: SR,
                    pfp: `assets/pot5.jpeg`,
                    hp: 20,
                    mp: 10,
                    str: 0,
                    int: 0,
                    uses: 1,
                    effects: [{id: 'hot', lvl: 20, duration: 5}],
                    purchaceable: false,
                    purchacePrice: 0,
                    sellable: true,
                    sellPrice: 500,
                    quantity: 1,
                    stackSize: Infinity,
                },
                {
                    name: `Greater Health Potion`,
                    description: `An incredible healing potion refined for years by a master alchemist. A single potion can heal even the most grevious injuries and replenishes lost mana.`,
                    stats: `Recovers:\n100 hp instantly\n30 hp over the next 2 rounds\n25 mp instantly`,
                    rarity: E,
                    pfp: `assets/pot1.jpeg`,
                    hp: 100,
                    mp: 25,
                    str: 0,
                    int: 0,
                    uses: 1,
                    effects: [{id: 'hot', lvl: 15, duration: 2}],
                    purchaceable: true,
                    purchacePrice: 2500,
                    sellable: true,
                    sellPrice: 1000,
                    quantity: 1,
                    stackSize: Infinity,
                },
                {
                    name: `Superior Health Potion`,
                    description: `A great alchemist didicated their entire lives to the refinement of this incredible healing potion. There are so few of them in existance that even the largest kingdoms only have a few stockpiled in their treasury.`,
                    stats: `Recovers:\n500 hp instantly\n100 hp over the next 2 rounds\n100 mp instantly`,
                    rarity: L,
                    pfp: `assets/pot4.jpeg`,
                    hp: 500,
                    mp: 100,
                    str: 0,
                    int: 0,
                    uses: 1,
                    effects: [{id: 'hot', lvl: 50, duration: 2}],
                    purchaceable: false,
                    purchacePrice: 0,
                    sellable: true,
                    sellPrice: 10000,
                    quantity: 1,
                    stackSize: Infinity,
                },
                {
                    name: `Ascended Health Potion`,
                    description: `A priceless relic from the age of the gods, this potion can bring even the strongest of heroes back to full health. It would surely be worth millions of gold.`,
                    stats: `Recovers:\n2500 hp instantly\n1000 hp over the next 4 rounds\n1000 mp instantly\n +10% permanent strength`,
                    rarity: G,
                    pfp: `assets/pot10.jpeg`,
                    hp: 2500,
                    mp: 1000,
                    str: 0.1,
                    int: 0,
                    uses: 1,
                    effects: [{id: 'hot', lvl: 250, duration: 4}],
                    purchaceable: false,
                    purchacePrice: 0,
                    sellable: true,
                    sellPrice: 1500000,
                    quantity: 1,
                    stackSize: Infinity,
                },
                {
                    name: `Elixir of Life\n `,
                    description: `A priceless relic from the age of the gods, this potion can bring back even gods from the brink of death. It would surely be worth billions of gold.`,
                    stats: `Recovers:\n1000000 hp instantly\nremoves all effects (including buffs)`,
                    rarity: EX,
                    pfp: `assets/pot11.jpeg`,
                    hp: 1000000,
                    mp: 0,
                    str: 0,
                    int: 0,
                    uses: 1,
                    effects: [{id: 'clense', lvl: 1, duration: 0}],
                    purchaceable: false,
                    purchacePrice: 0,
                    sellable: true,
                    sellPrice: 20000000,
                    quantity: 1,
                    stackSize: Infinity,
                },
            ],
            characters: [
                { // useless trash
                    name: `Eco`,
                    description: `Former high school student, Eco was isekaied into the other world and is on a quest to defeat the terrorist lord. However, he is clumsy and unfit, so Eco plans on forming a party of beautiful girls to fight for him. Eco also has a mysterious power sealed within his right eye that he doesn't fully understand.`,
                    personality: 'chunni',
                    stats: {atk: 'low', def: 'none'},
                    rarity: EX,
                    gender: male,
                    pfp: `assets/FatEdgyGuy.jpeg`,
                    hp: 60,
                    mp: 25,
                    str: 0.9,
                    int: 5,
                    mpRegen: 5,
                    skils: ['punch', 'bodyslam', 'stare', 'brag'],
                    armour: {physical: [0, 0], magic: [0, 0]},
                },
                { // healer
                    name: `Abby`,
                    description: `Abby is a novice healer who recently joined the Adventurers Guild. She knows a few healing spells but can't fight very well, so hes suitabel for the support role.`,
                    personality: 'timid',
                    stats: {atk: 'low', def: 'none'},
                    rarity: N,
                    gender: female,
                    pfp: `assets/animeGirl2.jpeg`,
                    hp: 80,
                    mp: 100,
                    str: 0.8,
                    int: 20,
                    mpRegen: 20,
                    skils: ['slap', 'lesserHeal', 'mediumHeal', 'lesserAreaHeal'],
                    armour: {physical: [0, 0], magic: [0, 0]},
                },
                { // melee dps
                    name: `Yuki`,
                    description: `Yuki recently graduated from the kingdom's swordsmen academy. She's not inexperienced with the sword and knows how to use mana to strengthen her attacks.`,
                    personality: 'calm',
                    stats: {atk: 'high', def: 'low'},
                    rarity: N,
                    gender: female,
                    pfp: `assets/animeGirl42.jpeg`,
                    hp: 100,
                    mp: 50,
                    str: 1,
                    int: 15,
                    mpRegen: 5,
                    skils: ['slash', 'heavyStrike', 'raiseGuard', 'swordCharge'],
                    armour: {physical: [10, 10], magic: [0, 0]},
                },
                { // mage
                    name: `Kohana`,
                    description: `Kohana is a grand archmage who has seen countless battles over the centuries. She weilds high teir attack magic but can also support.`,
                    personality: 'confident',
                    stats: {atk: 'high', def: 'low'},
                    rarity: L,
                    gender: female,
                    pfp: `assets/animeGirl27.jpeg`,
                    hp: 250,
                    mp: 650,
                    str: 1,
                    int: 90,
                    mpRegen: 75,
                    skils: ['shadowLance', 'darkBlast', 'arcaneBlast', 'shadowVeil'],
                    armour: {physical: [0, 0], magic: [25, 0]},
                },
                { // tank dps hybrid
                    name: `Akane`,
                    description: `Akane is one of the kindoms many trainee knights. She's good at both attacking and can absorb quite a bit of damage, but she's not the most intelligent.`,
                    personality: 'arrogant',
                    stats: {atk: 'medium', def: 'medium'},
                    rarity: N,
                    gender: female,
                    pfp: `assets/animeGirl40.jpeg`,
                    hp: 125,
                    mp: 25,
                    str: 1,
                    int: 10,
                    mpRegen: 5,
                    skils: ['slash', 'thrust', 'swordCharge', 'counterAttack'],
                    armour: {physical: [30, 15], magic: [0, 0]},
                },
                { // tanker
                    name: `Rei`,
                    description: `Rei is a dropout from the swordsman academy. She is clumsy and often misses her attacks, but has a suit of heavy armour that alows her to tank damage quite well.`,
                    personality: 'confident',
                    stats: {atk: 'low', def: 'high'},
                    rarity: N,
                    gender: female,
                    pfp: `assets/animeGirl9.jpeg`,
                    hp: 125,
                    mp: 15,
                    str: 0.9,
                    int: 5,
                    mpRegen: 2,
                    skils: ['wildSwing', 'overheadStrike', 'raiseGuard', 'counterAttack'],
                    armour: {physical: [15, 15], magic: [0, 0]},
                },
                { // ranged dps
                    name: `Emi`,
                    description: `Emi is an apprentice mage from the red mage tower. She specialises in fire elemental attacks at long ranges but is inexperienced in close combat.`,
                    personality: 'angry',
                    stats: {atk: 'high', def: 'none'},
                    rarity: N,
                    gender: female,
                    pfp: `assets/animeGirl48.jpeg`,
                    hp: 60,
                    mp: 150,
                    str: 0.9,
                    int: 25,
                    mpRegen: 20,
                    skils: ['fireball', 'fireLance', 'fireArrows', 'firestorm'],
                    armour: {physical: [0, 0], magic: [0, 0]},
                },
                { // glass cannon
                    name: `Natsuki`,
                    description: `Natsuki is a swordmaster from an ancient kingdom. Her skill with the blade is unrivaled although she is quite fragile`,
                    personality: 'calm',
                    stats: {atk: 'extreme', def: 'none'},
                    rarity: G,
                    gender: female,
                    pfp: `assets/animeGirl10.jpeg`,
                    hp: 100,
                    mp: 600,
                    str: 3,
                    int: 60,
                    mpRegen: 90,
                    skils: ['superiorThrust', 'sevenfoldSlashOfLight', 'swordDance', 'auraSlash'],
                    armour: {physical: [0, 0], magic: [0, 0]},
                },
            ],
            team: [
                { // useless trash
                    name: `Eco`,
                    description: `Former high school student, Eco was isekaied into the other world and is on a quest to defeat the terrorist lord. However, he is clumsy and unfit, so Eco plans on forming a party of beautiful girls to fight for him. Eco also has a mysterious power sealed within his right eye that he doesn't fully understand.`,
                    personality: 'chunni',
                    stats: {atk: 'low', def: 'none'},
                    rarity: EX,
                    gender: male,
                    pfp: `assets/FatEdgyGuy.jpeg`,
                    hp: 60,
                    mp: 25,
                    str: 0.9,
                    int: 5,
                    mpRegen: 5,
                    skils: ['punch', 'bodyslam', 'stare', 'brag'],
                    armour: {physical: [0, 0], magic: [0, 0]},
                },
                { // glass cannon
                    name: `Natsuki`,
                    description: `Natsuki is a swordmaster from a long forgotten kingdom. Her skill with the blade is unrivaled although she is quite fragile`,
                    personality: 'calm',
                    stats: {atk: 'extreme', def: 'none'},
                    rarity: G,
                    gender: female,
                    pfp: `assets/animeGirl10.jpeg`,
                    hp: 100,
                    mp: 600,
                    str: 3,
                    int: 60,
                    mpRegen: 90,
                    skils: ['superiorThrust', 'sevenfoldSlashOfLight', 'swordDance', 'auraSlash'],
                    armour: {physical: [0, 0], magic: [0, 0]},
                },
                { // mage
                    name: `Kohana`,
                    description: `Kohana is a grand archmage who has seen countless battles over the centuries. She weilds high teir attack magic but can also support.`,
                    personality: 'confident',
                    stats: {atk: 'high', def: 'low'},
                    rarity: L,
                    gender: female,
                    pfp: `assets/animeGirl27.jpeg`,
                    hp: 250,
                    mp: 650,
                    str: 1,
                    int: 90,
                    mpRegen: 75,
                    skils: ['shadowLance', 'darkBlast', 'arcaneBlast', 'shadowVeil'],
                    armour: {physical: [0, 0], magic: [25, 0]},
                },
                undefined
            ],
            discoveredHeroes: [],
            discoveredEmemies: [],
            money: 250,
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
                    itemCharacterBias: 0.8,
                    normal: 0.70,
                    uncommon: 0.15,
                    rare: 0.10,
                    superRare: 0.05,
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
                    rare: 0.15,
                    superRare: 0.15,
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
        progression: 1,
    },
    characters: [
        /*
        armour [ignore under, resist percent]
        */
        { // N
            Abby: { // healer
                name: `Abby`,
                description: `Abby is a novice healer who recently joined the Adventurers Guild. She knows a few healing spells but can't fight very well, so hes suitabel for the support role.`,
                personality: 'timid',
                stats: {atk: 'low', def: 'none'},
                rarity: N,
                gender: female,
                pfp: `assets/animeGirl2.jpeg`,
                hp: 80,
                mp: 100,
                str: 0.8,
                int: 20,
                mpRegen: 20,
                skils: ['slap', 'lesserHeal', 'mediumHeal', 'lesserAreaHeal'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Yuki: { // melee dps
                name: `Yuki`,
                description: `Yuki recently graduated from the kingdom's swordsmen academy. She's not inexperienced with the sword and knows how to use mana to strengthen her attacks.`,
                personality: 'calm',
                stats: {atk: 'high', def: 'low'},
                rarity: N,
                gender: female,
                pfp: `assets/animeGirl42.jpeg`,
                hp: 100,
                mp: 50,
                str: 1.1,
                int: 15,
                mpRegen: 5,
                skils: ['slash', 'heavyStrike', 'raiseGuard', 'swordCharge'],
                armour: {physical: [0, 10], magic: [0, 0]},
            },
            Akane: { // tank dps hybrid
                name: `Akane`,
                description: `Akane is one of the kindoms many trainee knights. She's good at both attacking and can absorb quite a bit of damage, but she's not the most intelligent.`,
                personality: 'arrogant',
                stats: {atk: 'medium', def: 'medium'},
                rarity: N,
                gender: female,
                pfp: `assets/animeGirl40.jpeg`,
                hp: 125,
                mp: 25,
                str: 1,
                int: 10,
                mpRegen: 5,
                skils: ['slash', 'thrust', 'swordCharge', 'counterAttack'],
                armour: {physical: [8, 15], magic: [0, 0]},
            },
            Rei: { // tanker
                name: `Rei`,
                description: `Rei is a dropout from the swordsman academy. She is clumsy and often misses her attacks, but has a suit of heavy armour that alows her to tank damage quite well.`,
                personality: 'confident',
                stats: {atk: 'low', def: 'high'},
                rarity: N,
                gender: female,
                pfp: `assets/animeGirl9.jpeg`,
                hp: 125,
                mp: 15,
                str: 0.9,
                int: 5,
                mpRegen: 2,
                skils: ['wildSwing', 'overheadStrike', 'raiseGuard', 'counterAttack'],
                armour: {physical: [15, 15], magic: [0, 0]},
            },
            Emi: { // ranged dps
                name: `Emi`,
                description: `Emi is an apprentice mage from the red mage tower. She specialises in fire elemental attacks at long ranges but is inexperienced in close combat.`,
                personality: 'angry',
                stats: {atk: 'high', def: 'none'},
                rarity: N,
                gender: female,
                pfp: `assets/animeGirl48.jpeg`,
                hp: 60,
                mp: 150,
                str: 0.9,
                int: 25,
                mpRegen: 20,
                skils: ['fireball', 'fireLance', 'fireArrows', 'firestorm'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
        },
        { // UC

        },
        { // R

        },
        { // SR

        },
        { // E

        },
        { // L
            Kohana: { // battle mage
                name: `Kohana`,
                description: `Kohana is a grand archmage who has seen countless battles over the centuries. She weilds high teir attack magic but can also support.`,
                personality: 'confident',
                stats: {atk: 'high', def: 'low'},
                rarity: L,
                gender: female,
                pfp: `assets/animeGirl27.jpeg`,
                hp: 225,
                mp: 650,
                str: 1,
                int: 80,
                mpRegen: 75,
                skils: ['shadowLance', 'darkBlast', 'arcaneBlast', 'shadowVeil'],
                armour: {physical: [0, 0], magic: [25, 0]},
            },
        },
        { // G
            Natsuki: { // glass cannon
                name: `Natsuki`,
                description: `Natsuki is a swordmaster from a long forgotten kingdom. Her skill with the blade is unrivaled although she is quite fragile`,
                personality: 'calm',
                stats: {atk: 'extreme', def: 'none'},
                rarity: G,
                gender: female,
                pfp: `assets/animeGirl10.jpeg`,
                hp: 100,
                mp: 600,
                str: 3,
                int: 60,
                mpRegen: 90,
                skils: ['superiorThrust', 'sevenfoldSlashOfLight', 'swordDance', 'auraSlash'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
        },
        { // EX
            Eco: { // useless trash
                name: `Eco`,
                description: `Former high school student, Eco was isekaied into the other world and is on a quest to defeat the terrorist lord. However, he is clumsy and unfit, so Eco plans on forming a party of beautiful girls to fight for him. Eco also has a mysterious power sealed within his right eye that he doesn't fully understand.`,
                personality: 'chunni',
                stats: {atk: 'low', def: 'none'},
                rarity: EX,
                gender: male,
                pfp: `assets/FatEdgyGuy.jpeg`,
                hp: 60,
                mp: 25,
                str: 0.9,
                int: 5,
                mpRegen: 5,
                skils: ['punch', 'bodyslam', 'stare', 'brag'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
        },
    ],
    skills: {
        slash: {
            name: `Sword Slash`,
            desc: `[attacker] shashes at the targeted enemy with [pronoun] sword.`,
            attackType: `physical`,
            type: physical,
            dmg: 12,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 90,
            attacks: 3,
        },
        sevenfoldSlashOfLight: {
            name: `Sevenfold Slash of Light`,
            desc: `[attacker] channels mana into [pronoun] sword and unleashes 7 consecutive slashes at the targeted enemy.`,
            attackType: `physical`,
            type: normal,
            dmg: 22,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 90},
            accuracy: 200,
            attacks: 7,
        },
        auraSlash: {
            name: `Aura Slash`,
            desc: `[attacker] launches [pronoun] sword aura at the targeted enemy.`,
            attackType: `magic`,
            type: normal,
            dmg: 225,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 300},
            accuracy: 100,
            attacks: 1,
        },
        thrust: {
            name: `Sword Thrust`,
            desc: `[attacker] impales the targeted enemy with [pronoun] sword.`,
            attackType: `physical`,
            type: physical,
            dmg: 60,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 75,
            attacks: 1,
        },
        superiorThrust: {
            name: `Sword Thrust`,
            desc: `[attacker] enhances [pronoun] sword with aura and impales the targeted enemy.`,
            attackType: `physical`,
            type: normal,
            dmg: 90,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 20},
            accuracy: 100,
            attacks: 1,
        },
        overheadStrike: {
            name: `Overhead Strike`,
            desc: `[attacker] leaps into the air and strikes at the targeted enemy from above.`,
            attackType: `physical`,
            type: physical,
            dmg: 75,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 50,
            attacks: 1,
        },
        wildSwing: {
            name: `Wild Swings`,
            desc: `[attacker] wildly swings [pronoun] sword at the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            dmg: 36,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 60,
            attacks: 2,
        },
        heavyStrike: {
            name: `Heavy Strike`,
            desc: `[attacker] infises mana into [pronoun] sword and unleashes a powerful slash at the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            dmg: 80,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 10},
            accuracy: 100,
            attacks: 1,
        },
        raiseGuard: {
            name: `Raise Guard`,
            desc: `[attacker] raises [pronoun] guard, reducing damage from all attacks in the next round.`,
            attackType: `buffDefence`,
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [15, 5], duration: 1}],
            cost: {hp: 0, mp: 5},
            accuracy: Infinity,
            attacks: 1,
            selfOnly: true,
        },
        counterAttack: {
            name: `Perpare Counter Attack`,
            desc: `[attacker] reduces all damage taken in the next round, and counteratacks with 150% power against the next enemy to attack [pronoun] at melee range.`,
            attackType: `buffDefence`,
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [0, 5], duration: 1}, {id: 'counter', lvl: 1.5, duration: 1}],
            cost: {hp: 0, mp: 0},
            accuracy: Infinity,
            attacks: 1,
            selfOnly: true,
        },
        swordCharge: {
            name: `Sword Charge`,
            desc: `[attacker] channels mana into [pronoun] sword and charges the targeted enemy inflicting great damage, but taking some damage as well.`,
            attackType: `physical`,
            type: physical,
            dmg: 125,
            multiplier: str,
            effects: [],
            cost: {hp: -10, mp: 15},
            accuracy: 90,
            attacks: 1,
        },
        swordDance: {
            name: `Sword Dance`,
            desc: `[attacker] sends a flury of rapid slashes and stabs at the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            dmg: [10, 16],
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 225},
            accuracy: 90,
            attacks: 25,
        },
        punch: {
            name: `Punch`,
            desc: `[attacker] punches the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            dmg: 15,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 100,
            attacks: 1,
        },
        bodyslam: {
            name: `Bodyslam`,
            desc: `[attacker] bodyslams the targeted enemy, dealing damage to both of them.`,
            attackType: `physical`,
            type: physical,
            dmg: 50,
            multiplier: str,
            effects: [],
            cost: {hp: -10, mp: 0},
            accuracy: 90,
            attacks: 1,
        },
        slap: {
            name: `Slap`,
            desc: `[attacker] slaps the targeted enemy inflicting a little damage.`,
            attackType: `physical`,
            type: physical,
            dmg: 10,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 100,
            attacks: 1,
        },
        stare: {
            name: `Prevy Stare`,
            desc: `[attacker] stares at the targeted enemy like a pervert. Its super effective against females.`,
            attackType: `scan`,
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 15},
            accuracy: 60,
            exec: `
            if (enemy.gender == female) {
                attack.dmg = 99999,
            }
            `,
            attacks: 1,
        },
        brag: {
            name: `Brag`,
            desc: `[attacker] brags about [pronoun] accomplishments, irritating the targeted enemy.`,
            attackType: `sound`,
            type: piercing,
            dmg: 0,
            multiplier: int,
            effects: [{id: 'dot', lvl: 10, duration: 3}],
            cost: {hp: 0, mp: 5},
            accuracy: 100,
            attacks: 1,
        },
        lesserHeal: {
            name: `Lesser Healing`,
            desc: `[attacker] heals the targeted ally.`,
            attackType: `heal`,
            type: magic,
            dmg: -20,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 25},
            accuracy: 500,
            attacks: 1,
        },
        lesserAreaHeal: {
            name: `Lesser Healing`,
            desc: `[attacker] heals all allies, focusing on the targeted ally.`,
            attackType: `areaHeal`,
            type: magic,
            dmg: -10,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 60},
            accuracy: 500,
            exec: `
            for (let i = 0; i < game.gamestate.player.team.length; i++) {
                game.gamestate.player.team[i].hp += 10;
            }
            `,
            attacks: 1,
        },
        mediumHeal: {
            name: `Medium Healing`,
            desc: `[attacker] heals the targeted ally.`,
            attackType: `heal`,
            type: magic,
            dmg: -35,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 40},
            accuracy: 500,
            attacks: 1,
        },
        greaterHeal: {
            name: `Greater Healing`,
            desc: `[attacker] heals the targeted ally.`,
            attackType: `heal`,
            type: magic,
            dmg: -80,
            multiplier: int,
            effects: [{id: 'hot', lvl: 5, duration: 2}],
            cost: {hp: 0, mp: 90},
            accuracy: 500,
            attacks: 1,
        },
        shadowLance: {
            name: `Shadow Lance`,
            desc: `[attacker] launches a shadow lance constructed from mana at the targeted enemy. It can penetrate through barriers and armour.`,
            attackType: `darkMagic`,
            type: piercing,
            dmg: 40,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 45},
            accuracy: 100,
            attacks: 1,
        },
        arcaneBlast: {
            name: `Arcane Blast`,
            desc: `[attacker] fires a concentrated blast of mana at the targeted enemy.`,
            attackType: `magic`,
            type: magic,
            dmg: 175,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 200},
            accuracy: 100,
            attacks: 1,
        },
        darkBlast: {
            name: `Dark Blast`,
            desc: `[attacker] fires a concentrated blast of dark elemental mana at the targeted enemy.`,
            attackType: `darkMagic`,
            type: magic,
            dmg: 90,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 90},
            accuracy: 100,
            attacks: 1,
        },
        shadowVeil: {
            name: `Shadow Veil`,
            desc: `[attacker] surrounds the targeted ally in an anti magic barrier.`,
            attackType: `darkBarrier`,
            type: magic,
            dmg: 0,
            multiplier: int,
            effects: [{id: 'barrier', lvl: 750, duration: 25, type: magic}],
            cost: {hp: 0, mp: 300},
            accuracy: 1000,
            attacks: 1,
        },
        fireball: {
            name: `Fireball`,
            desc: `[attacker] launches a fireball at the targeted enemy.`,
            attackType: `fireMagic`,
            type: magic,
            dmg: 25,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 20},
            accuracy: 100,
            attacks: 1,
        },
        firestorm: {
            name: `Firestorm`,
            desc: `[attacker] unleashes a storm of fire at the targeted enemy, dealing splash damage to all enemies.`,
            attackType: `fireAOE`,
            type: magic,
            dmg: 10,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 100},
            accuracy: 100,
            exec: `
            for (let i = 0; i < game.gamestate.enemies.length; i++) {
                game.gamestate.enemies.hp -= 20;
            }
            `,
            attacks: 1,
        },
        fireLance: {
            name: `Fire Lance`,
            desc: `[attacker] fires a clance of fire at the targeted enemy.`,
            attackType: `fireMagic`,
            type: magic,
            dmg: 40,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 45},
            accuracy: 140,
            attacks: 1,
        },
        fireArrows: {
            name: `Fire Arrows`,
            desc: `[attacker] summons and fires arrows of fire at the targeted enemy.`,
            attackType: `fireMagic`,
            type: magic,
            dmg: 10,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 50},
            accuracy: 75,
            attacks: 5,
        },
    },
    items: [
        {
            name: `Crude Health Potion`,
            description: `A concoction of various herbs that has some healing properties. The effects are weak, but it's better than nothing.`,
            stats: `Recovers:\n15 hp over 3 rounds`,
            rarity: N,
            pfp: `assets/pot2.jpeg`,
            hp: 5,
            mp: 0,
            str: 0,
            int: 0,
            uses: 1,
            effects: [{id: 'hot', lvl: 5, duration: 2}],
            purchaceable: false,
            purchacePrice: 0,
            sellable: true,
            sellPrice: 10,
            quantity: 1,
            stackSize: Infinity,
        },
        {
            name: `Lesser Health Potion`,
            description: `A poorly crafted health potion crafted with low grade ingredients. It might just be enough for your heroes to withstand an extra hit or two.`,
            stats: `Recovers:\n30 hp instantly\n5 mp instantly`,
            rarity: UC,
            pfp: `assets/pot7.jpeg`,
            hp: 30,
            mp: 5,
            str: 0,
            int: 0,
            uses: 1,
            effects: [],
            purchaceable: true,
            purchacePrice: 100,
            sellable: true,
            sellPrice: 25,
            quantity: 1,
            stackSize: Infinity,
        },
        {
            name: `Mediocre Health Potion`,
            description: `The standard health potion sold in most high end stores. Comes with a slight heal over time effect.`,
            stats: `Recovers:\n50 hp instantly\n20 hp over the next 2 rounds\n5 mp instantly`,
            rarity: R,
            pfp: `assets/pot8.jpeg`,
            hp: 50,
            mp: 5,
            str: 0,
            int: 0,
            uses: 1,
            effects: [{id: 'hot', lvl: 10, duration: 2}],
            purchaceable: true,
            purchacePrice: 400,
            sellable: true,
            sellPrice: 150,
            quantity: 1,
            stackSize: Infinity,
        },
        {
            name: `Potion of Regeneration`,
            description: `An experimental healing potion designed by a master alchemist. The healing effect is spread out over a longer period of time alowing it to be cheaper but less useful in battle.`,
            stats: `Recovers:\n120 hp over 6 rounds\n10 mp instantly`,
            rarity: SR,
            pfp: `assets/pot5.jpeg`,
            hp: 20,
            mp: 10,
            str: 0,
            int: 0,
            uses: 1,
            effects: [{id: 'hot', lvl: 20, duration: 5}],
            purchaceable: false,
            purchacePrice: 0,
            sellable: true,
            sellPrice: 500,
            quantity: 1,
            stackSize: Infinity,
        },
        {
            name: `Greater Health Potion`,
            description: `An incredible healing potion refined for years by a master alchemist. A single potion can heal even the most grevious injuries and replenishes lost mana.`,
            stats: `Recovers:\n100 hp instantly\n30 hp over the next 2 rounds\n25 mp instantly`,
            rarity: E,
            pfp: `assets/pot1.jpeg`,
            hp: 100,
            mp: 25,
            str: 0,
            int: 0,
            uses: 1,
            effects: [{id: 'hot', lvl: 15, duration: 2}],
            purchaceable: true,
            purchacePrice: 2500,
            sellable: true,
            sellPrice: 1000,
            quantity: 1,
            stackSize: Infinity,
        },
        {
            name: `Superior Health Potion`,
            description: `A great alchemist didicated their entire lives to the refinement of this incredible healing potion. There are so few of them in existance that even the largest kingdoms only have a few stockpiled in their treasury.`,
            stats: `Recovers:\n500 hp instantly\n100 hp over the next 2 rounds\n100 mp instantly`,
            rarity: L,
            pfp: `assets/pot4.jpeg`,
            hp: 500,
            mp: 100,
            str: 0,
            int: 0,
            uses: 1,
            effects: [{id: 'hot', lvl: 50, duration: 2}],
            purchaceable: false,
            purchacePrice: 0,
            sellable: true,
            sellPrice: 10000,
            quantity: 1,
            stackSize: Infinity,
        },
        {
            name: `Ascended Health Potion`,
            description: `A priceless relic from the age of the gods, this potion can bring even the strongest of heroes back to full health. It would surely be worth millions of gold.`,
            stats: `Recovers:\n2500 hp instantly\n1000 hp over the next 4 rounds\n1000 mp instantly\n +10% permanent strength`,
            rarity: G,
            pfp: `assets/pot10.jpeg`,
            hp: 2500,
            mp: 1000,
            str: 0.1,
            int: 0,
            uses: 1,
            effects: [{id: 'hot', lvl: 250, duration: 4}],
            purchaceable: false,
            purchacePrice: 0,
            sellable: true,
            sellPrice: 1500000,
            quantity: 1,
            stackSize: Infinity,
        },
        {
            name: `Elixir of Life\n `,
            description: `A priceless relic from the age of the gods, this potion can bring back even gods from the brink of death. It would surely be worth billions of gold.`,
            stats: `Recovers:\n1000000 hp instantly\nremoves all effects (including buffs)`,
            rarity: EX,
            pfp: `assets/pot11.jpeg`,
            hp: 1000000,
            mp: 0,
            str: 0,
            int: 0,
            uses: 1,
            effects: [{id: 'clense', lvl: 1, duration: 0}],
            purchaceable: false,
            purchacePrice: 0,
            sellable: true,
            sellPrice: 20000000,
            quantity: 1,
            stackSize: Infinity,
        },
    ],
    pulls: {
        
    }
}

// Loading savegames
var game = {
    interface: `home`,
    gamestate: undefined,
    keypresses: [],
    mousepos: {x: 0, y: 0},
};
//localStorage.removeItem('player');

// Steal Data (get inputs)
var mousepos = {x:0,y:0};
var display = {x:window.innerWidth, y:window.innerHeight};
//console.log(display);
//console.log(entities);
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
    display = {x:window.innerWidth,y:window.innerHeight};
    resize();
});
function tellPos(p){
    game.mousepos = {x: p.pageX, y:p.pageY};
};
window.addEventListener('mousemove', tellPos, false);

function resize() {
    console.log('resized');
    let sidebarWidth = Math.max(370, Math.ceil((display.x - display.y - 30) / 170) * 170 + 30);
    document.getElementById('sidebar').style.width = `${sidebarWidth}px`;
    let teamPosition = ((display.x - sidebarWidth) - 685) / 2;
    document.getElementById('teamSelection').style.left = `${teamPosition}px`;
    let playButtonPosition = ((display.x - sidebarWidth) - 200) / 2;
    document.getElementById('playButton').style.left = `${playButtonPosition}px`;
}

function clearData() {
    localStorage.removeItem('GatchaGameData');
    console.log('cleared previous data');
}

function focusCharacter(characterData) {

}

function updateTeam() {
    let canBattle = false;
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        if (game.gamestate.player.team[i] != undefined) {
            let title = `<strong>${game.gamestate.player.team[i].name}</strong>`;
            let buttonData = `onclick="selectTeamCharacter(${i})" class="smallCharacterButton" id="rank${game.gamestate.player.team[i].rarity}Button"`;
            buttonGridHtml += `<button ${buttonData}><p id="noPadding" class="characterTitle">${title}</p><img src="${game.gamestate.player.team[i].pfp}" class="characterIcon"></button>`;
            canBattle = true;
        } else {
            buttonGridHtml += `<button onclick="selectTeamCharacter(${i})" class="itemButton"></button>`;
        }
    }
    console.log(buttonGridHtml);
    replacehtml(`teamSelection`, `<div id="teamContainer">${buttonGridHtml}</div>`);
    if (canBattle) {
        replacehtml(`playButton`, `<button onclick="startDungeon()" id="readyPlayButton">Enter Dungeon</button>`);
    } else {
        replacehtml(`playButton`, `<button id="notReadyPlayButton">Enter Dungeon</button>`);
    }
}

function pull() {
    replacehtml(`nav`, `<button onclick="pull()" class="focusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button><button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${game.gamestate.player.money}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.pulls.length; i++) {
        let title = `<strong>${game.gamestate.pulls[i].name}</strong>`;
        let desc = `$${game.gamestate.pulls[i].cost}`;
        let buttonData = `onclick="gachaPull(${game.gamestate.pulls[i].id})" class="pullButton" id="${game.gamestate.pulls[i].colour}Button"`;
        buttonGridHtml += `<button ${buttonData}><p>${title}\n${desc}</p></button>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridPull">${buttonGridHtml}</div>`);
}

function inventory() {
    console.log('inventory');
    replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="focusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button><button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${game.gamestate.player.money}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
        let title = `<strong>${game.gamestate.player.inventory[i].name} ${game.gamestate.player.inventory[i].quantity > 1? `(${game.gamestate.player.inventory[i].quantity})` : ``}</strong>`;
        let buttonData = `onclick="focusItem(${game.gamestate.player.inventory[i]})" class="itemButton" id="rank${game.gamestate.player.inventory[i].rarity}Button"`;
        buttonGridHtml += `<span><button ${buttonData}><img src="${game.gamestate.player.inventory[i].pfp}" class="itemIcon"><p id="noPadding">${title}</p></button></span>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
}

function characters() {
    replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="focusedButton"><h3>Characters</h3></button><button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${game.gamestate.player.money}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.player.characters.length; i++) {
        let title = `<strong>${game.gamestate.player.characters[i].name}</strong>`;
        let desc = `<img src="assets/redCross.png" class="smallIcon"> ${game.gamestate.player.characters[i].hp}\n<img src="assets/blueStar.png" class="smallIcon"> ${game.gamestate.player.characters[i].mp}\n<img src="assets/lightning.png" class="smallIcon"> ${game.gamestate.player.characters[i].stats.atk}\n<img src="assets/shield.png" class="smallIcon"> ${game.gamestate.player.characters[i].stats.def}`;
        let buttonData = `onclick="focusCharacter(${game.gamestate.player.characters[i]})" class="characterButton" id="rank${game.gamestate.player.characters[i].rarity}Button"`;
        buttonGridHtml += `<span><button ${buttonData}><p id="noPadding" class="characterTitle">${title}</p><img src="${game.gamestate.player.characters[i].pfp}" class="characterIcon"><p id="noPadding" class="statsText">${desc}</p></button></span>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
}

function shop() {
    replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button><button onclick="shop()" class="focusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${game.gamestate.player.money}</strong></span>`);
    /*
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.pulls.length; i++) {
        let title = `<strong>${game.gamestate.pulls[i].name}</strong>`;
        let desc = `$${game.gamestate.pulls[i].cost}`;
        let buttonData = `onclick="gachaPull(${game.gamestate.pulls[i].id})" class="pullButton" id="${game.gamestate.pulls[i].colour}Button"`;
        buttonGridHtml += `<button ${buttonData}><p>${title}\n${desc}</p></button>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`buttonGridPull`, buttonGridHtml);*/
    replacehtml(`grid`, ``);
}

function startGame() {
    var savedPlayer = localStorage.getItem('GatchaGameData');
    if (savedPlayer !== null) {
        console.log('loading previous save');
        game.gamestate = JSON.parse(savedPlayer);
        console.log(savedPlayer);
    } else {
        // No saved data found
        console.log('no save found, creating new player');
        game.gamestate = JSON.parse(JSON.stringify(data.startingGamestate));
    };
    home();
}

function home() {
    homePage = `
    <span id="bac">
        <img src="assets/DungeonOuter1.jpeg" id="bacImg">
        <div id="playButton"></div>
        <div id="teamSelection"></div>
        <div id="focus"></div>
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
    replacehtml(`game`, homePage);
    resize();
    updateTeam();
}

function main() {
    const start = performance.now();
    switch (gamestate.interface) {
        case 'home':
            home();
            break;
        default:
            break;
    }
    t++;
    const end = performance.now();
    //console.log(`Processing Time: ${end-start}ms, max: ${1000/FPS}ms for ${FPS}fps. Max Possible FPS: ${1000/(end-start)}`);
    return gameState;
};

console.log('loaded');






















/*
<div id="overlay">
    <div id="upgradesOverlay">
    </div>
    <div id="buttonGrid">
    </div>
</div>
*/