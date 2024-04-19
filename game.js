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

const single = 'single target';
const multi = 'multi target';
const aoe = 'area of effect';

// The support functions that might not be necessary
function print(a) { // GRRRRR snek
    console.log(a);
}

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

function bigNumber(number) {
    const bacs = [`K`, `M`, `B`, `T`, `Q`];
    let bac = ``;
    let i = 0;
    while (number >= 1000) {
        number /= 1000;
        bac = bacs[i];
        i++
    }

    return `${number.toPrecision(3)}${bac}`;
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
        progression: 0,
        inBattle: false,
        battleState: {
            turn: `player`,
            wave: 0,
            eb: [],
            ef: [],
            pf: [],
            pb: [],
        },
    },
    characters: [
        { // N
            Abby: { // healer
                name: `Abby`,
                title: `Healer`,
                description: `Abby is a novice healer who recently joined the Adventurers Guild. She knows a few healing spells but can't fight very well, so she's suitable for the support role.`,
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
                skills: ['slap', 'lesserHeal', 'mediumHeal', 'lesserAreaHeal'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Yuki: { // melee dps
                name: `Yuki`,
                title: `Warrior`,
                description: `Yuki recently graduated from the kingdom's swordmen academy. She's not inexperienced with the sword and knows how to use mana to strengthen her attacks. Additionally her light armour improves her felxibility and allows her to hit harder.`,
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
                skills: ['slash', 'heavyStrike', 'raiseGuard', 'swordCharge'],
                armour: {physical: [0, 10], magic: [0, 0]},
            },
            Akane: { // tank dps hybrid
                name: `Akane`,
                title: `Knight`,
                description: `Akane is one of the kindoms many trainee knights. She's good at both attacking and can absorb quite a bit of damage, but she's not the most intelligent.`,
                personality: 'arrogant',
                stats: {atk: 'medium', def: 'medium'},
                rarity: N,
                gender: female,
                pfp: `assets/animeGirl40.jpeg`,
                hp: 125,
                mp: 25,
                str: 1,
                int: 5,
                mpRegen: 5,
                skills: ['slash', 'thrust', 'swordCharge', 'counterAttack'],
                armour: {physical: [8, 15], magic: [0, 0]},
            },
            Rei: { // tanker
                name: `Rei`,
                title: `Warrior`,
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
                skills: ['wildSwing', 'overheadStrike', 'raiseGuard', 'counterAttack'],
                armour: {physical: [15, 15], magic: [0, 0]},
            },
            Emi: { // ranged dps
                name: `Emi`,
                title: `Mage`,
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
                skills: ['fireball', 'fireLance', 'fireArrows', 'firestorm'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Henrietta: { // summoner
                name: `Henrietta`,
                title: `Spedlord`,
                description: `Henrietta le Bird is very tall. Way too tall. Also she is a spedlord.`,
                personality: 'timid',
                stats: {atk: 'low', def: 'none'},
                rarity: N,
                gender: female,
                pfp: `assets/animeGirl53.jpeg`,
                hp: 80,
                mp: 100,
                str: 0.75,
                int: 25,
                mpRegen: 25,
                skills: [`slash`, `summonPotato`, `summonChicken`, `insult`],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
        },
        { // UC
            Lucy: { // whale
                name: `Lucy`,
                title: `The Coward`,
                description: `Lucy is a nobleman's daughter who enjoys adventuring. However, she is easily frightened by scary monsters despite her expensive equipment.`,
                personality: 'timid',
                stats: {atk: 'high', def: 'extreme'},
                rarity: UC,
                gender: female,
                pfp: `assets/animeGirl14.jpeg`,
                hp: 100,
                mp: 100,
                str: 1.5,
                int: 30,
                mpRegen: 10,
                skills: ['wildSwing', 'cower', 'wildCharge', 'sparkleSlash'],
                armour: {physical: [20, 50], magic: [20, 50]},
            },
        },
        { // R
            Anonymous: { // debuffer
                name: `Anonymous`,
                title: `Positron Lord`,
                description: `Former high school student, Anonymous135 quantum tunneled her way into the other world usilising her extensive knowledge of the standard model. She hates the demon lord with a burning passion as the demons don't obey the laws of physics`,
                personality: 'calm',
                stats: {atk: 'high', def: 'medium'},
                rarity: R,
                gender: female,
                pfp: `assets/animeGirl54.jpeg`,
                hp: 150,
                mp: 200,
                str: 1.25,
                int: 90,
                mpRegen: 40,
                skills: [`positronRay`,`analysis`,`gravityBind`,`lecture`],
                armour: {physical: [10, 25], magic: [25, 35]},
            },
        },
        { // SR
            Borude: { // summoner
                name: `Borude`,
                title: `Monke Trainer`,
                description: `Borude has become one with nature, gaining the power to command monkeys. She wishes to defeat the demon lord, as the demons are destroying the habitats of her monkeys.`,
                personality: 'confident',
                stats: {atk: 'low', def: 'none'},
                rarity: SR,
                gender: female,
                pfp: `assets/animeGirl55.jpeg`,
                hp: 220,
                mp: 200,
                str: 1.5,
                int: 30,
                mpRegen: 0,
                skills: [],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Ed: { // support
                name: `Ed`,
                title: `Drug Dealer`,
                description: `Former chemist and part time drug dealer, Ed broke through reality to reach the other world by synthesising a compound with negative molar mass. Now he synthesises his drugs with alchemy and deals meth in the other world, where there are no pesky poice to ruin his business. However, the return of the demon king has negatively affected his profits, so the demon lord must die.`,
                personality: 'angry',
                stats: {atk: 'low', def: 'low'},
                rarity: SR,
                gender: female,
                pfp: `assets/animeGirl56.jpeg`,
                hp: 220,
                mp: 220,
                str: 1,
                int: 75,
                mpRegen: 50,
                skills: [],
                armour: {physical: [5, 10], magic: [5, 10]},
            },
        },
        { // E
            Pi_thagoreas: { // summoner
                name: `π-thagoreas`,
                title: `Chicken Farmer`,
                description: `Born and raised on on a rural farm, π-thagoreas grew up as a talented chicken farmer, ruling over several chicken pens and over 300 chickens. When the demon lord attacked, π-thagoreas was driven out of her hometown, her chicken pens destroyed. Swaering revenge against the evil demons, π-thagoreas is willing to do anything to kill the demon lord.`,
                personality: 'calm',
                stats: {atk: 'low', def: 'low'},
                rarity: E,
                gender: female,
                pfp: `assets/animeGirl52.jpeg`,
                hp: 240,
                mp: 450,
                str: 2,
                int: 30,
                mpRegen: 50,
                skills: [`slash`, `summonChicken`, `summonChickenFlock`, `summonPheonix`],
                armour: {physical: [10, 10], magic: [5, 10]},
            },
        },
        { // L
            Kohana: { // battle mage
                name: `Kohana`,
                title: `Archmage`,
                description: `Kohana is a grand archmage who has seen countless battles over the centuries. She weilds high teir attack magic but can also support.`,
                personality: 'confident',
                stats: {atk: 'high', def: 'low'},
                rarity: L,
                gender: female,
                pfp: `assets/animeGirl27.jpeg`,
                hp: 300,
                mp: 650,
                str: 1,
                int: 80,
                mpRegen: 75,
                skills: ['shadowLance', 'darkBlast', 'arcaneBlast', 'shadowVeil'],
                armour: {physical: [0, 0], magic: [50, 25]},
            },
        },
        { // G
            Natsuki: { // glass cannon
                name: `Natsuki`,
                title: `Sword Godess`,
                description: `Natsuki is mystical figure among the continent's swordmasters. Rumored to have slain countless gods and deities, her skill with the blade is unrivaled despite being quite fragile`,
                personality: 'calm',
                stats: {atk: 'extreme', def: 'none'},
                rarity: G,
                gender: female,
                pfp: `assets/animeGirl10.jpeg`,
                hp: 100,
                mp: 875,
                str: 3,
                int: 60,
                mpRegen: 125,
                skills: ['superiorThrust', 'sevenfoldSlashOfLight', 'swordDance', 'auraSlash', 'godslayerSlash', 'focusAura'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Yui: { // warrior
                name: `Yui`,
                title: `War Godess`,
                description: `Yui is the greatest warrior on the continent, her presence able to change the tide of even the targest wars. Her mythical armor makes her near invulnerable while she mows down entire armies with her longsword.`,
                personality: 'arrogant',
                stats: {atk: 'high', def: 'high'},
                rarity: G,
                gender: female,
                pfp: `assets/animeGirl38.jpeg`,
                hp: 750,
                mp: 375,
                str: 1.75,
                int: 60,
                mpRegen: 50,
                skills: ['millionSlashes', 'superiorOverheadStrike', 'auraSlash', 'superchargeArmour', 'rallyingCall', 'superiorCounterAttack'],
                armour: {physical: [200, 50], magic: [200, 40]},
            },
        },
        { // EX
            Eco: { // useless trash
                name: `Eco`,
                title: `Hero`,
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
                skills: ['punch', 'bodyslam', 'stare', 'brag'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Redacted: { // terrorist
                name: `[Redacted]`,
                title: `Terrorist`,
                description: `Former high school student, [redacted] was isekaied into the other world as the demon lord. Despite being gender bent, she is still obsessed with terrorism and decided to become the terrorist lord, who rules over many mafias and cartels, the lord of the criminal underworld.`,
                personality: 'chunni',
                stats: {atk: 'extreme', def: 'extreme'},
                rarity: EX,
                gender: female,
                pfp: `assets/animeGirl51.jpeg`,
                hp: 975,
                mp: 1625,
                str: 3,
                int: 100,
                mpRegen: 200,
                skills: ['savageTornado', 'machinegun', 'fragGrenade',  'extremeOverheadStrike', 'soulHarvest', 'extremeRaiseGuard'],
                armour: {physical: [100, 80], magic: [250, 25]},
            },
        },
    ],
    enemies: {
        goblin: {
            name: `Goblin`,
            rarity: N,
            pfp: `assets/goblin1.jpeg`,
            hp: [40, 45, 50],
            mp: [0, 0, 0],
            str: [0.8, 0.8, 0.85],
            int: [0, 0, 0],
            mpRegen: [0, 0, 0],
            skills: ['hit', 'rapidHit', 'smash'],
            armour: {physical: [0, 0], magic: [0, 0]},
            ai: `rng`,
        },
        goblinArcher: {
            name: `Goblin`,
            rarity: N,
            pfp: `assets/goblin2.jpeg`,
            hp: [25],
            mp: [0],
            str: [1],
            int: [0],
            mpRegen: [0],
            skills: ['crossbow'],
            armour: {physical: [0, 0], magic: [0, 0]},
            ai: `rng`,
        },
        goblinWarrior: {
            name: `Goblin`,
            rarity: N,
            pfp: `assets/goblin3.jpeg`,
            hp: [60, 75],
            mp: [0, 0],
            str: [1, 1.1],
            int: [0, 0],
            mpRegen: [0, 0],
            skills: ['hit', 'rapidHit'],
            armour: {physical: [5, 10], magic: [0, 0]},
            ai: `rng`,
        },
        sir: {
            name: `Sir`, // a certain computer science teacher
            rarity: L,
            pfp: `assets/empty.jpeg`,
            hp: 10000,
            mp: 0,
            str: 1,
            int: 100,
            mpRegen: 0,
            skills: [], // give time freeze and health increase
            armour: {physical: [50, 0], magic: [50, 0]},
            ai: `rng`,
        },
    },
    summons: {
        potato: { // meat shield
            name: `Potato`,
            title: `Summoned`,
            rarity: N,
            pfp: `assets/summon4.jpeg`,
            hp: 10,
            mp: 0,
            str: 0,
            int: 0,
            mpRegen: 0,
            skills: [],
            armour: {physical: [0, 10], magic: [0, 0]},
        },
        chicken: { // meat shield
            name: `Chicken`,
            title: `Summoned`,
            rarity: UC,
            pfp: `assets/summon2.jpeg`,
            hp: 40,
            mp: 0,
            str: 1,
            int: 10,
            mpRegen: 0,
            skills: ['peck', 'scratch'],
            armour: {physical: [0, 0], magic: [0, 0]},
        },
        rooster: { // support
            name: `Rooster`,
            title: `Summoned`,
            rarity: R,
            pfp: `assets/summon2.jpeg`,
            hp: 60,
            mp: 0,
            str: 1.5,
            int: 10,
            mpRegen: 0,
            skills: ['peck', 'roosterRallyingCall'],
            armour: {physical: [0, 0], magic: [0, 0]},
        },
        pheonix: { // tanker
            name: `Chicken`,
            title: `Summoned`,
            rarity: SR,
            pfp: `assets/summon3.jpeg`,
            hp: 500,
            mp: 0,
            str: 5,
            int: 10,
            mpRegen: 0,
            skills: ['peck', 'scratch'],
            armour: {physical: [25, 10], magic: [25, 10]},
        },
    },
    skills: {
        positronRay: {
            name: `Positron Ray`,
            desc: `[attacker] launches a concentrated ray of positrons at the targeted enemy.`,
            attackType: `beam`,
            type: piercing,
            targeting: single,
            dmg: 1,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 10},
            accuracy: 90,
            attacks: 10,
        },
        peck: {
            name: `Peck`,
            desc: `[attacker] pecks the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
            dmg: 20,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 90,
            attacks: 1,
        },
        scratch: {
            name: `Scratch`,
            desc: `[attacker] scratches the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            targeting: multi,
            dmg: 5,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 90,
            attacks: 4,
        },
        soulHarvest: {
            name: `Soul Harvest`,
            desc: `[attacker] reaps the tageted enemy's soul with [pronoun] sythe.`,
            attackType: `physical`,
            type: piercing,
            targeting: single,
            dmg: 1000,
            multiplier: str,
            effects: [{id: 'hot', lvl: 975, duration: 1}],
            cost: {hp: 0, mp: 1400},
            accuracy: 500,
            attacks: 1,
        },
        slash: {
            name: `Slash`,
            desc: `[attacker] shashes at the targeted enemy, inflicing damage (hopefully).`,
            attackType: `physical`,
            type: physical,
            targeting: single,
            dmg: 12,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 90,
            attacks: 3,
        },
        machinegun: {
            name: `Assault Rifle`,
            desc: `[attacker] unloads a full magazine into the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            targeting: multi,
            dmg: 75,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 100,
            attacks: 30,
        },
        millionSlashes: {
            name: `Million Slashes`,
            desc: `[attacker] swings [pronoun] blade at extreme speeds hitting the targeted enemy countless times.`,
            attackType: `physical`,
            type: physical,
            targeting: multi,
            dmg: 16,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 100,
            attacks: 10,
        },
        sevenfoldSlashOfLight: {
            name: `Sevenfold Slash of Light`,
            desc: `[attacker] channels mana into [pronoun] sword and unleashes 7 consecutive slashes at the targeted enemy.`,
            attackType: `physical`,
            type: normal,
            targeting: multi,
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
            targeting: single,
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
            targeting: single,
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
            targeting: single,
            dmg: 90,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 20},
            accuracy: 100,
            attacks: 1,
        },
        godslayerSlash: {
            name: `God Slaying Slash`,
            desc: `[attacker] charges [pronoun] sword with a vast amount of energy, releasing a slash that cuts through even reality itself.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
            dmg: 1250,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 800},
            accuracy: Infinity,
            attacks: 1,
        },
        overheadStrike: {
            name: `Overhead Strike`,
            desc: `[attacker] leaps into the air and strikes at the targeted enemy from above.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
            dmg: 75,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 50,
            attacks: 1,
        },
        superiorOverheadStrike: {
            name: `Overhead Strike`,
            desc: `[attacker] leaps into the air and strikes at the targeted enemy from above.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
            dmg: 150,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 200,
            attacks: 1,
        },
        extremeOverheadStrike: {
            name: `Overhead Strike`,
            desc: `[attacker] leaps into the air and strikes at the targeted enemy from above.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
            dmg: 400,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 250},
            accuracy: 200,
            attacks: 1,
        },
        sparkleSlash: {
            name: `Sparkle Slash`,
            desc: `[attacker]'s special attack that [pronoun] spent years developing. It is rather flashy and powerful...`,
            attackType: `physical`,
            type: normal,
            targeting: single,
            dmg: 40,
            multiplier: str,
            effects: [],
            cost: {hp: 40, mp: 100},
            accuracy: 70,
            attacks: 5,
        },
        wildSwing: {
            name: `Wild Swings`,
            desc: `[attacker] wildly swings [pronoun] sword at the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
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
            targeting: single,
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
        extremeRaiseGuard: {
            name: `Raise Guard`,
            desc: `[attacker] raises [pronoun] guard, greatly reducing damage in the next 2 rounds.`,
            attackType: `buffDefence`,
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [100, 10], duration: 2}, {id: 'mdef', lvl: [100, 25], duration: 2}],
            cost: {hp: 0, mp: 300},
            accuracy: Infinity,
            attacks: 1,
            selfOnly: true,
        },
        focusAura: {
            name: `Focus Aura`,
            desc: `[attacker] gathers the aura within [pronoun], drasticly increasing all stats for 3 rounds.`,
            attackType: `buffDefence`,
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [100, 75], duration: 3}, {id: 'mdef', lvl: [0, 75], duration: 3}, {id: 'atk', lvl: 1, duration: 5}, {id: 'mreg', lvl: 50, duration: 5}],
            cost: {hp: 0, mp: 375},
            accuracy: Infinity,
            attacks: 1,
            selfOnly: true,
        },
        cower: {
            name: `Cower in Fear`,
            desc: `[attacker] cowers in fear, channeling mana into [pronoun] armour to reist more damage.`,
            attackType: `buffDefence`,
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [15, 10], duration: 1}],
            cost: {hp: 0, mp: 25},
            accuracy: Infinity,
            attacks: 1,
            selfOnly: true,
        },
        superchargeArmour: {
            name: `Strengthen Armour`,
            desc: `[attacker] channeling mana into [pronoun] armour to reist more damage for 5 rounds.`,
            attackType: `buffDefence`,
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [50, 10], duration: 5}],
            cost: {hp: 0, mp: 25},
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
        superiorCounterAttack: {
            name: `Perpare Counter Attack`,
            desc: `[attacker] reduces all damage taken in the next 3 rounds, and counteratacks with 150% power against the next 3 enemy to attack [pronoun] at melee range.`,
            attackType: `buffDefence`,
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [50, 10], duration: 3}, {id: 'counter', lvl: 1.5, duration: 3}],
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
            targeting: single,
            dmg: 125,
            multiplier: str,
            effects: [],
            cost: {hp: 10, mp: 15},
            accuracy: 90,
            attacks: 1,
        },
        wildCharge: {
            name: `Wild Charge`,
            desc: `[attacker] charges the targeted enemy while flailing [pronoun] sword wildly inflicting significant damage to all parties.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
            dmg: 18,
            multiplier: str,
            effects: [],
            cost: {hp: 30, mp: 15},
            accuracy: 50,
            attacks: 6,
        },
        swordDance: {
            name: `Sword Dance`,
            desc: `[attacker] sends a flury of rapid slashes and stabs at the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            targeting: multi,
            dmg: 28,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 425},
            accuracy: 150,
            attacks: 25,
        },
        savageTornado: {
            name: `Savage Tornado`,
            desc: `[attacker] spins in a circle slashing at the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            targeting: multi,
            dmg: 85,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 200},
            accuracy: 200,
            attacks: 5,
        },
        punch: {
            name: `Punch`,
            desc: `[attacker] punches the targeted enemy.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
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
            targeting: single,
            dmg: 50,
            multiplier: str,
            effects: [],
            cost: {hp: 10, mp: 0},
            accuracy: 90,
            attacks: 1,
        },
        slap: {
            name: `Slap`,
            desc: `[attacker] slaps the targeted enemy inflicting a little damage.`,
            attackType: `physical`,
            type: physical,
            targeting: single,
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
            targeting: single,
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
            extraStats: [
                {
                    icon: `question.png`,
                    desc: `effects unknown`,
                },
            ],
        },
        roosterRallyingCall: {
            name: `Rallying Call`,
            desc: `[attacker] motivates all allied chickens, increasing their defense and attack power for 3 rounds. Gives +25% attack damage, 10 physical negation and 10% physical damage resistance.`,
            attackType: `buff`,
            type: normal,
            targeting: aoe,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: Infinity,
            exec: `
            for (let i = 0; i < game.gamestate.player.team.length; i++) {
                if (game.gamestate.player.team[i].name == 'Chicken') {
                    game.gamestate.player.team[i].effects.push({id: 'def', lvl: [10, 10], duration: 3}, {id: 'atk', lvl: 0.25, duration: 3});
                }
            }
            `,
            attacks: 1,
        },
        rallyingCall: {
            name: `Rallying Call`,
            desc: `[attacker] motivates all allies, increasing their defense and attack power for 3 rounds.`,
            attackType: `buff`,
            type: normal,
            targeting: aoe,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 225},
            accuracy: Infinity,
            exec: `
            for (let i = 0; i < game.gamestate.player.team.length; i++) {
                game.gamestate.player.team[i].effects.push({id: 'def', lvl: [10, 10], duration: 3}, {id: 'atk', lvl: 0.25, duration: 3});
            }
            `,
            attacks: 1,
            extraStats: [
                {
                    icon: `clock.png`,
                    desc: `lasts 3 rounds`,
                },
                {
                    icon: `shield.png`,
                    desc: `10 physical negation to all allies`,
                },
                {
                    icon: `shield.png`,
                    desc: `10% physical resist to all allies`,
                },
                {
                    icon: `lightning.png`,
                    desc: `25% extra attack damage to all allies`,
                },
            ],
        },
        lecture: {
            name: `Lecture`,
            desc: `[attacker] enlightens all allies on the weaknesses of their enemies, increasing their attack power for 3 rounds.`,
            attackType: `buff`,
            type: normal,
            targeting: aoe,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 100},
            accuracy: Infinity,
            exec: `
            for (let i = 0; i < game.gamestate.player.team.length; i++) {
                game.gamestate.player.team[i].effects.push({id: 'atk', lvl: 0.25, duration: 3});
            }
            `,
            attacks: 1,
            extraStats: [
                {
                    icon: `clock.png`,
                    desc: `lasts 3 rounds`,
                },
                {
                    icon: `lightning.png`,
                    desc: `25% extra attack damage to all allies`,
                },
            ],
        },
        analysis: {
            name: `Analyse Enemy`,
            desc: `[attacker] analyses the targeted enemy, revealing their weaknesses.`,
            attackType: `buff`,
            type: normal,
            targeting: single,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [0, -25], duration: 5}, {id: 'mdef', lvl: [0, -25], duration: 5}],
            cost: {hp: 0, mp: 50},
            accuracy: Infinity,
            attacks: 1,
            extraStats: [
                {
                    icon: `clock.png`,
                    desc: `lasts 5 rounds`,
                },
                {
                    icon: `explode.png`,
                    desc: `take 25% more damage from all attacks`,
                },
            ],
            preventDefault: true,
        },
        gravityBind: {
            name: `Gravity Bind`,
            desc: `[attacker] weakens the targeted enemy by increasing the gravitational field strength around them.`,
            attackType: `buff`,
            type: normal,
            targeting: single,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'atk', lvl: -0.5, duration: 1}],
            cost: {hp: 0, mp: 125},
            accuracy: Infinity,
            attacks: 1,
            extraStats: [
                {
                    icon: `clock.png`,
                    desc: `lasts 1 rounds`,
                },
                {
                    icon: `lightning.png`,
                    desc: `deal 50% less damage`,
                },
            ],
            preventDefault: true,
        },
        brag: {
            name: `Brag`,
            desc: `[attacker] brags about [pronoun] accomplishments, irritating the targeted enemy.`,
            attackType: `sound`,
            type: piercing,
            targeting: single,
            dmg: 0,
            multiplier: int,
            effects: [{id: 'dot', lvl: 10, duration: 3}],
            cost: {hp: 0, mp: 5},
            accuracy: 100,
            attacks: 1,
        },
        insult: {
            name: `Insult`,
            desc: `[attacker] insults the targeted enemy, calling them a spedlord. The targeted enemy will take more damage but hit harder`,
            attackType: `sound`,
            type: piercing,
            targeting: single,
            dmg: 10,
            multiplier: int,
            effects: [{id: 'def', lvl: [-10, -25], duration: 5}, {id: 'atk', lvl: 0.5, duration: 5}],
            cost: {hp: 0, mp: 5},
            accuracy: 100,
            attacks: 1,
        },
        lesserHeal: {
            name: `Lesser Healing`,
            desc: `[attacker] heals the targeted ally.`,
            attackType: `heal`,
            type: magic,
            targeting: single,
            dmg: -20,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 25},
            accuracy: 500,
            attacks: 1,
        },
        lesserAreaHeal: {
            name: `Lesser Area Healing`,
            desc: `[attacker] heals all allies, focusing on the targeted ally.`,
            attackType: `areaHeal`,
            type: magic,
            targeting: aoe,
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
            extraStats: {
                icon: `greenCross.png`,
                desc: `10 heal to all allies`,
            },
            attacks: 1,
        },
        mediumHeal: {
            name: `Medium Healing`,
            desc: `[attacker] heals the targeted ally.`,
            attackType: `heal`,
            type: magic,
            targeting: single,
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
            targeting: single,
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
            targeting: single,
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
            targeting: single,
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
            targeting: single,
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
            targeting: single,
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
            targeting: single,
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
            targeting: aoe,
            dmg: 10,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 100},
            accuracy: Infinity,
            exec: `
            for (let i = 0; i < game.gamestate.enemies.length; i++) {
                game.gamestate.enemies.hp -= 20;
            }
            `,
            attacks: 1,
            extraStats: [{
                icon: `lightning.png`,
                desc: `20 damage to all enemies`,
            }],
        },
        fireLance: {
            name: `Fire Lance`,
            desc: `[attacker] fires a clance of fire at the targeted enemy.`,
            attackType: `fireMagic`,
            type: magic,
            targeting: single,
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
            targeting: multi,
            dmg: 10,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 50},
            accuracy: 75,
            attacks: 5,
        },
        fragGrenade: {
            name: `Frag Grenade`,
            desc: `[attacker] throws a frag grenade at the targeted enemy.`,
            attackType: `fireAOE`,
            type: physical,
            targeting: aoe,
            dmg: 300,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: Infinity,
            exec: `
            for (let i = 0; i < game.gamestate.enemies.length; i++) {
                game.gamestate.enemies.hp -= 250;
            }
            `,
            attacks: 1,
            extraStats: [{
                icon: `lightning.png`,
                desc: `250 damage to all enemies`,
            }],
        },
        summonPotato: {
            name: `Summon Potato`,
            desc: `[attacker] summons a potato. IDK what it does.`,
            attackType: `summon`,
            type: physical,
            targeting: single,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 50},
            accuracy: Infinity,
            exec: `
            // summon potato here
            `,
            attacks: 1,
            extraStats: [
                {
                    icon: `box.png`,
                    desc: `summon 1 potato`,
                },
                {
                    icon: `redCross.png`,
                    desc: `10 chicken hp`,
                },
            ],
            preventDefault: true,
        },
        summonChicken: {
            name: `Summon Chicken`,
            desc: `[attacker] summons a chicken to help fight.`,
            attackType: `summon`,
            type: physical,
            targeting: single,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 60},
            accuracy: Infinity,
            exec: `
            // summon chickens here
            `,
            attacks: 1,
            extraStats: [
                {
                    icon: `box.png`,
                    desc: `summon 1 chicken`,
                },
                {
                    icon: `redCross.png`,
                    desc: `40 chicken hp`,
                },
                {
                    icon: `lightning.png`,
                    desc: `20 chicken attack damage`,
                },
            ],
            preventDefault: true,
        },
        summonChickenFlock: {
            name: `Summon Flock`,
            desc: `[attacker] summons a flock of chickens to help fight.`,
            attackType: `summon`,
            type: physical,
            targeting: single,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 400},
            accuracy: Infinity,
            exec: `
            // summon chickens here
            `,
            attacks: 1,
            extraStats: [
                {
                    icon: `box.png`,
                    desc: `summon 5 chicken`,
                },
                {
                    icon: `redCross.png`,
                    desc: `40 chicken hp`,
                },
                {
                    icon: `lightning.png`,
                    desc: `20 chicken attack damage`,
                },
            ],
            preventDefault: true,
        },
        summonRooster: {
            name: `Summon Rooster`,
            desc: `[attacker] summons a rooster to help fight.`,
            attackType: `summon`,
            type: physical,
            targeting: single,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 100},
            accuracy: Infinity,
            exec: `
            // summon chickens here
            `,
            attacks: 1,
            extraStats: [
                {
                    icon: `box.png`,
                    desc: `summon 1 chicken`,
                },
                {
                    icon: `redCross.png`,
                    desc: `60 chicken hp`,
                },
                {
                    icon: `lightning.png`,
                    desc: `30 chicken attack damage`,
                },
            ],
            preventDefault: true,
        },
        summonPheonix: {
            name: `Summon Pheonix`,
            desc: `[attacker] summons a Pheonix, the penultimate form of the chicken, to help fight.`,
            attackType: `summon`,
            type: physical,
            targeting: single,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 450},
            accuracy: Infinity,
            exec: `
            // summon pheonix here
            `,
            attacks: 1,
            extraStats: [
                {
                    icon: `box.png`,
                    desc: `summon 1 pheonix`,
                },
                {
                    icon: `redCross.png`,
                    desc: `500 pheonix hp`,
                },
                {
                    icon: `lightning.png`,
                    desc: `100 pheonix attack damage`,
                },
            ],
            preventDefault: true,
        },
    },
    enemySkills: {
        hit: {
            attackType: `physical`,
            type: physical,
            dmg: 20,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 90,
            attacks: 1,
        },
        rapidHit: {
            attackType: `physical`,
            type: physical,
            dmg: 12,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 80,
            attacks: 3,
        },
        smash: {
            attackType: `physical`,
            type: physical,
            dmg: 35,
            multiplier: str,
            effects: [],
            cost: {hp: 10, mp: 0},
            accuracy: 70,
            attacks: 1,
        },
        crossbow: {
            attackType: `arrow`,
            type: physical,
            dmg: 25,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 90,
            attacks: 1,
        },
    },
    items: [
        {
            name: `Crude Health Potion`,
            displayName: `Health Potion`,
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
            displayName: `Health Potion`,
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
            displayName: `Health Potion`,
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
            displayName: `Regen Potion`,
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
            displayName: `Health Potion`,
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
            displayName: `Health Potion`,
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
            displayName: `Health Potion`,
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
            name: `Elixir of Life`,
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
            sellPrice: 2000000000,
            quantity: 1,
            stackSize: Infinity,
        },
    ],
    pulls: {
        
    },
    dungeons: [
        {
            name: `Goblin Den`,
            outerBac: `assets/DungeonOuter1.jpeg`,
            innerBac: `assets/bronze.png`,
            waves: [
                {
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
                {
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
                {
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
                {
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
                {
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
                {
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
                {
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
                {
                    type: `big`,
                    enemies: [
                        {
                            enemy: `goblinWarrior`,
                            lvl: 0,
                            quantity: 6,
                            location: `frontline`,
                            drops: {exp: 125, gold: 20},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
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
                {
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
                {
                    type: `boss`,
                    enemies: [
                        {
                            enemy: `goblin`,
                            lvl: 2,
                            quantity: 4,
                            location: `frontline`,
                            drops: {exp: 125, gold: 15},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.15},
                        },
                        {
                            enemy: `goblinWarrior`,
                            lvl: 1,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 150, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
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
                            enemy: `goblinWarrior`,
                            lvl: 1,
                            quantity: 1,
                            location: `backline`,
                            drops: {exp: 150, gold: 25},
                            itemDrops: {item: `lowGradeMagicStone`, chance: 0.2},
                        },
                    ],
                    clearRewards: [{type: `exp`, quantity: 10000, chance: 1}, {type: `gold`, quantity: 1000, chance: 1}],
                },
            ],
            firstClearReward: [{type: `exp`, quantity: 25000, chance: 1}, {type: `gold`, quantity: 5000, chance: 1}, {type: `item`, quantity: 1, chance: 1, item: `goblinWarHorn`}],
        }
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
        ap: 1,
    }
}

// Loading savegames
var game = {
    interface: `home`,
    gamestate: undefined,
    keypresses: [],
    mousepos: {x: 0, y: 0},
};

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

function createCharacterCard(character, id=undefined, onClick=undefined) {
    let title = `<strong>${character.name}</strong>`;
    let buttonData = `${onClick ? `onclick="${onClick}" ` : ``}class="smallCharacterButton rank${character.rarity}Button" id="${id}"`;
    let desc = `<span id="left"><div id='hpBar'><div id="${id}Hp" class="hpBarInner"></div></div><img src="assets/redCross.png" class="smallIcon"><span id="barDisplay">${character.hp}</span></span><span id="right"><div id='mpBar'><div id="${id}Mp" class="mpBarInner"></div></div><span id="barDisplay">${character.mp}</span><img src="assets/blueStar.png" class="smallIcon"></span>`;
    return `<button ${buttonData}><span id="up"><p id="noPadding" class="characterTitle">${title}</p><img src="${character.pfp}" class="characterIcon"></span>${desc}</button>`;
}

function cardLine(cards, pos, onClick) {
    html = ``;
    for (let i = 0; i < cards.length; i++) {
        html += createCharacterCard(cards[i], `${pos}${i}ID`, `${onClick}('${pos}${i}ID')`);
    }
    return html;
}

function renderCards(pOnClick=undefined, eOnClick=undefined, enemyBack=game.gamestate.battleState.eb, enemyFront=game.gamestate.battleState.ef, playerFront=game.gamestate.battleState.pf, playerBack=game.gamestate.battleState.pb) {
    replacehtml(`enemyBackline`, cardLine(enemyBack, 'EB', eOnClick));
    replacehtml(`enemyFrontline`, cardLine(enemyFront, 'EF', eOnClick));
    replacehtml(`playerFrontline`, cardLine(playerFront, 'PF', pOnClick));
    replacehtml(`playerBackline`, cardLine(playerBack, 'PB', pOnClick));
}

function startWave() {
    let dungeon = data.dungeons[game.gamestate.progression];
    let eb = game.gamestate.battleState.eb;
    let ef = game.gamestate.battleState.ef;
    for (let i = 0; i < dungeon.waves[game.gamestate.battleState.wave].enemies.length; i++) {
        let enemyData = dungeon.waves[game.gamestate.battleState.wave].enemies[i];
        let enemy = JSON.parse(JSON.stringify(data.enemies[enemyData.enemy]));
        if (enemy.hp.constructor === Array) enemy.hp = enemy.hp[enemyData.lvl];
        if (enemy.mp.constructor === Array) enemy.mp = enemy.mp[enemyData.lvl];
        if (enemy.str.constructor === Array) enemy.str = enemy.str[enemyData.lvl];
        if (enemy.int.constructor === Array) enemy.int = enemy.int[enemyData.lvl];
        if (enemy.mpRegen.constructor === Array) enemy.mpRegen = enemy.mpRegen[enemyData.lvl];
        enemy.rarity = enemyData.lvl;
        enemy.drops = enemyData.drops;
        enemy.itemDrops = enemyData.itemDrops;
        if (enemyData.location == `frontline`) {
            for (let i = 0; i < enemyData.quantity; i++) ef.push(enemy);
        } else {
            for (let i = 0; i < enemyData.quantity; i++) eb.push(enemy);
        }
    }
}

function selectCard(id) {
    let row = id.slice(0, 2);
    let pos = id.slice(2, -2);
    return game.gamestate.battleState[row.toLowerCase()][pos];
}

function selectAction(id) {
    let card = selectCard(id);
    console.log(card);
    let cardHtml = document.getElementById(id);
    print(id);
    print(cardHtml.className);
    for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
        print(`${id.slice(0, 2)}${i}ID`);
        document.getElementById(`${id.slice(0, 2)}${i}ID`).className = document.getElementById(`${id.slice(0, 2)}${i}ID`).className.replace(` selected`, ``);
    }
    for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
        document.getElementById(`${id.slice(0, 2)}${i}ID`).className = document.getElementById(`${id.slice(0, 2)}${i}ID`).className.replace(` selected`, ``);
    }
    cardHtml.className += ` selected`;
    skills(card);
}

function useSkill(skillId) {
    let skill = data.skills[skillId];
    print(`skill selected`);
    print(skill);
    document.getElementById(`buttonGridInventory`).innerHTML = document.getElementById(`buttonGridInventory`).innerHTML.replace(` selected`, ``);
    document.getElementById(skill.name).className += ` selected`;
    
}

async function battle() {
    let battleState = game.gamestate.battleState;
    console.log(game.gamestate.battleState);
    let prev = battleState.turn;
    while (game.gamestate.inBattle) {
        switch(battleState.turn) {
            case `player`:
                renderCards(`selectAction`);
                break;
            case `enemy`:
                renderCards();
                break;
            case `effects`:
                renderCards();
                break;
        }
        while (battleState.turn == prev) {
            await new Promise(resolve => setTimeout(resolve, 250));
            console.log(`Battle: Waiting`);
        }
    }
}

async function runDungeon() {
    let dungeon = data.dungeons[game.gamestate.progression];
    let battleState = game.gamestate.battleState;
    for (battleState.wave; battleState.wave < dungeon.waves.length; battleState.wave++) {
        battleState.turn = `player`; // player always gets first move
        startWave();
        renderCards();
        battle();
        while (battleState.ef.length + battleState.eb.length > 0) {
            /* Kill all enemies
            game.gamestate.battleState.ef = [];
            game.gamestate.battleState.eb = [];
            */
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log(`Dungeon: Waiting`);
        }
        console.log(`Wave Cleared`);
        renderCards();
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Do a wave cleared animation or something
    }
}

function startDungeon() {
    let dungeon = data.dungeons[game.gamestate.progression];
    exitFocus();
    replacehtml(`bac`, `<img src="${dungeon.innerBac}" id="bigBacImg"><div id="battleScreen"></div>`);
    inventory();
    replacehtml(`battleScreen`, `<div id="enemyBackline" class="battleCardContainer"></div><div id="enemyFrontline" class="battleCardContainer"></div><div id="gameHints"></div><div id="playerFrontline" class="battleCardContainer"></div><div id="playerBackline" class="battleCardContainer"></div><div id="dialogueBox"></div>`);
    let battleState = game.gamestate.battleState;
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        battleState.pb.push(game.gamestate.player.team[i]);
    }
    game.gamestate.inBattle = true;
    game.gamestate.battleState.wave = 0;
    resize();
    inventory();
    console.log('dungeon started');
    runDungeon();
}

function rank(n) {
    switch (n) {
        case 0:
            return ' [N]';
        case 1:
            return '[UC]';
        case 2:
            return ' [R]';
        case 3:
            return '[SR]';
        case 4:
            return ' [E]';
        case 5:
            return ' [L]';
        case 6:
            return ' [G]';
        case 7:
            return '[EX]';
        default:
            return '[unknown]';
    }
}

function resize() {
    console.log('resized');
    let sidebarWidth = Math.max(370, Math.ceil((display.x - display.y - 30) / 170) * 170 + 30);
    if (game.gamestate.inBattle) sidebarWidth = 370;
    document.getElementById('sidebar').style.width = `${sidebarWidth}px`;
    let teamPosition = ((display.x - sidebarWidth) - 685) / 2;
    if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style.left = `${teamPosition}px`;
    let playButtonPosition = ((display.x - sidebarWidth) - 200) / 2;
    if (document.getElementById('playButton')) document.getElementById('playButton').style.left = `${playButtonPosition}px`;
    let focusWindowSize = display.x - sidebarWidth;
    if (document.getElementById('focus')) document.getElementById('focus').style.width = `${focusWindowSize - 10}px`;
    let battleCardsPosition = ((display.x - sidebarWidth) - 1020) / 2;
    if (document.getElementById('enemyBackline')) document.getElementById('enemyBackline').style.left = `${battleCardsPosition}px`;
    if (document.getElementById('enemyFrontline')) document.getElementById('enemyFrontline').style.left = `${battleCardsPosition}px`;
    if (document.getElementById('playerFrontline')) document.getElementById('playerFrontline').style.left = `${battleCardsPosition}px`;
    if (document.getElementById('playerBackline')) document.getElementById('playerBackline').style.left = `${battleCardsPosition}px`;
}

function updateBar(id, percent) {
    if (document.getElementById(id)) document.getElementById(id).style.minWidth = `${percent*60}px`;
    else console.error(`can not find card id: ${id}`);
}

function clearData() {
    localStorage.removeItem('GatchaGameData');
    console.log('cleared previous data');
}

function inTeam(characterId) {
    let playerTeam = game.gamestate.player.team;
    for (let i = 0; i < playerTeam.length; i++) {
        if (playerTeam[i] && playerTeam[i].name == game.gamestate.player.characters[characterId].name) return true;
    }
    return false;
}

function addToTeam(characterId) {
    let character = game.gamestate.player.characters[characterId];
    game.gamestate.player.team.push(character);
    updateTeam();
    focusCharacter(characterId);
}

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
}

function inventorySellItem(itemId) {
    let item = game.gamestate.player.inventory[itemId];
    item.quantity -= 1;
    game.gamestate.player.money += item.sellPrice;
    if (item.quantity <= 0) {
        let newItem = [];
        for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
            if (game.gamestate.player.inventory[i].quantity > 0) newItem.push(game.gamestate.player.inventory[i]);
        }
        game.gamestate.player.inventory = newItem;
        exitFocus();
    } else {
        focusItem(itemId);
    }
    inventory();
}

function inventoryBuyItem(itemId) {
    let item = game.gamestate.player.inventory[itemId];
    item.quantity += 1;
    game.gamestate.player.money -= item.purchacePrice;
    focusItem(itemId);
    inventory();
}

function focusItem(itemId) {
    let item = game.gamestate.player.inventory[itemId];
    let stats = `<br><span id="veryBig"><strong>Stats:</strong></span><br>`;
    if (item.hp) stats += `<img src="assets/greenCross.png" class="mediumIconDown"> replenishes ${item.hp} health instantly<br>`;
    if (item.mp) stats += `<img src="assets/blueStar.png" class="mediumIconDown"> replenishes ${item.mp} mana instantly<br>`;
    if (item.str) stats += `<img src="assets/lightning.png" class="mediumIconDown"> increases strength by ${item.str*100}%<br>`;
    if (item.int) stats += `<img src="assets/blueStar.png" class="mediumIconDown"> increases inteligence by ${item.int}<br>`;
    if (item.effects[0]) stats += `<img src="assets/greenCross.png" class="mediumIconDown"> ${item.effects[0].id == 'hot' ? `heals ${item.effects[0].lvl} hp per round for ${item.effects[0].duration} rounds` : `removes all status effects`}<br>`;
    stats += `<img src="assets/lightnings.png" class="mediumIconDown"> ${item.uses} use${item.uses > 1 ? 's' : ''}<br>`;
    stats += `<img src="assets/box.png" class="mediumIconDown"> ${item.quantity} in stock<br>`;
    let shop = `<div id="inventoryShop">`;
    if (item.purchaceable) shop += (game.gamestate.player.money >= item.purchacePrice ?  `<button onclick="inventoryBuyItem(${itemId})" id="buyButton">` : `<button id="cantBuyButton">`) + `Buy 1 ($${bigNumber(item.purchacePrice)})</button>`;
    if (item.purchaceable && item.sellable)  shop += `<span id="wasteOfSpace"></span>`;
    if (item.sellable) shop += `<button onclick="inventorySellItem(${itemId})" id="sellButton">Sell 1 ($${bigNumber(item.sellPrice)})</button>`;
    shop += `</div>`;
    document.getElementById('focus').style.display = `block`;
    replacehtml(`focusTitle`, `<span id="rank${item.rarity}Text"><strong>${rank(item.rarity)} ${item.displayName ? item.displayName : item.name} </strong></span>`);
    replacehtml(`focusImageContainer`, `<img src="${item.pfp}" class="focusIcon">`);
    replacehtml(`focusDescription`, item.description);
    replacehtml(`focusStats`, stats);
    replacehtml(`focusSkills`, shop);
}

function focusCharacter(characterId) {
    let character = game.gamestate.player.characters[characterId];
    let stats = `<strong>Stats:</strong><br><img src="assets/redCross.png" class="mediumIconDown"> ${character.hp} health points<br><img src="assets/blueStar.png" class="mediumIconDown"> ${character.mp} mana points<br><img src="assets/shield.png" class="mediumIconDown"> ${character.armour.physical[0]} physical negation<br><img src="assets/shield.png" class="mediumIconDown"> ${character.armour.physical[1]}% physical resistance<br><img src="assets/blueShield.png" class="mediumIconDown"> ${character.armour.magic[0]} magical negation<br><img src="assets/blueShield.png" class="mediumIconDown"> ${character.armour.magic[1]}% magical resistance<br>`;
    let skills = `<br><span id="veryBig"><strong>Skills:</strong></span><br>`;
    for (let i = 0; i < character.skills.length; i++) {
        let skill = `<span id="bigger">${data.skills[character.skills[i]].name}</span><br>`;
        skill += `<span id="smaller">${data.skills[character.skills[i]].desc.replace('[attacker]', character.name).replace('[pronoun]', character.gender == female ? 'her' : 'his')}</span><br>`;
        let dmg = data.skills[character.skills[i]].dmg;
        switch (data.skills[character.skills[i]].multiplier) {
            case str:
                dmg *= character.str;
                break;
            case int:
                dmg *= 1+(character.int/100);
                break;
        }
        dmg = Math.floor(dmg);
        if (data.skills[character.skills[i]].dmg > 0) skill += `<img src="assets/lightning.png" class="smallIcon"> ${dmg} damage<br>`;
        else if (data.skills[character.skills[i]].dmg < 0) skill += `<img src="assets/greenCross.png" class="smallIcon"> ${-dmg} heal<br>`;
        if (data.skills[character.skills[i]].extraStats) {
            for (let j = 0; j < data.skills[character.skills[i]].extraStats.length; j++) {
                skill += `<img src="assets/${data.skills[character.skills[i]].extraStats[j].icon}" class="smallIcon"> ${data.skills[character.skills[i]].extraStats[j].desc}<br>`;
            }
        }
        if (data.skills[character.skills[i]].effects) {
            for (let j = 0; j < data.skills[character.skills[i]].effects.length; j++) {
                switch (data.skills[character.skills[i]].effects[j].id) {
                    case 'dot':
                        skill += `<img src="assets/redDrop.png" class="smallIcon"> ${data.skills[character.skills[i]].effects[j].lvl} damage over time for ${data.skills[character.skills[i]].effects[j].duration} rounds<br>`;
                        break;
                    case 'hot':
                        skill += `<img src="assets/greenCross.png" class="smallIcon"> ${data.skills[character.skills[i]].effects[j].lvl} heal over time for ${data.skills[character.skills[i]].effects[j].duration} rounds<br>`;
                        break;
                    case 'def':
                        skill += `<img src="assets/shield.png" class="smallIcon"> ${data.skills[character.skills[i]].effects[j].lvl[0]} physical negation<br><img src="assets/shield.png" class="smallIcon"> ${data.skills[character.skills[i]].effects[j].lvl[1]}% physical resistance for ${data.skills[character.skills[i]].effects[j].duration} rounds<br>`;
                        break;
                    case 'mdef':
                        skill += `<img src="assets/blueShield.png" class="smallIcon"> ${data.skills[character.skills[i]].effects[j].lvl[0]} magical negation<br><img src="assets/blueShield.png" class="smallIcon"> ${data.skills[character.skills[i]].effects[j].lvl[1]}% magical resistance for ${data.skills[character.skills[i]].effects[j].duration} rounds<br>`;
                        break;
                    case 'atk':
                        skill += `<img src="assets/lightning.png" class="smallIcon"> ${data.skills[character.skills[i]].effects[j].lvl*100}% extra attack damage for ${data.skills[character.skills[i]].effects[j].duration} rounds<br>`;
                        break;
                    case 'barrier':
                        skill += `<img src="assets/${data.skills[character.skills[i]].effects[j].type == magic ? 'blueShield' : 'shield'}.png" class="smallIcon"> ${data.skills[character.skills[i]].effects[j].lvl} hp ${data.skills[character.skills[i]].effects[j].type} barrier for ${data.skills[character.skills[i]].effects[j].duration} rounds<br>`;
                        break;
                    case 'mreg':
                        skill += `<img src="assets/blueStar.png" class="smallIcon"> regenerate ${data.skills[character.skills[i]].effects[j].lvl} extra mp per round for ${data.skills[character.skills[i]].effects[j].duration} rounds<br>`;
                        break;
                    default:
                        console.log(`unknown effect ${data.skills[character.skills[i]].effects[j].id}`);
                        break;
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
    else if (game.gamestate.player.team.length < 4) shop += `<button onclick="addToTeam(${characterId})" id="buyButton">Add to Team</button>`;
    else shop += `<button id="cantBuyButton">Add to Team</button>`;
    shop += `</div>`;
    document.getElementById('focus').style.display = `block`;
    replacehtml(`focusTitle`, `<span id="rank${character.rarity}Text"><strong>${rank(character.rarity)} ${character.title} ${character.name} </strong></span>`);
    replacehtml(`focusImageContainer`, `<img src="${character.pfp}" class="focusIcon">`);
    replacehtml(`focusDescription`, character.description);
    replacehtml(`focusStats`, stats.replace('none', 'no'));
    replacehtml(`focusSkills`, shop + skills);
}

function exitFocus() {
    document.getElementById('focus').style.display = `none`;
}

function updateTeam() {
    let canBattle = false;
    let buttonGridHtml = ``;
    for (let i = 0; i < 4; i++) {
        if (game.gamestate.player.team[i] != undefined) {
            buttonGridHtml += createCharacterCard(game.gamestate.player.team[i]);
            canBattle = true;
        } else {
            buttonGridHtml += `<button class="smallCharacterButton"><p id="noPadding" class="characterTitle"> </p><img src="assets/empty.png" class="characterIcon"><span id="left"><img src="assets/empty.png" class="smallIcon"></button>`;
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
    replacehtml(`money`, `<span><strong>Money: $${bigNumber(game.gamestate.player.money)}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.pulls.length; i++) {
        let title = `<strong>${game.gamestate.pulls[i].name}</strong>`;
        let desc = `$${game.gamestate.pulls[i].cost}`;
        let buttonData = `onclick="gachaPull(${game.gamestate.pulls[i].id})" class="pullButton ${game.gamestate.pulls[i].colour}Button"`;
        buttonGridHtml += `<button ${buttonData}><p>${title}<br>${desc}</p></button>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridPull">${buttonGridHtml}</div>`);
}

function inventory() {
    console.log('inventory');
    if (game.gamestate.inBattle) replacehtml(`nav`, `<button onclick="inventory()" class="focusedButton"><h3>Inventory</h3></button><button onclick="skills()" class="unFocusedButton"><h3>Skills</h3></button>`);
    else replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="focusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button><button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>`);
    if (!game.gamestate.inBattle) replacehtml(`money`, `<span><strong>Money: $${bigNumber(game.gamestate.player.money)}</strong></span>`);
    else replacehtml(`money`, ``);
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.player.inventory.length; i++) {
        let title = `<strong>${game.gamestate.player.inventory[i].name}</strong>`;

        let buttonData = `${game.gamestate.inBattle ? `onclick="useItem(${i})"` : `onclick="focusItem(${i})"`} class="itemButton" id="rank${game.gamestate.player.inventory[i].rarity}Button"`;
        buttonGridHtml += `<span><button ${buttonData}><img src="${game.gamestate.player.inventory[i].pfp}" class="itemIcon"><p id="noPadding">${title}</p>${game.gamestate.player.inventory[i].quantity > 1 ? `<div id="cornerIcon"><span id="down">${game.gamestate.player.inventory[i].quantity > 99 ? `99+`: game.gamestate.player.inventory[i].quantity}</span></div></button>` : ``}</span>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
}

function skills(card) {
    console.log('skills');
    replacehtml(`nav`, `<button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button><button onclick="skills()" class="focusedButton"><h3>Skills</h3></button>`);
    replacehtml(`money`, `<span><strong>${card.name}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < card.skills.length; i++) {
        let title = `<strong>${data.skills[card.skills[i]].name}</strong>`;
        let desc = `${data.skills[card.skills[i]].desc.replace(`[attacker]`, card.name).replace(`[pronoun]`, card.gender == female ? `her` : `his`)}<br><img src="assets/lightning.png" class="smallIcon"> ${data.skills[card.skills[i]].dmg} × ${data.skills[card.skills[i]].attacks}<br><img src="assets/explosion.png" class="smallIcon"> ${data.skills[card.skills[i]].targeting}<br>${data.skills[card.skills[i]].cost.hp ? `<img src="assets/greenCross.png" class="smallIcon"> ${data.skills[card.skills[i]].cost.hp}` : ``} ${data.skills[card.skills[i]].cost.mp ? `<img src="assets/blueStar.png" class="smallIcon"> ${data.skills[card.skills[i]].cost.mp}` : ``}`;
        let buttonData = `onclick="useSkill('${card.skills[i]}')" id="${data.skills[card.skills[i]].name}" class="pullButton greyButton smallerFont"`;
        buttonGridHtml += `<span><button ${buttonData}><p id="noPadding"><strong>${title}</strong><br>${desc}</p></button></span>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
}

function characters() {
    replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="focusedButton"><h3>Characters</h3></button><button onclick="shop()" class="unFocusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${bigNumber(game.gamestate.player.money)}</strong></span>`);
    let buttonGridHtml = ``;
    for (let i = 0; i < game.gamestate.player.characters.length; i++) {
        let title = `<strong>${game.gamestate.player.characters[i].name}</strong>`;
        let desc = `<img src="assets/redCross.png" class="smallIcon"> ${game.gamestate.player.characters[i].hp}\n<img src="assets/blueStar.png" class="smallIcon"> ${game.gamestate.player.characters[i].mp}\n<img src="assets/lightning.png" class="smallIcon"> ${game.gamestate.player.characters[i].stats.atk}\n<img src="assets/shield.png" class="smallIcon"> ${game.gamestate.player.characters[i].stats.def}`;
        let buttonData = `onclick="focusCharacter(${i})" class="characterButton" id="rank${game.gamestate.player.characters[i].rarity}Button"`;
        buttonGridHtml += `<span><button ${buttonData}><p id="noPadding" class="characterTitle">${title}</p><img src="${game.gamestate.player.characters[i].pfp}" class="characterIcon"><p id="noPadding" class="statsText">${desc}</p></button></span>`;
    }
    console.log(buttonGridHtml);
    replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
}

function shop() {
    replacehtml(`nav`, `<button onclick="pull()" class="unFocusedButton"><h3>Pull</h3></button><button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button> <button onclick="characters()" class="unFocusedButton"><h3>Characters</h3></button><button onclick="shop()" class="focusedButton"><h3>Shop</h3></button>`);
    replacehtml(`money`, `<span><strong>Money: $${bigNumber(game.gamestate.player.money)}</strong></span>`);
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

    // Give Testing items
    if (true) {
        console.log(`Giving Player Debug Items`);
        for (let i = 0; i < data.items.length; i++) {
            game.gamestate.player.inventory.push(JSON.parse(JSON.stringify(data.items[i])));
            game.gamestate.player.inventory[i].quantity = randint(1,100);
        }
        for (let i = 0; i < data.characters.length; i++) {
            Object.keys(data.characters[i]).forEach(function(key) {
                game.gamestate.player.characters.push(JSON.parse(JSON.stringify({...data.characters[i][key], ...data.characterData})));
            });
        }
    }

    home();
}

function home() {
    homePage = `
    <span id="bac">
        <img src="${data.dungeons[game.gamestate.progression].outerBac}" id="bacImg">
        <div id="playButton"></div>
        <div id="teamSelection"></div>
        <div id="focus">
            <div id="focusTopRow">
                <span id="focusTitle"><strong></strong></span>
                <span id="exitFocus">
                    <button onclick="exitFocus()" class="closeButton"><img src="assets/blackX.png" class="mediumIcon"></button>
                </span>
            </div>
            <div id="focusBody">
                <div id="focusImageContainer">
                </div>
                <span id="focusDescription"></span>
                <div id="focusStats">
                    <p></p>
                </div>
                <div id="focusSkills">
                    <p></p>
                </div>
            </div>
        </div>
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
    return gamestate;
};

console.log('loaded');
