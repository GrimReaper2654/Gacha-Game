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

// The support functions that might not be necessary
function print(a) { // GRRRRR snek
    console.log(a);
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

function generateId() {
    const timestamp = Date.now().toString(36); 
    const randomNum = Math.random().toString(36).slice(2, 11);
    return `${timestamp}-${randomNum}`; 
}

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
};

function replacehtml(element, text) {
    document.getElementById(element).innerHTML = text;
};

function addhtml(element, text) {
    document.getElementById(element).innerHTML = document.getElementById(element).innerHTML + text;
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
};

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
        case 'projection':
        case 'vector resolute':
        return vMath(v2, vMath(v1, v2, '.')/vMath(v2, null, '||')**2, 'x');
        default:
            console.error('what are you trying to do to to that poor vector?');
    }
};

function toComponent(m, r) {
    return {x: m * Math.sin(r), y: -m * Math.cos(r), i: m * Math.sin(r), j: -m * Math.cos(r)};
};

function toPol(i, j) {
    if (i instanceof Object) {
        if (typeof i.i === 'number') return {m: Math.sqrt(i.i**2+i.j**2), r: aim({x: 0, y: 0}, {x: i.i, y: i.j})};
        return {m: Math.sqrt(i.x**2+i.y**2), r: aim({x: 0, y: 0}, {x: i.x, y: i.y})};
    } 
    return {m: Math.sqrt(i**2+j**2), r: aim({x: 0, y: 0}, {x: i, y: j})};
};

// a graveyard of failed getCoords functions

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
};

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
}

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

function unPixel(px) {
    return parseFloat(px.slice(0, -2));
};

var data = {
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
            battleOver: false,
            wave: 0,
            eb: [],
            ef: [],
            pf: [],
            pb: [],
            tempStorage: {},
        },
        particles: {},
    },
    characters: [
        { // N
            Abby: { // healer
                name: `Abby`,
                title: `Healer`,
                description: `Abby is a novice healer who recently joined the Adventurers Guild. She knows a few healing spells but can't fight very well, so she's suitable for the support role.`,
                personality: 'timid',
                stats: {atk: 'low', def: 'low'},
                rarity: N,
                gender: female,
                pfp: `assets/AnimeGirl2.jpeg`,
                hp: 90, 
                mp: 120, 
                str: 0.8,
                int: 100, 
                mpRegen: 15, 
                skills: ['slap', 'lesserHeal', 'mediumHeal', 'lesserAreaHeal'],
                armour: {physical: [2, 5], magic: [2, 5]}, 
            },
            Yuki: { // dps
                name: `Yuki`, // name of character
                title: `Soldier`, // title to put before name
                description: `Yuki recently graduated from the kingdom's swordmen academy. She's not inexperienced with the sword and knows how to use mana to strengthen her attacks. Additionally her light armour improves her felxibility and allows her to hit harder.`, // description of character
                personality: 'calm', // determines voice lines for character
                stats: {atk: 'high', def: 'low'}, // stats to show to user
                rarity: N, // how 'good' the character is. In ascending order, the rarities are N (normal), UC (uncommon), R (rare), SR (super rare), E (epic), L (legendary), and G (godly)
                gender: female, // gender of character, used for determining voice lines
                pfp: `assets/AnimeGirl42.jpeg`, // character icon image
                hp: 110, // health
                mp: 75, // mana
                str: 1.25, // strength (physical attack damage = attack base damage * str)
                int: 100, // intelligence (magic attack damage = attack base damage * int/100)
                mpRegen: 5, // mana regeneration per round
                skills: ['slash', 'lesserStrengthEnhancement', 'swordCharge', 'overheadStrike'], // attacks and abilities (every character should have at least 4)
                armour: {physical: [5, 0], magic: [0, 0]}, // resistances to damage, first number is flat damage reduction, second is a percentage reduction
            },
            Akane: { // tank
                name: `Akane`,
                title: `Knight`,
                description: `Akane is one of the kingdom's many knights. She's got good durability and knows her way around a fight.`,
                personality: 'arrogant',
                stats: {atk: 'medium', def: 'high'},
                rarity: N,
                gender: female,
                pfp: `assets/AnimeGirl40.jpeg`,
                hp: 170,
                mp: 30,
                str: 0.9,
                int: 95,
                mpRegen: 5,
                skills: ['stunningBlows', 'slash', 'reinforceArmour', 'swordCharge'],
                armour: {physical: [12, 25], magic: [2, 5]}, 
            },
            Emi: { // glass cannon dps
                name: `Emi`,
                title: `Mage`,
                description: `Emi is an apprentice mage from the red mage tower. She specializes in fire elemental attacks at long ranges but is inexperienced in close combat.`,
                personality: 'angry',
                stats: {atk: 'high', def: 'none'},
                rarity: N,
                gender: female,
                pfp: `assets/AnimeGirl48.jpeg`,
                hp: 60, 
                mp: 150,
                str: 0.9,
                int: 100, 
                mpRegen: 25, 
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
                pfp: `assets/AnimeGirl53.jpeg`,
                hp: 80,
                mp: 100,
                str: 0.75,
                int: 69,
                mpRegen: 25,
                skills: [`punch`, `summonPotato`, `summonChicken`, `insult`],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Hana: { // tank / dps
                name: `Hana`,
                title: `Wanderer`,
                description: `Hana was orphaned after her village was razed by the demon lord's army. She swore a vow of vengence to hunt down all demonic creatures and trains relentlessly every day.`,
                personality: 'angry',
                stats: {atk: 'high', def: 'medium'},
                rarity: N,
                gender: female,
                pfp: `assets/AnimeGirl8.jpeg`,
                hp: 125,
                mp: 50,
                str: 1,
                int: 100,
                mpRegen: 7,
                skills: ['slash', 'raiseGuard', 'swordCharge', 'overheadStrike'],
                armour: {physical: [10, 10], magic: [2, 0]}, 
            },
            Maiko: { // dps
                name: `Maiko`,
                title: `Wanderer`, 
                description: `With no home to call her own, Maiko roams from town to town, taking on any quest that promises a warm meal and a place to rest for the night. Years of living alone in the wilderness has taught Maiko how to fight and some basic first aid.`,
                personality: 'calm', 
                stats: {atk: 'high', def: 'low'}, 
                rarity: N,
                gender: female, 
                pfp: `assets/AnimeGirl41.jpeg`, 
                hp: 100, 
                mp: 100, 
                str: 1, 
                int: 100, 
                mpRegen: 10, 
                skills: ['heavySlash', 'lesserStrengthEnhancement', 'inferiorSwordDance', 'firstAid'], 
                armour: {physical: [3, 0], magic: [0, 0]}, 
            },
        },
        { // UC
            Rei: { // tank
                name: `Rei`,
                title: `Warrior`,
                description: `Rei is clumsy and often misses her attacks, but has a suit of heavy armour that allows her to tank damage quite well.`,
                personality: 'confident',
                stats: {atk: 'low', def: 'high'},
                rarity: UC,
                gender: female,
                pfp: `assets/AnimeGirl9.jpeg`,
                hp: 230, 
                mp: 30,
                str: 1,
                int: 80,
                mpRegen: 5,
                skills: ['kick', 'raiseGuard', 'wildSwing', 'reinforceArmour'],
                armour: {physical: [20, 25], magic: [5, 5]}, 
            },
            Ellen: { // dps
                name: `Ellen`,
                title: `Martial Artist`, 
                description: `Ellen is a low ranking diciple of the Wudang Sect. She trains hard but has no tallent so Ellen has mastered the basics but struggles with controlling qi (mana).`,
                personality: 'calm', 
                stats: {atk: 'medium', def: 'low'}, 
                rarity: UC,
                gender: female, 
                pfp: `assets/AnimeGirl62.jpeg`, 
                hp: 160, 
                mp: 40, 
                str: 1.75, 
                int: 100, 
                mpRegen: 5, 
                skills: ['heavyBlows', 'stunningBlows', 'flyingKick', 'lesserPhysicalEnhancement'], 
                armour: {physical: [5, 15], magic: [3, 0]}, 
            },
        },
        { // R
            Anonymous: { // debuffer / support
                name: `Anonymous`,
                title: `Positron Lord`,
                description: `Former high school student, Anonymous135 quantum tunneled her way into the other world usilising her extensive knowledge of the standard model. She hates the demon lord with a burning passion as the demons don't obey the laws of physics`,
                personality: 'calm',
                stats: {atk: 'low', def: 'low'},
                rarity: R,
                gender: female,
                pfp: `assets/AnimeGirl54.jpeg`,
                hp: 140,
                mp: 200,
                str: 0.9,
                int: 150,
                mpRegen: 40,
                skills: [`positronRay`,`analysis`,`gravityBind`,`lecture`],
                armour: {physical: [0, 25], magic: [0, 10]},
            }, 
            Miki: { // tank / dps
                name: `Miki`,
                title: `Paladin`,
                description: `A veteran of many holy wars, Miki has fought in numerous battles against heretics and demons, emerging victorious and more resolute in her faith each time. Her unwavering devotion towards the Tajism church guides her every move.`,
                personality: 'calm',
                stats: {atk: 'high', def: 'high'},
                rarity: R,
                gender: female,
                pfp: `assets/AnimeGirl57.jpeg`,
                hp: 170,
                mp: 170,
                str: 1.5,
                int: 75,
                mpRegen: 40,
                skills: ['improvedSlash', 'divineProtection', 'inferiorSwordDance', 'righteousSmite'],
                armour: {physical: [25, 30], magic: [15, 30]}, 
            }, 
            Kaede: { // tank
                name: `Kaede`,
                title: `Shielder`,
                description: `Hailing from a fallen empire, Kaede is a soldier experienced in team combat. She wields her shield effectively to protect her allies from harm.`,
                personality: 'calm',
                stats: {atk: 'low', def: 'high'},
                rarity: R,
                gender: female,
                pfp: `assets/AnimeGirl18.jpeg`,
                hp: 300, 
                mp: 50,
                str: 1,
                int: 80,
                mpRegen: 5,
                skills: ['heavyBlows', 'shieldBash', 'raiseGuard', 'reinforceShield'],
                armour: {physical: [25, 50], magic: [15, 35]}, 
            },
        },
        { // SR
            Lucy: { // tank
                name: `Lucy`,
                title: `The Invulnerable`,
                description: `Lucy is a timid girl who somehow stumbled upon a legendary set of equipment. She has no idea how to fight but her equipment makes her nearly invincible.`,
                personality: 'timid',
                stats: {atk: 'medium', def: 'extreme'},
                rarity: SR, 
                gender: female,
                pfp: `assets/AnimeGirl14.jpeg`,
                hp: 100, 
                mp: 100, 
                str: 2, 
                int: 75, 
                mpRegen: 25, 
                skills: ['wildSwing', 'wildCharge', 'cower', 'sparkleSlash'], 
                armour: {physical: [45, 95], magic: [25, 90]}, 
            },
            Edwarda: { // support
                name: `Edwarda`,
                title: `Drug Dealer`,
                description: `Former chemist and part time drug dealer, Edwarda broke through reality to reach the other world by synthesising a compound with negative molar mass. Now, she synthesises her drugs with alchemy and deals meth in the other world, where there are no pesky poicemen to ruin her business. However, the return of the demon king has negatively affected her profits, so the demon lord must die.`,
                personality: 'angry',
                stats: {atk: 'medium', def: 'low'},
                rarity: SR,
                gender: female,
                pfp: `assets/AnimeGirl56.jpeg`,
                hp: 220,
                mp: 220,
                str: 1,
                int: 169,
                mpRegen: 50,
                skills: ['mediumMeth', 'molotovCocktail', 'greaterHeal', 'greaterMeth'],
                armour: {physical: [5, 10], magic: [5, 10]},
            },
        },
        { // E
            Pi_thagoreas: { // summoner
                name: `π-thagoreas`,
                title: `Chicken Farmer`,
                description: `Born and raised on on a rural farm, π-thagoreas grew up as a talented chicken farmer, ruling over several chicken pens and over 300 chickens. When the demon lord attacked, π-thagoreas was driven out of her hometown, her chicken pens destroyed. Swaering revenge against the evil demons, π-thagoreas is willing to do anything to kill the demon lord.`,
                personality: 'calm',
                stats: {atk: 'none', def: 'low'},
                rarity: E,
                gender: female,
                pfp: `assets/AnimeGirl52.jpeg`,
                hp: 300,
                mp: 300,
                str: 2,
                int: 120,
                mpRegen: 50,
                skills: [`roastChicken`, `summonChicken`, `summonChickenFlock`, `summonPheonix`],
                armour: {physical: [10, 10], magic: [5, 10]},
            },
            Misaki: { // dps
                name: `Misaki`,
                title: `Swordmaster`,
                description: `Misaki is a powerful swordmaster who wields a pair of deadly blades.`,
                personality: 'confident',
                stats: {atk: 'high', def: 'high'},
                rarity: E,
                gender: female,
                pfp: `assets/AnimeGirl58.jpeg`,
                hp: 375, 
                mp: 250,
                str: 1,
                int: 130,
                mpRegen: 90,
                skills: ['ascendedThrust', 'rapidStrikes', 'ascendedOverheadStrike', 'auraSlash', 'lesserSwordDance'],
                armour: {physical: [50, 75], magic: [15, 60]}, 
            },
        },
        { // L
            Kohana: { // dps / support
                name: `Kohana`,
                title: `Archmage`,
                description: `Kohana is a grand archmage who has seen countless battles over the centuries. She weilds high teir shadow magic.`,
                personality: 'confident',
                stats: {atk: 'high', def: 'low'},
                rarity: L,
                gender: female,
                pfp: `assets/AnimeGirl27.jpeg`,
                hp: 250,
                mp: 550,
                str: 1.2,
                int: 200,
                mpRegen: 120,
                skills: ['shadowLance', 'forceLance', 'darkBlast', 'arcaneBlast', 'gravityBind', 'mediumHeal'],
                armour: {physical: [15, 20], magic: [25, 75]},
            },
            Misato: { // healer
                name: `Misato`,
                title: `High Priestess`,
                description: `Misato is a high priestess of the Tajism church. She wields powerful divine and healing magic.`,
                personality: 'confident',
                stats: {atk: 'low', def: 'low'},
                rarity: L,
                gender: female,
                pfp: `assets/AnimeGirl5.jpeg`,
                hp: 300,
                mp: 450,
                str: 1,
                int: 80,
                mpRegen: 80,
                skills: ['greaterHeal', 'greaterAreaHeal', 'superiorHeal', 'healAura', 'righteousFury', 'righteousSmite'],
                armour: {physical: [15, 10], magic: [15, 25]},
            },
        },
        { // G
            Natsuki: { // glass cannon dps
                name: `Natsuki`,
                title: `Sword Goddess`,
                description: `Natsuki, the Sword Goddess, is an unparalleled master of swordsmanship. Her strikes are swift and devastating, but her frail body cannot withstand much damage.`,
                personality: 'calm',
                stats: {atk: 'extreme', def: 'none'},
                rarity: G,
                gender: female,
                pfp: `assets/AnimeGirl10.jpeg`,
                hp: 150,
                mp: 875,
                str: 4,
                int: 160,
                mpRegen: 225,
                skills: ['ascendedSlash', 'rapidStrikes', 'auraSlash', 'greaterRaiseGuard', 'swordDance', 'realitySlash', 'superCharge'],
                armour: {physical: [0, 25], magic: [0, 25]},
            },
            Yui: { // tank / support
                name: `Yui`,
                title: `War Goddess`,
                description: `Yui, the War Goddess, commands the battlefield with an iron fist. Her presence alone can turn the tide of battle, and her unparalleled strength and defense make her a formidable opponent.`,
                personality: 'arrogant',
                stats: {atk: 'high', def: 'high'},
                rarity: G,
                gender: female,
                pfp: `assets/AnimeGirl38.jpeg`,
                hp: 750,
                mp: 375,
                str: 1.75,
                int: 175,
                mpRegen: 75,
                skills: ['ascendedSlash', 'rapidStrikes', 'warCry', 'battlefieldCommand', 'righteousSmite'],
                armour: {physical: [200, 75], magic: [200, 50]},
            },
        },
        { // EX
            Eco: { // useless trash
                name: `Eco`,
                title: `Hero`,
                description: `Once a high school student with big dreams and no talent, Eco got isekaied into a fantasy world where he's supposed to defeat the terrorist lord. Unfortunately, he's clumsy, weak, and perpetually out of shape. Eco plans to assemble a harem of powerful girls to do the fighting for him while he desperately tries to unlock the mysterious power sealed in his right eye, which he believes is totally awesome but actually does nothing.`,
                personality: 'chunni',
                stats: {atk: 'low', def: 'none'},
                rarity: EX,
                gender: male,
                pfp: `assets/FatEdgyGuy.jpeg`,
                hp: 60,
                mp: 25,
                str: 0.5,
                int: -1,
                mpRegen: 5,
                skills: ['debugFist', 'punch', 'bodySlam', 'pervertedStare', 'brag'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Redacted: { // tank / dps
                name: `[Redacted]`,
                title: `Terrorist`,
                description: `Former high school student, [redacted] was isekaied into the other world as the demon lord. Despite being gender bent, she is still obsessed with terrorism and decided to become the terrorist lord, who rules over many mafias and cartels, the lord of the criminal underworld.`,
                personality: 'chunni',
                stats: {atk: 'extreme', def: 'extreme'},
                rarity: EX,
                gender: female,
                pfp: `assets/AnimeGirl51.jpeg`,
                hp: 975,
                mp: 1625,
                str: 2,
                int: 120,
                mpRegen: 200,
                skills: ['assaultRifle', 'fragGrenade', 'greaterRaiseGuard', 'swordDance', 'ultraHeavySlash', 'soulHarvest'],
                armour: {physical: [100, 80], magic: [250, 25]},
            },
            Borude: { // healer?
                name: `Borude`,
                title: `Surgeon`,
                description: `Borude became a master surgeon with her perfect scores in her med exams. She can masterfully complete the most difficult opperations with 102% success rate. Because Borude was simply too good, the godess transmigrated her to the other world where her healing would be more useful. Borude helps the team by transfering her own hp to teammates.`,
                personality: 'confident',
                stats: {atk: 'none', def: 'none'},
                rarity: EX,
                gender: female,
                pfp: `assets/AnimeGirl61.jpeg`,
                hp: 2500,
                mp: 400,
                str: 1,
                int: 6900,
                mpRegen: 0,
                skills: ['aggressiveSurgery', 'cyborgSurgery', 'bloodTransfusion', 'largeBloodTransfusion', 'heartTransplant', 'defibrillator'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            MQ69Reaper2: { // dps
                name: `MQ69Reaper2`,
                title: `==[JAT]==`,
                description: `==[JAT]== MQ69-Reaper MK2 is a second generation advanced autonomous combat vehicle designed by the Tajism church to spread freedom and democracy throughout the continent of Arcadia. Piloted by the sapient ai codenamed T.A.J (Territory Annihilation Junkie), the MQ69-Reaper 2 drone is a formidable foe on any battlefield, its gattling railguns and rocket pods able to tear through enemy formations with ease.`,
                personality: 'calm',
                stats: {atk: 'extreme', def: 'high'},
                rarity: EX,
                gender: female,
                pfp: `assets/MQ69-Reaper2.jpeg`,
                hp: 350,
                mp: 400,
                str: 2,
                int: 120,
                mpRegen: 400,
                skills: ['ionCannon', 'gattlingRailgun', 'heavyRailcannon', 'rocketStorm', 'airStrike'],
                armour: {physical: [150, 0], magic: [125, 0]},
                infiniteAp: true, // unique ability
            },
        },
    ],
    enemies: {
        goblin: { // 5 tiers
            name: `Goblin`,
            rarity: N,
            pfp: `assets/Goblin1.jpeg`,
            hp: [40, 45, 50, 60, 70],
            mp: [0, 0, 0, 0, 0],
            str: [0.9, 1, 1.25, 1.5, 2],
            int: [0, 0, 0, 0, 0],
            mpRegen: [0, 0, 0, 0, 0],
            skills: ['hit', 'rapidHit'],
            armour: {physical: [0, 0], magic: [0, 0]},
            ai: `rng`,
        },
        goblinArcher: { // 3 tiers
            name: `Goblin`,
            rarity: N,
            pfp: `assets/Goblin2.jpeg`,
            hp: [25, 30, 45],
            mp: [0, 0, 0],
            str: [1, 1.75, 2.5],
            int: [0, 0, 0],
            mpRegen: [0, 0, 0],
            skills: ['crossbow', 'crossbow', 'crossbowCrit'],
            armour: {physical: [2, 0], magic: [3, 0]},
            ai: `rng`,
        },
        goblinWarrior: { // 3 tiers
            name: `Goblin`,
            rarity: N,
            pfp: `assets/Goblin3.jpeg`,
            hp: [75, 100, 140],
            mp: [0, 0, 0],
            str: [1.5, 1.75, 2],
            int: [0, 0, 0],
            mpRegen: [0, 0, 0],
            skills: ['smash', 'hit', 'heavySlash'],
            armour: {physical: [5, 0], magic: [3, 0]},
            ai: `rng`,
        },
        goblinGuard: { // 2 tiers
            name: `Goblin`,
            rarity: N,
            pfp: `assets/Goblin4.jpeg`,
            hp: [150, 225],
            mp: [0, 0],
            str: [2, 2.5],
            int: [0, 0],
            mpRegen: [0, 0],
            skills: ['crushingBlow', 'heavySlash', 'roar'],
            armour: {physical: [10, 25], magic: [5, 10]},
            ai: `rng`,
        },
        goblinLord: {
            name: `Goblin Lord`,
            rarity: N,
            pfp: `assets/Goblin5.jpeg`,
            hp: [750],
            mp: [0],
            str: [3],
            int: [0],
            mpRegen: [0],
            skills: ['crushingBlow', 'heavySlash', 'rallyingRoar'],
            armour: {physical: [10, 25], magic: [5, 10]},
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
    skills: {},
    effects: {},
    skillsOld: {
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
            dmg: 15,
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
            dmg: 25,
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
            attackType: `physical`,
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
            targeting: selfOnly,
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
            targeting: selfOnly,
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
            targeting: selfOnly,
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
            targeting: selfOnly,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [15, 10], duration: 1}],
            cost: {hp: 0, mp: 25},
            accuracy: Infinity,
            attacks: 1,
        },
        superchargeArmour: {
            name: `Strengthen Armour`,
            desc: `[attacker] channeling mana into [pronoun] armour to reist more damage for 5 rounds.`,
            attackType: `buffDefence`,
            type: normal,
            targeting: selfOnly,
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
            targeting: selfOnly,
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
            targeting: selfOnly,
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
            dmg: 35,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 425},
            accuracy: 150,
            attacks: 45,
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
            targeting: summon,
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
            targeting: summon,
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
            targeting: summon,
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
            targeting: summon,
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
            targeting: summon,
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
    enemySkillsOld: {
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
                            lvl: 4,
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
                            lvl: 4,
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
                            location: `frontline`,
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
                            location: `frontline`,
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
                            lvl: 4,
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

/* A guide to my animation system
animation: { 
    range: '', // whether attacking card moves to defending card to attack
    projectile: '', // image that moves from attacker to defender
    hitEffect: '', // image to is rendered on defender upon hitting
    moveSpeed: 0, // how many frames the attacker takes to move between targets (melee range only) (for skills that hit multiple times)
    projectileSpeed: 30, // how many frames taken for projectile to hit target (only relavent if there is a projectile)
    projectileFade: false, // whether the projectile fades over time (only relavent if there is a projectile)
    smooth: false, // does the attacker wait for the previous attack to land before firing another (for skills that hit multiple times)
    projectileDelay: 0, // how many ms to wait between attacks (only applies for smooth=true)
},
*/

// assorted skills and abilities
const debuffEffects = { // effects (debuffs)
    lesserBleed: {
        desc: `a minor bleed effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 2 rounds`,
            },
            {
                icon: `redDrop.png`,
                desc: `5 physical damage / round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 5, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 2,
    },
    burning: {
        desc: `a burning effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `redDrop.png`,
                desc: `10 fire damage / round`,
            },
        ],
        // inflict damage per round
        type: normal, // close enough (fire damage does not exist)
        dmg: 10, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 3,
    },
    veryBurning: {
        desc: `a burning effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `redDrop.png`,
                desc: `15 fire damage / round`,
            },
        ],
        // inflict damage per round
        type: piercing, // very stronk fire
        dmg: 15, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 3,
    },
    lesserWeaken: {
        desc: `a minor weakening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 2 rounds`,
            },
            {
                icon: `brokenRedSword.png`,
                desc: `- 10% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: -0.1, int: 0, reg: 0},
        duration: 2,
    },
    mediumWeaken: {
        desc: `a medium weakening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `brokenRedSword.png`,
                desc: `- 25% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: -0.25, int: 0, reg: 0},
        duration: 3,
    },
    greaterWeaken: {
        desc: `a medium weakening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `brokenRedSword.png`,
                desc: `- 50% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: -0.5, int: 0, reg: 0},
        duration: 3,
    },
    superiorWeaken: {
        desc: `a significant weakening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 1 rounds`,
            },
            {
                icon: `brokenRedSword.png`,
                desc: `- 100% physical strength`,
            },
            {
                icon: `brokenRedSword.png`,
                desc: `- 100% magic damage`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: -1, int: -100, reg: 0},
        duration: 1,
    },
    analised: {
        desc: `a significant weakening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 2 rounds`,
            },
            {
                icon: `brokenShield.png`,
                desc: `removes physical negation`,
            },
            {
                icon: `brokenShield.png`,
                desc: `removes magical negation`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [-99999, 0], magic: [-99999, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 2,
    },
};
const buffEffects = { // effects (buffs)
    immortality: {
        desc: `resistance to all damage`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 1 round`,
            },
            {
                icon: `shield.png`,
                desc: `immunity to all damage`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 100], magic: [0, 100]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 1,
    },
    barrier: {
        desc: `not currently supported (tempoarily replaced with immortality)`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 1 round`,
            },
            {
                icon: `shield.png`,
                desc: `immunity to all damage`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 100], magic: [0, 100]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 1,
    },
    lesserStrengthEnhancement: {
        desc: `a minor strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 5 rounds`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 25% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0.25, int: 0, reg: 0},
        duration: 5,
    },
    mediumStrengthEnhancement: {
        desc: `a minor strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 50% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0.3, int: 0, reg: 0},
        duration: 3,
    },
    greaterStrengthEnhancement: {
        desc: `a greater strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 100% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 1, int: 0, reg: 0},
        duration: 3,
    },
    lesserPhysicalEnhancement: {
        desc: `a medium strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 5 rounds`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 25% physical strength`,
            },
            {
                icon: `shield.png`,
                desc: `+ 10% physical resistance`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 10% magical resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 10], magic: [0, 10]},
        statChange: {str: 0.25, int: 0, reg: 0},
        duration: 5,
    },
    mediumPhysicalEnhancement: {
        desc: `a medium strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 50% physical strength`,
            },
            {
                icon: `shield.png`,
                desc: `+ 20% physical resistance`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 20% magical resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 20], magic: [0, 20]},
        statChange: {str: 0.5, int: 0, reg: 0},
        duration: 3,
    },
    lesserMagicEnhancement: {
        desc: `a minor magic strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `blueStar.png`,
                desc: `+ 10 intelligence`,
            },
            {
                icon: `blueStar.png`,
                desc: `+ 25 mana regen per round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 10], magic: [0, 10]},
        statChange: {str: 0, int: 25, reg: 25},
        duration: 3,
    },
    mediumMagicEnhancement: {
        desc: `a medium magic strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `blueStar.png`,
                desc: `+ 25 intelligence`,
            },
            {
                icon: `blueStar.png`,
                desc: `+ 50 mana regen per round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 10], magic: [0, 10]},
        statChange: {str: 0, int: 25, reg: 25},
        duration: 3,
    },
    greaterBodyEnhancement: {
        desc: `a greater strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 200% physical strength`,
            },
            {
                icon: `blueStar.png`,
                desc: `+ 50 mp regen / round`,
            },
            {
                icon: `shield.png`,
                desc: `+ 25% physical resistance`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 25% magical resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 25], magic: [0, 25]},
        statChange: {str: 2, int: 0, reg: 50},
        duration: 3,
    },
    lesserArmourReinforcement: {
        desc: `a minor reinforcing effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `shield.png`,
                desc: `+ 5 physical negation`,
            },
            {
                icon: `shield.png`,
                desc: `+ 10% physical resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buggs / debuffs
        defChange: {physical: [5, 10], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 3,
    },
    lesserResistDamage: {
        desc: `a minor resisting effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 1 rounds`,
            },
            {
                icon: `shield.png`,
                desc: `+ 10 physical negation`,
            },
            {
                icon: `shield.png`,
                desc: `+ 15% physical resistance`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 10 magic negation`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 15% magic resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [10, 15], magic: [10, 15]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 1,
    },
    mediumResistDamage: {
        desc: `a medium resisting effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 1 rounds`,
            },
            {
                icon: `shield.png`,
                desc: `+ 25 physical negation`,
            },
            {
                icon: `shield.png`,
                desc: `+ 25% physical resistance`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 25 magic negation`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 25% magic resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [25, 25], magic: [25, 25]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 1,
    },
    lesserHealOverTime: {
        desc: `a medium healing effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `greenCross.png`,
                desc: `5 heal / round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 5, mp: 0}, 
        // buggs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 3,
    },
    mediumHealOverTime: {
        desc: `a medium healing effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `greenCross.png`,
                desc: `15 heal / round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 15, mp: 0}, 
        // buggs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 3,
    },
    greaterHealOverTime: {
        desc: `a significant healing effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 5 rounds`,
            },
            {
                icon: `greenCross.png`,
                desc: `45 heal / round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 45, mp: 0}, 
        // buggs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 5,
    },
    raiseGuard: {
        desc: `a minor reinforcing effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 2 rounds`,
            },
            {
                icon: `shield.png`,
                desc: `+ 10 physical negation`,
            },
            {
                icon: `shield.png`,
                desc: `+ 25% physical resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buggs / debuffs
        defChange: {physical: [10, 25], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 2,
    },
    greaterRaiseGuard: {
        desc: `a significant reinforcing effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 2 rounds`,
            },
            {
                icon: `shield.png`,
                desc: `+ 99% physical resistance`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 99% magic resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buggs / debuffs
        defChange: {physical: [0, 99], magic: [0, 99]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 2,
    },
    lesserManaRegen: {
        desc: `a minor mana restoring effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `greenCross.png`,
                desc: `25 mana / round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 25}, 
        // buggs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 3,
    },
    mediumManaRegen: {
        desc: `a medium mana restoring effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `greenCross.png`,
                desc: `60 mana / round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 60}, 
        // buggs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 3,
    },
    greaterManaRegen: {
        desc: `a minor mana restoring effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 2 rounds`,
            },
            {
                icon: `greenCross.png`,
                desc: `200 mana / round`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 200}, 
        // buggs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 2,
    },
    high: {
        desc: `high on drugs`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 75% physical strength`,
            },
            {
                icon: `blueStar.png`,
                desc: `+ 25 mp regen / round`,
            },
            {
                icon: `shield.png`,
                desc: `+ 50% physical resistance`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 50% magical resistance`,
            },
            {
                icon: `redDrop.png`,
                desc: `- 15 health / round (drugs are bad, kids)`,
            },
        ],
        // inflict damage per round
        type: piercing, 
        dmg: 15, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 50], magic: [0, 50]},
        statChange: {str: 0.75, int: 0, reg: 25},
        duration: 3,
    },
    veryHigh: {
        desc: `very high on drugs`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 100% physical strength`,
            },
            {
                icon: `blueStar.png`,
                desc: `+ 40 mp regen / round`,
            },
            {
                icon: `shield.png`,
                desc: `+ 90% physical resistance`,
            },
            {
                icon: `blueShield.png`,
                desc: `+ 75% magical resistance`,
            },
            {
                icon: `redDrop.png`,
                desc: `- 40 health / round (drugs are bad, kids)`,
            },
        ],
        // inflict damage per round
        type: piercing, 
        dmg: 40, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 90], magic: [0, 75]},
        statChange: {str: 1, int: 0, reg: 40},
        duration: 3,
    },
    cyborg: {
        desc: `become a literal cyborg`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 10 rounds`,
            },
            {
                icon: `blueStar.png`,
                desc: `+ 50 mana / round`,
            },
            {
                icon: `redSword.png`,
                desc: `+ 50% physical strength`,
            },
            {
                icon: `shield.png`,
                desc: `+ 10 physical damage negation`,
            },
            {
                icon: `shield.png`,
                desc: `+ 50% physical damage resistance`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // change stats per round
        change: {hp: 0, mp: 50}, 
        // buffs / debuffs
        defChange: {physical: [10, 50], magic: [0, 0]},
        statChange: {str: 0.5, int: 0, reg: 0},
        duration: 10,
    },
};
const basicPhysicalAttacks = { // body and blunt attacks
    punch: {
        name: `Punch`, 
        desc: `[attacker] punches the targeted enemy several times.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
            moveSpeed: 50,
            projectileSpeed: 0,
            smooth: false,
        },
        type: physical, 
        targeting: single, 
        dmg: 7, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 90, 
        attacks: 3, 
    },
    stunningBlows: {
        name: `Stunning Blows`, 
        desc: `[attacker] punches the targeted enemy several times, potentially weakening them with each blow.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
        },
        type: 'physical', 
        targeting: single,
        dmg: 7, 
        multiplier: 'str', 
        effects: [{effect: 'lesserWeaken', chance: 60}], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100,
        attacks: 4, 
    },
    heavyBlows: {
        name: `Heavy Punch`, 
        desc: `[attacker] repeatedly punches the targeted enemy very hard.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
            moveSpeed: 50,
            projectileSpeed: 0,
            smooth: false,
        },
        type: physical, 
        targeting: single, 
        dmg: 15, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 90, 
        attacks: 3, 
    },
    kick: {
        name: `Kick`, 
        desc: `[attacker] kicks the targeted enemy.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
        },
        type: physical, 
        targeting: single,
        dmg: 16, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 80,
        attacks: 1, 
    },
    slap: {
        name: `Slap`, 
        desc: `[attacker] slaps the targeted enemy.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
        },
        type: physical, 
        targeting: single,
        dmg: 10, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100,
        attacks: 1, 
    },
    bodySlam: {
        name: `Body Slam`, 
        desc: `[attacker] slams [pronoun] body into the targeted enemy, dealing high damage but costing health.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
        },
        type: 'physical', 
        targeting: single,
        dmg: 25, 
        multiplier: 'str', 
        effects: [], 
        cost: {hp: 10, mp: 0}, 
        accuracy: 70,
        attacks: 1, 
    },
    shieldBash: {
        name: `Shield Bash`, 
        desc: `[attacker] slams [pronoun] shield into the targeted enemy, potentially weakening them.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
        },
        type: 'physical', 
        targeting: single,
        dmg: 20, 
        multiplier: 'str', 
        effects: [{effect: 'lesserWeaken', chance: 50}], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100,
        attacks: 1, 
    },
};
const basicSwordAttacks = { // sword attacks
    slash: {
        name: `Slash`, 
        desc: `[attacker] slashes the targeted enemy with a sword.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical, 
        targeting: single,
        dmg: 25, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100,
        attacks: 1, 
    },
    thrust: {
        name: `Thrust`,
        desc: `[attacker] thrusts at the targeted enemy.`,
        animation: { 
            range: 'melee',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 30,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: single,
        dmg: 30,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 90,
        attacks: 1,
    },
    swordCharge: {
        name: `Sword Charge`, 
        desc: `[attacker] charges at the enemy with a powerful sword strike.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 30,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical, 
        targeting: single,
        dmg: 45, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 10}, 
        accuracy: 95,
        attacks: 1, 
    },
    overheadStrike: {
        name: `Overhead Strike`,
        desc: `[attacker] leaps into the air and strikes at the targeted enemy from above.`,
        animation: { 
            range: 'melee',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: single,
        dmg: 60,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 20},
        accuracy: 90,
        attacks: 1,
    },
    wildSwing: {
        name: `Wild Swings`,
        desc: `[attacker] wildly swings [pronoun] sword at the targeted enemy.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: true,
            projectileDelay: 30,
        },
        type: physical,
        targeting: single,
        dmg: 24,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 5},
        accuracy: 60,
        attacks: 2,
    },
    wildCharge: {
        name: `Wild Charge`,
        desc: `[attacker] charges the targeted enemy while flailing [pronoun] sword wildly, inflicting significant damage to all parties involved.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 30,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: true,
            projectileDelay: 25,
        },
        type: physical,
        targeting: multi,
        dmg: 16,
        multiplier: str,
        effects: [],
        cost: {hp: 30, mp: 20},
        accuracy: 75,
        attacks: 6,
    },
    sparkleSlash: {
        name: `Sparkle Slash`,
        desc: `[attacker]'s special attack that [pronoun] spent years developing. It is rather flashy and powerful...`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 40,
            projectileFade: true,
            smooth: true,
            projectileDelay: 25,
        },
        type: normal,
        targeting: single,
        dmg: 65,
        multiplier: str,
        effects: [],
        cost: {hp: 65, mp: 100},
        accuracy: 100,
        attacks: 3,
    },
};
const basicRangedAttacks = { // ranged attacks
    snipe: {
        name: `Snipe`, 
        desc: `[attacker] accurately fires an arrow at the targeted enemy.`, 
        animation: { 
            range: 'ranged',
            projectile: 'arrow',
            hitEffect: 'arrowInGround',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical, 
        targeting: single,
        dmg: 35, 
        multiplier: none, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 95,
        attacks: 1, 
    },
    rapidFire: {
        name: `Rapid Fire`, 
        desc: `[attacker] rapidly fires a barrage of arrows at the enemies.`, 
        animation: { 
            range: 'ranged',
            projectile: 'arrow',
            hitEffect: 'arrowInGround',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: true,
            projectileDelay: 100,
        },
        type: physical, 
        targeting: multi,
        dmg: 20, 
        multiplier: none, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 75,
        attacks: 5, 
    },
    trippleShot: {
        name: `Tripple Shot`, 
        desc: `[attacker] fires 3 arrows at once towards the targeted enemy.`, 
        animation: { 
            range: 'ranged',
            projectile: 'arrow',
            hitEffect: 'arrowInGround',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: true,
            projectileDelay: 0,
        },
        type: physical, 
        targeting: single,
        dmg: 25, 
        multiplier: none, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 80,
        attacks: 3, 
    },
    knifeThrow: {
        name: `Knife Throw`, 
        desc: `[attacker] accurately throws a dagger at the targeted enemy.`, 
        animation: { 
            range: 'ranged',
            projectile: 'dagger',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical, 
        targeting: single,
        dmg: 35, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100,
        attacks: 1, 
    },
    manyKnifeThrow: {
        name: `Knife Throw`, 
        desc: `[attacker] throws a handful of daggers at the enemies.`, 
        animation: { 
            range: 'ranged',
            projectile: 'dagger',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: true,
            projectileDelay: 0,
        },
        type: physical, 
        targeting: single,
        dmg: 10, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 10}, 
        accuracy: 70,
        attacks: 7, 
    },
    crossbow: {
        name: `Crossbow`, 
        desc: `[attacker] accurately fires an arrow at the targeted enemy.`, 
        animation: { 
            range: 'ranged',
            projectile: 'arrow',
            hitEffect: 'arrowInGround',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: single, 
        dmg: 30,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 90,
        attacks: 1,
    },
    crossbowCrit: {
        name: `Crossbow (Crit)`, 
        desc: `[attacker] accurately fires an arrow at the targeted enemy.`, 
        animation: { 
            range: 'ranged',
            projectile: 'arrow',
            hitEffect: 'arrowInGround',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: single, 
        dmg: 45,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 100,
        attacks: 1,
    },
};
const basicVerbalAttacks = { // insults and talking
    brag: {
        name: `Brag`,
        desc: `[attacker] brags about [pronoun] accomplishments, irritating the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'musicNotes',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 150,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: piercing,
        targeting: single,
        dmg: 10,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 5},
        accuracy: Infinity,
        attacks: 1,
    },
};
const intermediatePhysicalAttacks = { // cool martial arts
    flyingKick: {
        name: `Flying Kick`, 
        desc: `[attacker] launches into the air with a powerful leap, delivering a swift and forceful kick to the target.`, 
        animation: { 
            range: 'melee', 
            projectile: 'none', 
            hitEffect: 'physicalHit', 
        },
        type: physical, 
        targeting: single,
        dmg: 32, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 95,
        attacks: 1, 
    },
};
const intermediateSwordAttacks = { // sword attacks but better
    improvedSlash: {
        name: `Slash`, 
        desc: `[attacker] executes a precice series of slashes on the targeted enemy.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical, 
        targeting: single,
        dmg: 22, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100,
        attacks: 3, 
    },
    heavySlash: {
        name: `Heavy Slash`, 
        desc: `[attacker] smashes [pronoun] sword down on the targeted enemy.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 50,
            projectileSpeed: 60,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: single, 
        dmg: 55,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 95,
        attacks: 1,
    },
    bladesOfFury: {
        name: `BladesOfFury`,
        desc: `[attacker] unleashes a flurry of seven swift sword strikes, capable of hitting multiple enemies in a whirlwind of steel.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 15,
            projectileSpeed: 60,
            projectileFade: true,
            smooth: true,
            projectileDelay: 0,
        },
        type: normal,
        targeting: multi,
        dmg: 25,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 75},
        accuracy: 100,
        attacks: 7,
    },
    savageTornado: {
        name: `Savage Tornado`,
        desc: `[attacker] spins wildly, slashing at nearby enemies.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 10,
            projectileSpeed: 60,
            projectileFade: true,
            smooth: true,
            projectileDelay: 0,
        },
        type: normal,
        targeting: multi,
        dmg: 8,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 50},
        accuracy: 100,
        attacks: 15,
    },
    inferiorSwordDance: {
        name: `Sword Dance`,
        desc: `[attacker] dances through enemies, rapidly striking at them. The technique is crude and unrefined, but gets the job done.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 10,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: true,
            projectileDelay: 0,
        },
        type: normal,
        targeting: multi,
        dmg: 12,
        multiplier: str,
        effects: [],
        cost: {hp: 10, mp: 50},
        accuracy: 95,
        attacks: 17,
    },
};
const advancedSwordAttacks = { // best sword attacks 
    ascendedThrust: {
        name: `Thrust`,
        desc: `[attacker] unleashes a powerful thrust at the targeted enemy.`,
        animation: { 
            range: 'melee',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 30,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: single,
        dmg: 250,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 100,
        attacks: 1,
    },
    ascendedSlash: {
        name: `Slash`,
        desc: `[attacker] unleashes a powerful slash imbued with divine energy that pierces through armour.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: piercing,
        targeting: single,
        dmg: 90,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 100,
        attacks: 1,
    },
    ascendedOverheadStrike: {
        name: `Overhead Strike`,
        desc: `[attacker] gathers a massive amount of aura on [pronoun] sword and strikes at the targeted enemy from above.`,
        animation: { 
            range: 'melee',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: normal,
        targeting: single,
        dmg: 500,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 125},
        accuracy: 90,
        attacks: 1,
    },
    ultraHeavySlash: {
        name: `Overhead Strike`, 
        desc: `[attacker] leaps into the air and strikes down on the targeted enemy with tremendous force.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 50,
            projectileSpeed: 50,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: single, 
        dmg: 600,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 300},
        accuracy: 100,
        attacks: 1,
    },
    auraSlash: {
        name: `Aura Slash`,
        desc: `[attacker] releases a wave of energy from [pronoun] sword that cuts through all enemies.`,
        animation: { 
            range: 'ranged',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 120,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: normal,
        targeting: aoe,
        dmg: 75,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 100},
        accuracy: 100,
        attacks: 1,
    },
    rapidStrikes: {
        name: `Rapid Strikes`,
        desc: `[attacker] performs a series of rapid slashes and stabs on the targeted enemy.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: true,
            projectileDelay: 10,
        },
        type: physical,
        targeting: single,
        dmg: 50,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 100,
        attacks: 7,
    },
    lesserSwordDance: {
        name: `Sword Dance`,
        desc: `[attacker] dances through enemies, rapidly striking at them. This technique has yet to be mastered.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 5,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: true,
            projectileDelay: 0,
        },
        type: normal,
        targeting: multi,
        dmg: 24,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 175},
        accuracy: 100,
        attacks: 30,
    },
    swordDance: {
        name: `Sword Dance`,
        desc: `[attacker] dances through enemies with perfect technique, rapidly striking at them while leaving no room for counterattack.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 2,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: true,
            projectileDelay: 0,
        },
        type: normal,
        targeting: multi,
        dmg: 37,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 375},
        accuracy: 100,
        attacks: 45,
    },
    realitySlash: {
        name: `Reality Slash`,
        desc: `[attacker] charges [pronoun] sword with a vast amount of energy, releasing a slash that cuts through reality itself.`,
        animation: { 
            range: 'melee',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: piercing,
        targeting: single,
        dmg: 1250,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 800},
        accuracy: Infinity,
        attacks: 1,
    },
};
const healingSkills = { // heals
    lesserHeal: { // A healing skill is an attack that does negative damage
        name: `Lesser Healing`,
        desc: `[attacker] heals the targeted ally.`,
        animation: { 
            range: 'ranged',
            projectile: 'healingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 60,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -20,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 40},
        accuracy: Infinity,
        attacks: 1,
    },
    lesserAreaHeal: {
        name: `Lesser Area Healing`,
        desc: `[attacker] heals all allies.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'areaHealingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: aoe,
        dmg: -10,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 80},
        accuracy: Infinity,
        attacks: 1,
    },
    mediumHeal: {
        name: `Medium Healing`,
        desc: `[attacker] heals the targeted ally.`,
        animation: { 
            range: 'ranged',
            projectile: 'healingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 60,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -50,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 75},
        accuracy: Infinity,
        attacks: 1,
    },
    mediumAreaHeal: {
        name: `Medium Area Healing`,
        desc: `[attacker] heals all allies moderately.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'areaHealingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: aoe,
        dmg: -25,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 150},
        accuracy: Infinity,
        attacks: 1,
    },
    greaterHeal: {
        name: `Greater Healing`,
        desc: `[attacker] heals the targeted ally and leaves a lingering heal over time effect.`,
        animation: { 
            range: 'ranged',
            projectile: 'healingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 60,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -125,
        multiplier: none,
        effects: [{effect: 'mediumHealOverTime', chance: 100}],
        cost: {hp: 0, mp: 150},
        accuracy: Infinity,
        attacks: 1,
    },
    greaterAreaHeal: {
        name: `Greater Area Healing`,
        desc: `[attacker] heals all allies greatly.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'areaHealingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: aoe,
        dmg: -75,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 250},
        accuracy: Infinity,
        attacks: 1,
    },
    superiorHeal: {
        name: `Superior Healing`,
        desc: `[attacker] heals the targeted ally and leaves a lingering heal over time effect.`,
        animation: { 
            range: 'ranged',
            projectile: 'healingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 60,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -300,
        multiplier: none,
        effects: [{effect: 'mediumHealOverTime', chance: 100}],
        cost: {hp: 0, mp: 300},
        accuracy: Infinity,
        attacks: 1,
    },
    superiorAreaHeal: {
        name: `Superior Area Healing`,
        desc: `[attacker] heals all allies greatly.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'areaHealingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: aoe,
        dmg: -200,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 450},
        accuracy: Infinity,
        attacks: 1,
    },
    roastChicken: {
        name: `Chimkin`,
        desc: `[attacker] feeds the targeted ally a roast chicken.`,
        animation: { 
            range: 'ranged',
            projectile: 'chimkin',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 120,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -15,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
    firstAid: {
        name: `First Aid`,
        desc: `[attacker] does some basic first Aid to recover some health.`,
        animation: { 
            range: 'ranged',
            projectile: 'healingLight',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -15,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
    healAura: {
        name: `Healing Aura`,
        desc: `[attacker] releases a healing aura, regenerating the health and mana of all allies.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'none',
            hitEffect: 'hpUp',
        },
        targeting: aoe,
        dmg: -50,
        multiplier: none,
        effects: [{effect: 'greaterHealOverTime', chance: 100}, {effect: 'lesserManaRegen', chance: 100}], 
        cost: {hp: 0, mp: 400},
        accuracy: none,
        attacks: 1,
    },
    bloodTransfusion: {
        name: `Blood Transfusion`,
        desc: `[attacker] transfers [pronoun] blood to the targeted ally.`,
        animation: { 
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -50,
        multiplier: none,
        effects: [],
        cost: {hp: 50, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
    largeBloodTransfusion: {
        name: `Blood Transfusion`,
        desc: `[attacker] transfers [pronoun] blood to the targeted ally.`,
        animation: { 
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -250,
        multiplier: none,
        effects: [],
        cost: {hp: 250, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
    heartTransplant: {
        name: `Heart Transplant`,
        desc: `[attacker] transfers [pronoun] heart to the targeted ally. IDK how somebody can have multiple hearts...`,
        animation: {
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -1000,
        multiplier: none,
        effects: [],
        cost: {hp: 1000, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
};
const selfBuffs = { // self enhancement
    lesserStrengthEnhancement: {
        name: `Lesser Strength Enhancement`, 
        desc: `[attacker] enhances their physical abilities temporarily.`, 
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'attackUp',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'lesserStrengthEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 15}, 
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
    lesserPhysicalEnhancement: {
        name: `Lesser Physical Enhancement`, 
        desc: `[attacker] enhances their physical abilities temporarily.`, 
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'statUp',
        },
        type: heal, 
        targeting: selfOnly,
        dmg: -40,
        multiplier: none,
        effects: [{effect: 'lesserPhysicalEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 25}, 
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
    raiseGuard: {
        name: `Raise Guard`,
        desc: `[attacker] raises [pronoun] guard, reducing damage from physical attacks.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'defUp',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'raiseGuard', chance: 100}],
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
    greaterRaiseGuard: {
        name: `Raise Guard`,
        desc: `[attacker] raises [pronoun] guard, significantly reducing damage from all attacks in the next round.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'defUp',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'greaterRaiseGuard', chance: 100}],
        cost: {hp: 0, mp: 0},
        accuracy: none,
        attacks: 1,
        instantUse: true,
    },
    cower: {
        name: `Cower in Fear`,
        desc: `[attacker] cowers in fear, channeling mana into [pronoun] armour to reist more damage.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'defUp',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'lesserArmourReinforcement', chance: 100}],
        cost: {hp: 0, mp: 25},
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
    superCharge: {
        name: `Super Charge`,
        desc: `[attacker] super charges [pronoun] body with aura, greatly increasing all stats.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'statUp',
        },
        type: heal, 
        targeting: selfOnly,
        dmg: -25,
        multiplier: int,
        effects: [{effect: 'greaterBodyEnhancement', chance: 100}],
        cost: {hp: 0, mp: 400},
        accuracy: none,
        attacks: 1,
        instantUse: true,
    },
    reinforceArmour: {
        name: `Reinforce Armour`,
        desc: `[attacker] reinforces [pronoun] armour with mana, reducing damage from all attacks in the next round.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'defUp',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'lesserResistDamage', chance: 100}],
        cost: {hp: 0, mp: 20},
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
    reinforceShield: {
        name: `Reinforce Shield`,
        desc: `[attacker] reinforces [pronoun] shield with mana, greatly reducing damage from all attacks in the next round.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'defUp',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'mediumResistDamage', chance: 100}],
        cost: {hp: 0, mp: 30},
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
};
const buffSkills = { // makes target stronk
    warCry: {
        name: `War Cry`,
        desc: `[attacker] lets out a powerful war cry, boosting the attack of all allies.`,
        animation: { 
            range: 'allUnits',
            projectile: 'none',
            hitEffect: 'attackUp',
        },
        type: none, 
        targeting: aoe,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'greaterStrengthEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 150},
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
    battlefieldCommand: {
        name: `Battlefield Command`,
        desc: `[attacker] commands the battlefield, boosting the attack and defense of all allies.`,
        animation: { 
            range: 'allUnits',
            projectile: 'none',
            hitEffect: 'statUp',
        },
        type: none, 
        targeting: aoe,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'mediumPhysicalEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 125},
        accuracy: none,
        attacks: 1,
        instantUse: true,
    },
    shadowVeil: {
        name: `Shadow Veil`,
        desc: `[attacker] surrounds the targeted ally in a barrier, protecting them from attacks.`,
        animation: { 
            range: 'ranged',
            projectile: 'shadowball',
            hitEffect: 'defUp',
            moveSpeed: 0,
            projectileSpeed: 60,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: magic,
        targeting: single,
        dmg: 0,
        multiplier: int,
        effects: [{effect: 'barrier', chance: 100}],
        cost: {hp: 0, mp: 300},
        accuracy: Infinity,
        attacks: 1,
    },  
    mediumMeth: {
        name: `Mid Grade Methamphetamine`,
        desc: `[attacker] synthesises some meth of medium purity which makes the targeted entity high.`,
        animation: { 
            range: 'ranged',
            projectile: 'bagOfWhitePowder',
            hitEffect: 'statUp',
            moveSpeed: 0,
            projectileSpeed: 120,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: none, 
        targeting: single,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'high', chance: 100}], 
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
    greaterMeth: {
        name: `High Grade Methamphetamine`,
        desc: `[attacker] synthesises some meth of high purity which makes the targeted entity very high.`,
        animation: { 
            range: 'ranged',
            projectile: 'bagOfWhitePowder',
            hitEffect: 'statUp',
            moveSpeed: 0,
            projectileSpeed: 120,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: none, 
        targeting: single,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'veryHigh', chance: 100}], 
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
    righteousFury: {
        name: `Righteous Fury`, 
        desc: `[attacker] enhances the physical abilities of the targeted ally with divine energy.`, 
        animation: { 
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'attackUp',
        },
        type: none, 
        targeting: single,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'mediumStrengthEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 100}, 
        accuracy: Infinity,
        attacks: 1,
    },
    cyborgSurgery: {
        name: `Cybernetics Implant Surgery`,
        desc: `[attacker] performs surgery on the targeted ally to cybernetically enhance their body.`,
        animation: { 
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'statUp',
            moveSpeed: 0,
            projectileSpeed: 120,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal, 
        targeting: single,
        dmg: -50,
        multiplier: none,
        effects: [{effect: 'cyborg', chance: 100}], 
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
    divineProtection: {
        name: `Divine Protection`, 
        desc: `[attacker] invokes the divine protection of the Tajism deities to protect the targeted ally (or self).`, 
        animation: { 
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'defUp',
        },
        type: heal, 
        targeting: single,
        dmg: -50,
        multiplier: none,
        effects: [{effect: 'mediumResistDamage', chance: 100}], 
        cost: {hp: 0, mp: 50}, 
        accuracy: Infinity,
        attacks: 1,
    },
};
const debuffSkills = { // makes target weak
    analysis: {
        name: `Analysis`,
        desc: `[attacker] locates the targeted enemy's weakness, removing their damage negation.`,
        animation: { 
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'defDown',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: effect, 
        targeting: single,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'analised', chance: 100}],
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
    gravityBind: {
        name: `Gravity Bind`,
        desc: `[attacker] manipulates the gravitational field around the targeted enemy to weaken them.`,
        animation: { 
            range: 'ranged',
            projectile: 'blackHole',
            hitEffect: 'attackDown',
            moveSpeed: 0,
            projectileSpeed: 120,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: effect, 
        targeting: single,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'mediumWeaken', chance: 100}],
        cost: {hp: 0, mp: 125},
        accuracy: Infinity,
        attacks: 1,
    },
    dimensionRedution: {
        name: `Dimension Reduction`,
        desc: `[attacker] distorts the space around the targeted enemy, reducing their combat ability.`,
        animation: { 
            range: 'ranged',
            projectile: 'blackHole',
            hitEffect: 'blackHole',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: effect, 
        targeting: single, 
        dmg: 0, 
        multiplier: none, 
        effects: [{effect: 'superiorWeaken', chance: 100}], 
        cost: {hp: 0, mp: 350}, 
        accuracy: Infinity, 
        attacks: 1, 
    },
};
const magicAttacks = { // spells
    fireball: {
        name: `Fireball`,
        desc: `[attacker] launches a fireball at the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'fireball',
            hitEffect: 'smallExplosion',
            moveSpeed: 0,
            projectileSpeed: 75,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: magic,
        targeting: single,
        dmg: 25,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 20},
        accuracy: 100,
        attacks: 1,
    },
    fireLance: {
        name: `Fire Lance`,
        desc: `[attacker] fires a lance of fire at the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'fireArrow',
            hitEffect: 'smallExplosion',
            moveSpeed: 0,
            projectileSpeed: 60,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
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
        animation: { 
            range: 'ranged',
            projectile: 'fireArrow',
            hitEffect: 'smallExplosion',
            moveSpeed: 0,
            projectileSpeed: 75,
            projectileFade: false,
            smooth: true,
            projectileDelay: 150,
        },
        type: magic,
        targeting: multi,
        dmg: 10,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 50},
        accuracy: 75,
        attacks: 5,
    },
    firestorm: {
        name: `Firestorm`,
        desc: `[attacker] unleashes a storm of fire dealing splash damage to all enemies.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'fireStorm',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: magic,
        targeting: aoe,
        dmg: 3,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 100},
        accuracy: Infinity,
        attacks: 5,
    },
    forceLance: {
        name: `Force Lance`,
        desc: `[attacker] launches a compressed lance of magic at the targeted enemy, inflicting physical damage.`,
        animation: { 
            range: 'ranged',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: single,
        dmg: 200,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 100},
        accuracy: 100,
        attacks: 1,
    },
    shadowLance: {
        name: `Shadow Lance`,
        desc: `[attacker] launches a shadow lance constructed from mana at the targeted enemy. It can penetrate through barriers and armour.`,
        animation: { 
            range: 'ranged',
            projectile: 'darkArrow',
            hitEffect: 'blackHole',
            moveSpeed: 0,
            projectileSpeed: 60,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: piercing,
        targeting: single,
        dmg: 60,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 50},
        accuracy: 100,
        attacks: 1,
    },
    arcaneBlast: {
        name: `Arcane Blast`,
        desc: `[attacker] fires a concentrated blast of mana at the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'arcaneBlast',
            hitEffect: 'magicExplosion',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: magic,
        targeting: single,
        dmg: 450,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 200},
        accuracy: 100,
        attacks: 1,
    },
    darkBlast: {
        name: `Dark Blast`,
        desc: `[attacker] releases a torrent of dark energy at the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'darkBlast',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 100,
            projectileFade: false,
            smooth: true,
            projectileDelay: 6,
        },
        type: magic,
        targeting: multi,
        dmg: 16,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 150},
        accuracy: 100,
        attacks: 30,
    },
    righteousSmite: {
        name: `Righteous Smite`,
        desc: `[attacker] calls down lightning from the heavens to smite the targeted enemy`,
        animation: { 
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'lightning',
        },
        type: normal,
        targeting: single,
        dmg: 350,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 150},
        accuracy: 100,
        attacks: 1,
    },
};
const modernWeaponry = { // guns and bombs
    assaultRifle: {
        name: `Assault Rifle`,
        desc: `[attacker] unloads a full magazine towards the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'bullet',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 10,
            projectileFade: true,
            smooth: true,
            projectileDelay: 25,
        },
        type: physical,
        targeting: single,
        dmg: 75,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 95,
        attacks: 30,
    },
    gattlingRailgun: {
        name: `Gattling Railgun`,
        desc: `[attacker] bombards the targeted enemy with a hail of tungsten darts travelling at Mach 6.`,
        animation: { 
            range: 'ranged',
            projectile: 'bullet',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 7,
            projectileFade: true,
            smooth: true,
            projectileDelay: 15,
        },
        type: physical,
        targeting: single,
        dmg: 125,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 100},
        accuracy: 100,
        attacks: 25,
    },
    heavyRailcannon: {
        name: `Heavy Railcannon`,
        desc: `[attacker] launches an electromagnetically accelerated tungsten dart at Mach 10 into the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'railDart',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 7,
            projectileFade: true,
            smooth: true,
            projectileDelay: 15,
        },
        type: physical,
        targeting: single,
        dmg: 1400,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 300},
        accuracy: 100,
        attacks: 1,
    },
    fragGrenade: {
        name: `Frag Grenade`,
        desc: `[attacker] throws a frag grenade towards the enemies.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'fireStorm',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical,
        targeting: aoe,
        dmg: 250,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 100,
        attacks: 1,
    },
    molotovCocktail: {
        name: `Molotov Cocktail`,
        desc: `[attacker] throws a homemade molotov cocktail towards the enemies.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'fireStorm',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: normal,
        targeting: aoe,
        dmg: 15,
        multiplier: none,
        effects: [{effect: 'burning', chance: 100}],
        cost: {hp: 0, mp: 0},
        accuracy: 100,
        attacks: 1,
    },
    airStrike: {
        name: `Air Strike`,
        desc: `[attacker] drops high explosive bombs on the enemy formation.`,
        animation: { 
            range: 'ranged',
            projectile: 'miniNuke',
            hitEffect: 'explosion',
            moveSpeed: 0,
            projectileSpeed: 150,
            projectileFade: false,
            smooth: true,
            projectileDelay: 45,
        },
        type: physical,
        targeting: aoe,
        dmg: 400,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 400},
        accuracy: 100,
        attacks: 3,
    },
    rocketStorm: {
        name: `rocketStorm`,
        desc: `[attacker] unleashes a salvo of incindeary rockets towards the enemies.`,
        animation: { 
            range: 'ranged',
            projectile: 'rocket',
            hitEffect: 'smallExplosion',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: true,
            projectileDelay: 2,
        },
        type: physical,
        targeting: multi,
        dmg: 75,
        multiplier: none,
        effects: [{effect: 'veryBurning', chance: 100}],
        cost: {hp: 0, mp: 250},
        accuracy: 100,
        attacks: 36,
    },
    ionCannon: {
        name: `Ion Cannon`,
        desc: `[attacker] fires concentrated beams of charged ions towards the enemies.`,
        animation: { 
            range: 'ranged',
            projectile: 'ion',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: true,
            projectileDelay: 0,
        },
        type: normal,
        targeting: multi,
        dmg: 10,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 50},
        accuracy: 100,
        attacks: 48,
    },
};
const mathsAndScienceMemes = { // self explanatory
    positronRay: {
        name: `Positron Ray`,
        desc: `[attacker] launches a concentrated beam of positrons at the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'ion',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 90,
            projectileFade: false,
            smooth: true,
            projectileDelay: 0,
        },
        type: piercing,
        targeting: single,
        dmg: 1,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 60},
        accuracy: 100,
        attacks: 30,
    },
    lecture: {
        name: `Lecture`,
        desc: `[attacker] lectures all allies on the standard model of particle phyiscs, increasing their intelligence and magical abilities.`,
        animation: { 
            range: 'allUnits',
            projectile: 'none',
            hitEffect: 'attackUp',
        },
        targeting: aoe,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'mediumMagicEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
    },
};
const uniqueSkills = { // very op skills
    debugFist: {
        name: `Debug Fist`, 
        desc: `[attacker] punches the targeted enemy several times to debug the code.`, 
        animation: { 
            range: 'ranged',
            projectile: 'fireball',
            hitEffect: 'physicalHit',
            moveSpeed: 20,
            projectileSpeed: 100,
            projectileFade: false,
            smooth: true,
            projectileDelay: 25,
        },
        type: physical, 
        targeting: multi, 
        dmg: 10, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 10, mp: 10}, 
        accuracy: 100, 
        attacks: 50, 
    },
    pervertedStare: {
        name: `Perverted Stare`, 
        desc: `[attacker] gives a creepy stare, which does nothing most of the time.`, 
        animation: { 
            range: 'ranged',
            projectile: 'none',
            hitEffect: 'none',
        },
        type: none, 
        targeting: single, 
        dmg: 0, 
        multiplier: none, 
        effects: [], 
        cost: {hp: 0, mp: 10}, 
        accuracy: Infinity, 
        attacks: 1,
    },
    soulHarvest: {
        name: `Soul Harvest`,
        desc: `[attacker] reaps the targeted enemies soul, deaing massive damage.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: false,
            projectileDelay: 0,
        },
        type: piercing,
        targeting: single,
        dmg: 1000,
        multiplier: str,
        effects: [],
        cost: {hp: -975, mp: 1400},
        accuracy: 100,
        attacks: 1,
    },
    defibrillator: {
        name: `Defibrillator`,
        desc: `[attacker] uses CPR a defibrillator to instantly heal back to full health.`,
        animation: {
            range: 'self',
            projectile: 'none',
            hitEffect: 'hpUp',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: heal,
        targeting: single,
        dmg: -69420,
        multiplier: none,
        effects: [],
        cost: {hp: 0, mp: 400},
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
    aggressiveSurgery: {
        name: `Aggressive Surgery`, 
        desc: `[attacker] hacks and slashes at the targeted enemy with a scalple.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 50,
            projectileFade: true,
            smooth: true,
            projectileDelay: 15,
        },
        type: piercing, 
        targeting: single,
        dmg: 24, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100,
        attacks: 12, 
    },
};
const miscSkills = { // unsorted stuff
    reposition: {
        name: `Reposition`, 
        desc: `[attacker] switches rows.`, 
        animation: { 
            range: 'none',
            projectile: 'none',
            hitEffect: 'none',
            moveSpeed: 0,
            projectileSpeed: 0,
            projectileFade: false,
            smooth: false,
            projectileDelay: 0,
        },
        type: physical, 
        targeting: selfOnly, 
        dmg: 0, 
        multiplier: none, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: Infinity, 
        attacks: 0,
        instantUse: true, 
    },
};
const goblinSkills = {
    hit: {
        name: `Hit`, 
        desc: `[attacker] punches the targeted enemy several times.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
            moveSpeed: 0,
            projectileSpeed: 0,
            smooth: false,
        },
        type: physical,
        targeting: single, 
        dmg: 18,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 90,
        attacks: 1,
    },
    rapidHit: {
        name: `Rapid Hits`, 
        desc: `[attacker] punches the targeted enemy several times.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
            moveSpeed: 50,
            projectileSpeed: 0,
            smooth: false,
        },
        type: physical,
        targeting: single, 
        dmg: 10,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 80,
        attacks: 3,
    },
    smash: {
        name: `Smash`, 
        desc: `[attacker] smashes down on the targeted enemy.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
            moveSpeed: 50,
            projectileSpeed: 0,
            smooth: false,
        },
        type: physical,
        targeting: single, 
        dmg: 50,
        multiplier: str,
        effects: [],
        cost: {hp: 10, mp: 0},
        accuracy: 80,
        attacks: 1,
    },
    crushingBlow: {
        name: `Crushing Blow`, 
        desc: `[attacker] smashes down on the targeted enemy.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordThrust',
            hitEffect: 'none',
            moveSpeed: 50,
            projectileSpeed: 0,
            smooth: false,
        },
        type: piercing,
        targeting: single, 
        dmg: 35,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 85,
        attacks: 1,
    },
    roar: {
        name: `Roar`,
        desc: `[attacker] roars and gets stronger.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'statUp',
        },
        type: none, 
        targeting: single,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'lesserPhysicalEnhancement', chance: 100}],
        cost: {hp: 0, mp: 0},
        accuracy: Infinity,
        attacks: 1,
        instantUse: true,
    },
    rallyingRoar: {
        name: `Rallying Roar`,
        desc: `[attacker] roars, empowering all allies.`,
        animation: { 
            range: 'allUnits',
            projectile: 'none',
            hitEffect: 'statUp',
        },
        type: none, 
        targeting: aoe,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'mediumPhysicalEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 0},
        accuracy: none,
        attacks: 1,
        instantUse: true,
    },
};
data.skills = {...basicPhysicalAttacks, ...basicSwordAttacks, ...basicRangedAttacks, ...basicVerbalAttacks, ...intermediatePhysicalAttacks, ...intermediateSwordAttacks, ...advancedSwordAttacks, ...healingSkills, ...selfBuffs, ...buffSkills, ...debuffSkills, ...magicAttacks, ...modernWeaponry, ...mathsAndScienceMemes, ...uniqueSkills, ...miscSkills, ...goblinSkills};
data.effects = {...debuffEffects, ...buffEffects};
deepFreeze(data);
console.log(data);
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
    let desc = `<span id="left"><div id='hpBar'><div id="${id}hp" class="hpBarInner"></div></div><img src="assets/redCross.png" class="smallIcon"><span id="${id}hpDisplay">${Math.floor(character.hp)}</span></span><span id="right"><div id='mpBar'><div id="${id}mp" class="mpBarInner"></div></div><span id="${id}mpDisplay">${Math.floor(character.mp)}</span><img src="assets/blueStar.png" class="smallIcon"></span>`;
    return `<button ${buttonData}>${character.ap > 0? `<div id="cornerIcon"><span id="down">!</span></div>` : ``}<span id="up"><p id="noPadding" class="characterTitle">${title}</p><img src="${character.pfp}" class="characterIcon"></span>${desc}</button>`;
};

function cardLine(cards, pos, onClick) {
    html = ``;
    for (let i = 0; i < cards.length; i++) {
        cards[i].id = `${pos}${i}ID`;
        html += createCharacterCard(cards[i], `${pos}${i}ID`, onClick? `${onClick}('${pos}${i}ID')`: ``);
    }
    return html;
};

function massUpdateBars(cards) {
    cards.forEach(obj => {
        updateBar(obj.id+'hp', obj.hp/obj.hpMax, obj.hp);
        updateBar(obj.id+'mp', obj.mp/obj.mpMax, obj.mp);
    });
}

function renderCards(pOnClick=undefined, eOnClick=undefined, enemyBack=game.gamestate.battleState.eb, enemyFront=game.gamestate.battleState.ef, playerFront=game.gamestate.battleState.pf, playerBack=game.gamestate.battleState.pb) {
    console.log(pOnClick, eOnClick);
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
};

function modifyPx(str, operation) { // Chat GPT code (idk how this works) turns out it doesnt work or maybe it does
    return str.replace(/^(\d+)([a-zA-Z]+)$/, (_, num, letters) => {
        let modifiedNumber = operation(parseInt(num, 10));
        return modifiedNumber + letters;
    });
}

function addPx(val1, val2) {
    return (parseFloat(val1) + parseFloat(val2)) + val1.replace(/\d+/, '');
};

const countValidProperties = (obj) => {
    return Object.keys(obj).filter(key => {
        const value = obj[key];
        return value !== undefined && value !== null && value !== false && value !== 0 && value !== "" && !Number.isNaN(value);
    }).length;
};
  
const handleParticles = (obj) => {
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (!value || Number.isNaN(value)) {
            delete obj[key];
        } else {
            value.life--;
            switch (value.type) {
                case 'float':
                    document.getElementById(value.id).style.top = `${unPixel(document.getElementById(value.id).style.top) - 2}px`;
                    //console.log(document.getElementById(value.id).style.top);
                    
                    if (value.life < 25) document.getElementById(value.id).style.opacity *= 0.9;
                    //console.log(document.getElementById(value.id).style.opacity);
                    break;
                case 'fall':
                    document.getElementById(value.id).style.top = `${unPixel(document.getElementById(value.id).style.top) + 2}px`;
                    //console.log(document.getElementById(value.id).style.top);

                    if (value.life < 25) document.getElementById(value.id).style.opacity *= 0.9;
                    //console.log(document.getElementById(value.id).style.opacity);
                    break;
                default:
                    console.error(`unknown particle type: ${value.type}`)
            }
            if (value.life < 0) {
                document.getElementById(value.id).remove();
                delete obj[key];
            }
        }

    });
    return obj;
};

async function handleEffects() {
    if (countValidProperties(game.gamestate.particles) == 0) return
    for (let i = 0; i < 9; i++) {
        handleParticles(game.gamestate.particles);
        await sleep(25);
    }
};

async function aoeEffect(effect, team) {
    let id = `aoeEffect${effect}`;
    console.log('drawing effect');
    if (document.getElementById(id)) return;
    let html = `<img src="assets/${effect}.png" id="${id}"></img>`;
    addhtml('effects', html);
    document.getElementById(id).style.opacity = 1;
    document.getElementById(id).style.position = `absolute`;
    document.getElementById(id).style.top = `${team == 'E'? 0 : document.getElementById('battleScreen').getBoundingClientRect().height-450}px`;
    document.getElementById(id).style.left = `${document.getElementById('battleScreen').getBoundingClientRect().width/2 - 325}px`;
    console.log(document.getElementById(id).style.top, document.getElementById(id).style.left);
    await sleep(1000);
    for (let i = 0; i < 300; i++) {
        document.getElementById(id).style.opacity = document.getElementById(id).style.opacity * 0.99;
        await sleep(5);
    }
    document.getElementById(id).remove();
};

async function hitEffect(effect, pos, offset, noRotate=false, duration=250, fadeDuration=50, fadeAmount=0.95) {
    let id = generateId();
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
        default:
            if (effect.includes('Up') || effect.includes('Down')) console.warn(`WARNING: this stat change effect is not supported: ${effect}`);
    }
    if (icon != ``) {
        hitEffect(bg, pos, {x: 87.5-75, y: 100-95}, true, 750, 300, 0.99);
        for (let i = 0; i < 4; i++) {
            let particle = {
                id: generateId(),
                life: 50,
                type: effect.includes('Up')? 'float' : 'fall',
            };
            let html = `<img src="assets/${icon}" id="${particle.id}" class="mediumIcon">`;
            addhtml('effects', html);
            document.getElementById(particle.id).style.opacity = 1;
            document.getElementById(particle.id).style.position = `absolute`;
            document.getElementById(particle.id).style.top = `${pos.y + 95 + randint(0, 180) - 90 - document.getElementById(particle.id).offsetHeight/2}px`;
            document.getElementById(particle.id).style.left = `${pos.x + 75 + randint(-75, 75) - document.getElementById(particle.id).offsetWidth/2}px`;
            //console.log(document.getElementById(particle.id).style.top, document.getElementById(particle.id).style.left);
            game.gamestate.particles[particle.id] = particle;
        }
        for (let i = 0; i < 8; i++) {
            let particle = {
                id: generateId(),
                life: 50,
                type: effect.includes('Up')? 'float' : 'fall',
            };
            let html = `<img src="assets/${icon}" id="${particle.id}" class="smallIcon">`;
            addhtml('effects', html);
            document.getElementById(particle.id).style.opacity = 1;
            document.getElementById(particle.id).style.position = `absolute`;
            document.getElementById(particle.id).style.top = `${pos.y + 95 + randint(0, 180) - 90 - document.getElementById(particle.id).offsetHeight/2}px`;
            document.getElementById(particle.id).style.left = `${pos.x + 75 + randint(-75, 75) - document.getElementById(particle.id).offsetWidth/2}px`;
            //console.log(document.getElementById(particle.id).style.top, document.getElementById(particle.id).style.left);
            game.gamestate.particles[particle.id] = particle;
        }
    } else {
        // normal hit effect
        html = `<img src="assets/${effect}.png" style="transform: rotate(${r}deg);" id="${id}"></img>`;
        addhtml('effects', html);
        //console.log(pos.y+95-document.getElementById(id).offsetHeight/2+randint(-50, 50));
        //console.log(pos);
        //document.getElementById(id).style.display = 'none';
        document.getElementById(id).style.opacity = 1;
        document.getElementById(id).style.position = `absolute`;
        await sleep(50); // let stuff load
        //console.log(document.getElementById(id).offsetHeight, document.getElementById(id).offsetWidth);
        document.getElementById(id).style.top = `${pos.y+95-document.getElementById(id).offsetHeight/2}px`;
        document.getElementById(id).style.left = `${pos.x+75-document.getElementById(id).offsetWidth/2}px`;
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
};

async function simulateSmoothProjectileAttack(animation, start, target, dmg) {
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
    // unfortunately I can't define a variable to be the element otherwise async stuff breaks
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
    dmgNumber(target, dmg);
    if (animation.hitEffect != 'none') {
        hitEffect(animation.hitEffect, getCardCoords(target), randOffset);
    }
};

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
    document.getElementById(id).style.opacity = 1;
    document.getElementById(id).style.position = `absolute`;
    await sleep(50); // let stuff load
    document.getElementById(id).style.top = `${start.y+95-document.getElementById(id).offsetHeight/2}px`;
    document.getElementById(id).style.left = `${start.x+75-document.getElementById(id).offsetWidth/2}px`;
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
};

async function fakeMoveCard(card, targetCard, steps, reset=false, offset={x: 0, y: 0}) {
    let startingPos = getCardCoords(card);
    let pos = targetCard.x? targetCard : getCardCoords(targetCard);
    if (!reset) pos = vMath(pos, {x: 0, y: targetCard.id[0] == 'E' ? 210 : -210}, '+');
    pos = vMath(pos, offset, '+');
    //console.log(getCoordsScuffed(id));
    let element = undefined;
    //startingPos = getCoords(id);
    if (!document.getElementById(card.id+'animation')) {
        //console.log('ceating clone');
        let original = document.getElementById(card.id);
        element = original.cloneNode(true);
        original.style.display = 'none';
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
        document.getElementById(card.id).style.display = 'inline-block';
    } 
    //console.log('final', element.style.top, element.style.left);
    //console.log(getCoordsScuffed(id+'animation'));
    
};

async function changeStat(target, effect) {
    if (effect.change == 0) return;
    //print(`final ${final}`);                                                                                                                                                                            
    let time = 750;
    let steps = 20;
    //console.log(target);
    //let position = readID(target.id);
    //console.log(target);
    //console.log(effect.change);
    //console.log(effect.change/steps);
    for (let i = 0; i < steps; i++) {
        target[effect.stat] = Math.min(target[effect.stat] + effect.change/steps, target[effect.stat+'Max']);
        //game.gamestate.battleState[position.row][position.pos][effect.stat] += effect.change/steps; // should handle multiple changeStat functions running for the same bar, however, floating point errors
        //print(Math.ceil(target[effect.stat]));
        //print(i);
        //console.log(target.hp);
        //console.log(game.gamestate.battleState.ef[0].hp);
        updateBar(target.id+effect.stat, target[effect.stat]/target[effect.stat+'Max'], Math.floor(target[effect.stat]));
        //console.log(target[effect.stat]/target[effect.stat+'Max']);
        await new Promise(resolve => setTimeout(resolve, time/steps));
    }
    //console.log(target);
    //console.log(position);
    //console.log(game.gamestate.battleState[position.row][position.pos]);
    //console.log(game.gamestate.battleState[position.row][position.pos][effect.stat]);
};

function readID(id) {
    return {
        row: id.slice(0, 2).toLowerCase(),
        pos: parseInt(id.slice(2, 3))
    };
};

function selectCard(id) {
    let row = id.slice(0, 2);
    let pos = id.slice(2, -2);
    return game.gamestate.battleState[row.toLowerCase()][pos];
};

function calcResistance(dmgType, dmg, target) {
    switch (dmgType) {
        case magic:
            return (dmg-target.armour.magic[0])*(100-target.armour.magic[1])/100;
        case physical:
            return (dmg-target.armour.physical[0])*(100-target.armour.physical[1])/100;
        case piercing:
            return dmg;
        case normal:
            return Math.max((dmg-target.armour.physical[0])*(100-target.armour.physical[1])/100, (dmg-target.armour.magic[0])*(100-target.armour.magic[1])/100);
    }
};

function calculateEffect(card, effect) {
    //console.log('calculateEffect');
    if (!effect.initialised) {
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
        effect.initialised = true;
        return effect;
    }
    //console.log('effects updated');
    if (effect.dmg > 0) {
        let miss = randint(0, 100) > accuracy;
        if (!miss) changeStat(card, {stat: 'hp', change: -dmg});
        dmgNumber(card, miss? 0 : calcResistance(effect.type, effect.dmg, card), miss);
    }
    if (effect.change.hp) {
        changeStat(card, {stat: 'hp', change: effect.change.hp});
        dmgNumber(card, -effect.change.hp);
    }
    if (effect.change.mp) {
        changeStat(card, {stat: 'mp', change: effect.change.mp});
        dmgNumber(card, -effect.change.mp);
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
        return false;
    }
    return effect;
};

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
}

function handleStatusEffects() {
    handleStatusEffectsRow(game.gamestate.battleState.eb);
    handleStatusEffectsRow(game.gamestate.battleState.ef);
    handleStatusEffectsRow(game.gamestate.battleState.pf);
    handleStatusEffectsRow(game.gamestate.battleState.pb);
};

function dmgNumber(card, dmg, miss=false) { // there is better way to do this, but its already made so I won't change it
    let particle = {
        id: generateId(),
        life: 70,
        type: 'float',
    };
    console.log(particle);
    let html = miss? `<div id="${particle.id}" class="resistNum">miss</div>` : `<div id="${particle.id}" class="${dmg > 0? `dmgNum` : (dmg == 0 ? `resistNum` : `healNum`)}">${Math.abs(dmg)}</div>`;
    addhtml('effects', html);
    let coords = getCardCoords(card);
    document.getElementById(particle.id).style.opacity = 1;
    document.getElementById(particle.id).style.position = `absolute`;
    document.getElementById(particle.id).style.top = `${coords.y+randint(60, 150)}px`;
    document.getElementById(particle.id).style.left = `${75+coords.x+randint(-50, 50)-document.getElementById(particle.id).offsetWidth/2}px`;
    game.gamestate.particles[particle.id] = particle;
};

async function simulateSingleAttack(user, skill, target) { // TODO: implement missing and accuracy stuff
    let number = true;
    if (skill.dmg == 0) number = false; // skills that do not intend to do damage should not have damage numbers
    let dmg = skill.type == heal? skill.dmg : Math.floor(skill.dmg > 0? Math.max(0, calcResistance(skill.type, skill.dmg * (skill.multiplier? user[skill.multiplier] * (skill.multiplier == int? 0.01 : 1) : 1), target)) : skill.dmg);
    let done = false;
    let offset = undefined;
    if (skill.animation.range === 'fullScreen') {
        aoeEffect(skill.animation.projectile, target.id[0]);
        console.log('changing stats');
        changeStat(target, {stat: 'hp', change: -dmg});
        if (number) dmgNumber(target, dmg);
        return;
    };

    if (skill.animation.range === 'melee') {
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
            simulateSmoothProjectileAttack(skill.animation, startPos, target, dmg);
            await sleep(skill.animation.projectileDelay);
        } 
        else offset = await simulateProjectileAttack(skill.animation.projectile, startPos, endPos, skill.animation.projectileSpeed, skill.animation.projectileFade);
    } 
    if (!done) {
        changeStat(target, {stat: 'hp', change: -dmg});
        if (number) dmgNumber(target, dmg);
        if (skill.animation.hitEffect != 'none') {
            await hitEffect(skill.animation.hitEffect, getCardCoords(target), offset);
        }
    }
    for (let i = 0; i < skill.effects.length; i++) {
        if (randint(0,100) <= skill.effects[i].chance) {
            let effect = JSON.parse(JSON.stringify(data.effects[skill.effects[i].effect]));
            effect.initialised = false;
            console.log(effect);
            target.effects.push(calculateEffect(target, effect));
            console.log(target);
        }
    }
};

function skills(card=undefined, enabled=true) { // sidebar skills in combat
    if (card) {
        if (card.ap <= 0) enabled = false; // must have action points to attack. 'enabled' is used to disable actions when there are action points left
        replacehtml(`nav`, `<button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button><button onclick="skills()" class="focusedButton"><h3>Skills</h3></button>`);
        replacehtml(`money`, `<span><strong>${card.name}</strong></span>`);
        console.log('skills');
        let buttonGridHtml = `<div id="stats"><p id="noPadding" class="statsText">  <img src="assets/lightning.png" class="smallIcon"> Actions Left:    ${card.ap}<br>  <img src="assets/sword.png" class="smallIcon"> Strength:        ×${card.str}<br>  Intelligence:      ${card.int}<br>  <img src="assets/shield.png" class="smallIcon"> Physical Armour: ${card.armour.physical[0]}, ${card.armour.physical[1]}%<br>  <img src="assets/blueShield.png" class="smallIcon"> Magic Armour:    ${card.armour.magic[0]}, ${card.armour.magic[1]}%</p></div>`;
        for (let i = 0; i < card.skills.length; i++) {
            let dmg = data.skills[card.skills[i]].dmg;
            if (data.skills[card.skills[i]].type != heal) {
                switch (data.skills[card.skills[i]].multiplier) {
                    case str:
                        dmg *= card.str;
                        break;
                    case int:
                        dmg *= card.int/100;
                        break;
                }
                dmg = Math.floor(dmg);
            }
            let title = `<strong>${data.skills[card.skills[i]].name}</strong>`;
            let desc = `${data.skills[card.skills[i]].desc.replace(`[attacker]`, card.name).replace(`[pronoun]`, card.gender == female? `her` : `his`)}<br>${dmg == 0? `` : `<img src="assets/${dmg > 0? `lightning` : `greenCross`}.png" class="smallIcon"> ${dmg > 0? dmg : -dmg} × ${data.skills[card.skills[i]].attacks}<br>`}<img src="assets/explosion.png" class="smallIcon"> ${data.skills[card.skills[i]].targeting}<br>${data.skills[card.skills[i]].cost.hp ? `<img src="assets/greenCross.png" class="smallIcon"> ${data.skills[card.skills[i]].cost.hp}` : ``} ${data.skills[card.skills[i]].cost.mp ? `<img src="assets/blueStar.png" class="smallIcon"> ${data.skills[card.skills[i]].cost.mp}` : ``}`;
            let buttonData = `${enabled? `onclick="useSkill('${card.skills[i]}')" ` : ``}id="${data.skills[card.skills[i]].name}" class="pullButton greyButton smallerFont"`;
            buttonGridHtml += `<span><button ${buttonData}><p id="noPadding"><strong>${title}</strong><br>${desc}</p></button></span>`;
        }
        console.log(buttonGridHtml);
        replacehtml(`grid`, `<div id="buttonGridInventory">${buttonGridHtml}</div>`);
    } else {
        replacehtml(`nav`, `<button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button><button onclick="skills()" class="focusedButton"><h3>Skills</h3></button>`);
        replacehtml(`money`, `<span>Select Card</span>`);
        replacehtml(`grid`, `<div id="buttonGridInventory"></div>`);
    }
};

async function simulateSkill(user, skill, target=undefined) { 
    console.log('skill used');
    user.ap--;
    renderCards();
    skills(user, false);
    if (skill.cost.hp) {
        changeStat(user, {stat: 'mp', change: -skill.cost.mp}); 
        await changeStat(user, {stat: 'hp', change: -skill.cost.hp});
    } else if (skill.cost.mp) {
        await changeStat(user, {stat: 'mp', change: -skill.cost.mp}); 
    }
    await sleep(10);
    if (skill.animation.range === 'melee') await fakeMoveCard(user, target, 100);
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
                await sleep(200);
            }
            break;
        case multi:
            let targets = target.id[0] == 'E' ? [].concat(game.gamestate.battleState.ef, game.gamestate.battleState.eb) : [].concat(game.gamestate.battleState.pf, game.gamestate.battleState.pb);
            for (let i = 0; i < skill.attacks; i++) {
                let chosen = randchoice([0,1]) ? target : randchoice(targets);
                if (i == 0) chosen = target; // first attack always hits targeted enemy
                //print(chosen.id);
                await simulateSingleAttack(user, skill, chosen);
                await sleep(100);
            }
            break;
        case selfOnly:
        case single:
            for (let i = 0; i < skill.attacks; i++) {
                await simulateSingleAttack(user, skill, target);
                await sleep(100);
            }
            break;
        case summon:

            break;
        default:
            console.error(`ERROR: unknown skill targeting: ${skill.targeting}`);
    }
    if (skill.animation.range === 'melee') await fakeMoveCard(user, user, 100, true);
    await sleep(2000);
    game.gamestate.battleState.eb = checkDead(game.gamestate.battleState.eb);
    game.gamestate.battleState.ef = checkDead(game.gamestate.battleState.ef);
    game.gamestate.battleState.pb = checkDead(game.gamestate.battleState.pb);
    game.gamestate.battleState.pf = checkDead(game.gamestate.battleState.pf);
    renderCards(`selectAction`, `selectAction`);
    skills(user, false);
};

function selectAction(id) {
    let card = selectCard(id);
    // if (!card.ap) return; 
    let cardHtml = document.getElementById(id);
    for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
        //print(`${id.slice(0, 2)}${i}ID`);
        document.getElementById(`PB${i}ID`).className = document.getElementById(`PB${i}ID`).className.replace(` selected`, ``);
    }
    for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
        document.getElementById(`PF${i}ID`).className = document.getElementById(`PF${i}ID`).className.replace(` selected`, ``);
    }
    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
        //print(`${id.slice(0, 2)}${i}ID`);
        document.getElementById(`EB${i}ID`).className = document.getElementById(`EB${i}ID`).className.replace(` selected`, ``);
    }
    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
        document.getElementById(`EF${i}ID`).className = document.getElementById(`EF${i}ID`).className.replace(` selected`, ``);
    }
    cardHtml.className += ` selected`;
    game.gamestate.battleState.tempStorage.activeCardId = id;
    skills(card);
};

function selectTarget(id) {
    let targetedCard = selectCard(id);
    let activeCard = selectCard(game.gamestate.battleState.tempStorage.activeCardId);
    let skillUsed = data.skills[game.gamestate.battleState.tempStorage.skillId];
    //print(targetedCard);
    //print(activeCard);
    //print(skillUsed);
    
    game.gamestate.battleState.tempStorage = {};
    simulateSkill(activeCard, skillUsed, targetedCard);
};

async function repositionCard(card) {
    card.ap--;
    renderCards();
    let newID = `P${card.id[1] == `F`? `B` : `F`}${card.id[1] == `F`? game.gamestate.battleState.pb.length: game.gamestate.battleState.pf.length}ID`;
    console.log(newID);
    await fakeMoveCard(card, {id: newID}, 50, true, {x: -85, y: 0});
    if (card.id[1] == `F`) {
        let newPf = [];
        for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
            if (game.gamestate.battleState.pf[i].id != card.id) newPf.push(game.gamestate.battleState.pf[i]);
        }
        game.gamestate.battleState.pb.push(card);
        game.gamestate.battleState.pf = newPf;
    } else {
        let newPb = [];
        for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
            if (game.gamestate.battleState.pb[i].id != card.id) newPb.push(game.gamestate.battleState.pb[i]);
        }
        game.gamestate.battleState.pf.push(card);
        game.gamestate.battleState.pb = newPb;
    }
    renderCards(`selectAction`);
    skills(card, false);
}

function useSkill(skillId=undefined) {
    let skill = data.skills[skillId];
    print(`skill selected`);
    print(skill);
    document.getElementById(`buttonGridInventory`).innerHTML = document.getElementById(`buttonGridInventory`).innerHTML.replace(` selected`, ``);
    document.getElementById(skill.name).className += ` selected`;
    if (skill.instantUse) {
        if (skill.name == 'Reposition') {
            repositionCard(selectCard(game.gamestate.battleState.tempStorage.activeCardId));
        } else {
            simulateSkill(selectCard(game.gamestate.battleState.tempStorage.activeCardId), skill, selectCard(game.gamestate.battleState.tempStorage.activeCardId));
        }
    } else {
        game.gamestate.battleState.tempStorage.skillId = skillId;
        renderCards(`selectTarget`, `selectTarget`);
    }
};

function regenCardMana(card) {
    if (!card.specialConditions.noRegen) {
        card.mp = Math.min(card.mp + card.mpRegen, card.mpMax);
    }
};

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
};

function checkDead(row) {
    let nRow = [];
    for (let i = 0; i < row.length; i++) {
        if (row[i].hp > 0) {
            nRow.push(row[i]);
        } else {
            row[i].alive = false; // this keeps track of whether player characters are dead so they can be revived later
        }
    }
    return nRow;
};

async function handleEnemyAttack(enemy) {
    let skillToUse = data.skills[randchoice(enemy.skills)];
    console.log(skillToUse);
    let target = game.gamestate.battleState.pf.length > 0? randchoice(game.gamestate.battleState.pf) : randchoice(game.gamestate.battleState.pb);
    if (skillToUse.instantUse) target = enemy;
    await simulateSkill(enemy, skillToUse, target);
};

function playerTurn() {
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        game.gamestate.player.team[i].ap = 1; 
        if (game.gamestate.player.team[i].infiniteAp) game.gamestate.player.team[i].ap = Infinity;
    }
    renderCards(`selectAction`, `selectAction`);
};

async function enemyTurn() {
    console.log('enemy attacking');
    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
        game.gamestate.battleState.eb[i].ap = 1;
    }
    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
        game.gamestate.battleState.ef[i].ap = 1;
    }
    renderCards();
    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
        await handleEnemyAttack(game.gamestate.battleState.ef[i]);
    }
    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
        await handleEnemyAttack(game.gamestate.battleState.eb[i]);
    }
    console.log('end enemy turn, start handle effects');
    handleStatusEffects();
    regenMana();
    console.log('end handle effects');
    playerTurn();
};

async function battle() {
    playerTurn();
    while (1) {
        await new Promise(resolve => setTimeout(resolve, 250));
        handleEffects();
        if (!game.gamestate.inBattle) break;
    }
};

function startWave() {
    let dungeon = data.dungeons[game.gamestate.progression];
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
        enemy.hpMax =  enemy.hp;
        enemy.mpMax =  enemy.mp;
        enemy.rarity = enemyData.lvl;
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
};

async function runDungeon() {
    let dungeon = data.dungeons[game.gamestate.progression];
    let battleState = game.gamestate.battleState;
    for (battleState.wave; battleState.wave < dungeon.waves.length; battleState.wave++) {
        battleState.turn = `player`; // player always gets first move
        regenMana(); // extra regen mana before every wave
        startWave();
        renderCards();
        console.log('battle');
        battle();
        while (battleState.ef.length + battleState.eb.length > 0) {
            /* Kill all enemies
            game.gamestate.battleState.ef = [];
            game.gamestate.battleState.eb = [];
            */
            await new Promise(resolve => setTimeout(resolve, 500));
            //console.log(`Dungeon: Waiting`);
        }
        console.log(`Wave Cleared`);
        renderCards();
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Do a wave cleared animation or something
    }
    console.log('dungeon cleared');
    // give rewards and stuff
};

function startDungeon() {
    let dungeon = data.dungeons[game.gamestate.progression];
    exitFocus();
    replacehtml(`bac`, `<img src="${dungeon.innerBac}" id="bigBacImg"><div id="battleScreen"></div>`); // battle screen is in background as it can be scrolled
    replacehtml(`main`, ``);
    // scroll the page to centre the battle
    document.getElementById(`bac`).scrollLeft = 185;
    inventory();
    replacehtml(`battleScreen`, `<div id="enemyBackline" class="battleCardContainer"></div><div id="enemyFrontline" class="battleCardContainer"></div><div id="gameHints"></div><div id="playerFrontline" class="battleCardContainer"></div><div id="playerBackline" class="battleCardContainer"></div><div id="effects"></div><div id="dialogueBox"></div>`);
    replacehtml(`main`, `<button onclick="enemyTurn()" id="sellButton" class="endTurn">End Turn</button>`);
    let battleState = game.gamestate.battleState;
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        game.gamestate.player.team[i].hpMax = game.gamestate.player.team[i].hp;
        game.gamestate.player.team[i].mpMax = game.gamestate.player.team[i].mp;
        game.gamestate.player.team[i].ap = 1;
        game.gamestate.player.team[i].skills.push('reposition');
        battleState.pb.push(game.gamestate.player.team[i]);
    }
    game.gamestate.inBattle = true;
    game.gamestate.battleState.battleOver = false;
    game.gamestate.battleState.wave = 10;
    resize();
    inventory();
    console.log('dungeon started');
    runDungeon();
};

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
};

function resize() {
    console.log('resized');
    let sidebarWidth = Math.max(370, Math.ceil((display.x - display.y - 30) / 170) * 170 + 30);
    if (game.gamestate.inBattle) sidebarWidth = 370;
    document.getElementById('sidebar').style.width = `${sidebarWidth}px`;
    document.getElementById('bac').style['max-width'] = `${display.x - sidebarWidth}px`;
    let teamPosition = ((display.x - sidebarWidth) - 685) / 2;
    if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style.left = `${teamPosition}px`;
    let playButtonPosition = ((display.x - sidebarWidth) - 200) / 2;
    if (document.getElementById('playButton')) document.getElementById('playButton').style.left = `${playButtonPosition}px`;
    let focusWindowSize = display.x - sidebarWidth;
    if (document.getElementById('focus')) document.getElementById('focus').style.width = `${focusWindowSize - 10}px`;
    let battleCardsPosition = (display.x - 1020) / 2;
    if (document.getElementById('enemyBackline')) document.getElementById('enemyBackline').style.left = `${battleCardsPosition}px`;
    if (document.getElementById('enemyFrontline')) document.getElementById('enemyFrontline').style.left = `${battleCardsPosition}px`;
    if (document.getElementById('playerFrontline')) document.getElementById('playerFrontline').style.left = `${battleCardsPosition}px`;
    if (document.getElementById('playerBackline')) document.getElementById('playerBackline').style.left = `${battleCardsPosition}px`;
};

function fetchBar(id) {
    //print(getComputedStyle(document.getElementById(id)).minWidth);
    if (document.getElementById(id)) return parseFloat(getComputedStyle(document.getElementById(id)).minWidth.slice(0, -2))/60;
    else console.error(`can not find card id: ${id}`);
};

function updateBar(id, percent, value=-1000000000) {
    percent = Math.min(percent, 100);
    if (document.getElementById(id)) {
        document.getElementById(id).style.minWidth = `${Math.max(0, percent)*60}px`;
        if (value > -1000000000) document.getElementById(id+`Display`).innerHTML = Math.floor(value); // scuffed but necessary (idk what this does anymore)
    }
    else console.error(`can not find card id: ${id}`);
};

function clearData() {
    localStorage.removeItem('GatchaGameData');
    console.log('cleared previous data');
};

function inTeam(characterId) {
    let playerTeam = game.gamestate.player.team;
    for (let i = 0; i < playerTeam.length; i++) {
        if (playerTeam[i] && playerTeam[i].name == game.gamestate.player.characters[characterId].name) return true;
    }
    return false;
};

function addToTeam(characterId) {
    let character = game.gamestate.player.characters[characterId];
    game.gamestate.player.team.push(character);
    updateTeam();
    focusCharacter(characterId);
};

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
};

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
};

function inventoryBuyItem(itemId) {
    let item = game.gamestate.player.inventory[itemId];
    item.quantity += 1;
    game.gamestate.player.money -= item.purchacePrice;
    focusItem(itemId);
    inventory();
};

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
};

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
                dmg *= character.int/100;
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
                let effect = data.effects[data.skills[character.skills[i]].effects[j].effect];
                console.log(effect);
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
    else if (game.gamestate.player.team.length < 4) shop += `<button onclick="addToTeam(${characterId})" id="buyButton">Add to Team</button>`;
    else shop += `<button id="cantBuyButton">Add to Team</button>`;
    shop += `</div>`;
    document.getElementById('focus').style.display = `block`;
    replacehtml(`focusTitle`, `<span id="rank${character.rarity}Text"><strong>${rank(character.rarity)} ${character.title} ${character.name} </strong></span>`);
    replacehtml(`focusImageContainer`, `<img src="${character.pfp}" class="focusIcon">`);
    replacehtml(`focusDescription`, character.description);
    replacehtml(`focusStats`, stats.replace('none', 'no'));
    replacehtml(`focusSkills`, shop + skills);
};

function exitFocus() {
    document.getElementById('focus').style.display = `none`;
};

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
};

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
};

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
};

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
};

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
};

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
};

function home() {
    homePage = `
    <span id="bac">
            <img src="${data.dungeons[game.gamestate.progression].outerBac}" id="bacImg"> 
    </span>
    <span id="main">
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
};

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

console.error('ERROR: The operation completed successfully.');