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
    return {x: m * Math.sin(r), y: -m * Math.cos(r)};
};

function toPol(i, j) {
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

function getCoordsManual(card) { // calculate coordinates manually
    let pos = readID(card.id);
    let coords = {x: 175, y: 0}; // idk why
    console.log(pos);
    switch (pos.row) {
        case 'eb':
            coords.y += 10;
            break;
        case 'ef':
            coords.y += 220;
            break;
        case 'pf':
            coords.y += udocument.getElementById('battleScreen').getBoundingClientRect().height - 430;
            break;
        case 'pb':
            coords.y += document.getElementById('battleScreen').getBoundingClientRect().height - 220;
            break;
    }
    coords.x += document.getElementById('battleScreen').getBoundingClientRect().width / 2; // centre
    coords.x -= (150 * game.gamestate.battleState[pos.row].length + 20 * (game.gamestate.battleState[pos.row].length - 1)) / 2; // find position 0
    coords.x += 150 * pos.pos + 20 * pos.pos; // move to correct pos
    console.log(coords);
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
            turn: `player`,
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
            Yuki: { // melee DPS character
                name: `Yuki`, // name of character
                title: `Warrior`, // title to put before name
                description: `Yuki recently graduated from the kingdom's swordmen academy. She's not inexperienced with the sword and knows how to use mana to strengthen her attacks. Additionally her light armour improves her felxibility and allows her to hit harder.`, // description of character
                personality: 'calm', // determines voice lines for character
                stats: {atk: 'high', def: 'medium'}, // stats to show to user
                rarity: N, // how 'good' the character is. In ascending order, the rarities are N (normal), UC (uncommon), R (rare), SR (super rare), E (epic), L (legendary), and G (godly)
                gender: female, // gender of character, used for determining voice lines
                pfp: `assets/AnimeGirl42.jpeg`, // character icon image
                hp: 100, // health
                mp: 50, // mana
                str: 1.2, // strength (physical attack damage = attack base damage * str)
                int: 10, // intelligence (magic attack damage = attack base damage * int/100)
                mpRegen: 5, // mana regeneration per round
                skills: ['punch', 'slash', 'lesserPhysicalEnhancement', 'swordCharge'], // attacks and abilities (every character should have at least 4)
                armour: {physical: [5, 10], magic: [0, 0]}, // resistances to damage, first number is flat damage reduction, second is a percentage reduction
            },
            Akane: { // tank dps hybrid
                name: `Akane`,
                title: `Knight`,
                description: `Akane is one of the kingdom's many knights. She's good at both attacking and defending.`,
                personality: 'arrogant',
                stats: {atk: 'medium', def: 'medium'},
                rarity: N,
                gender: female,
                pfp: `assets/AnimeGirl40.jpeg`,
                hp: 150,
                mp: 30,
                str: 1,
                int: 5,
                mpRegen: 5,
                skills: ['slash', 'thrust', 'swordCharge'],
                armour: {physical: [10, 15], magic: [2, 5]}, // Added minimal magic armor
            },
            Rei: { // tanker
                name: `Rei`,
                title: `Warrior`,
                description: `Rei is clumsy and often misses her attacks, but has a suit of heavy armour that allows her to tank damage quite well.`,
                personality: 'confident',
                stats: {atk: 'low', def: 'high'},
                rarity: N,
                gender: female,
                pfp: `assets/AnimeGirl9.jpeg`,
                hp: 200, 
                mp: 20,
                str: 0.9,
                int: 5,
                mpRegen: 3,
                skills: ['wildSwing', 'overheadStrike', 'raiseGuard'],
                armour: {physical: [20, 20], magic: [5, 5]}, // Increased physical armor, added minimal magic armor
            },
            Emi: { // glass cannon ranged dps
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
                int: 25,
                mpRegen: 25,
                skills: [`punch`, `summonPotato`, `summonChicken`, `insult`],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
        },
        { // UC
            Lucy: { // character with very high defence
                name: `Lucy`,
                title: `The Invulnerable`,
                description: `Lucy is a timid girl who somehow stumbled upon a legendary set of armor. She has no idea how to fight but her equipment makes her nearly invincible.`,
                personality: 'timid',
                stats: {atk: 'low', def: 'extreme'},
                rarity: UC, 
                gender: female,
                pfp: `assets/AnimeGirl14.jpeg`,
                hp: 100, 
                mp: 100, 
                str: 0.9, 
                int: 10, 
                mpRegen: 10, 
                skills: ['wildSwing', 'wildCharge', 'cower', 'sparkleSlash'], 
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
                pfp: `assets/AnimeGirl54.jpeg`,
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
                pfp: `assets/AnimeGirl55.jpeg`,
                hp: 220,
                mp: 200,
                str: 1.5,
                int: 30,
                mpRegen: 0,
                skills: [],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Edwarda: { // support
                name: `Edwarda`,
                title: `Drug Dealer`,
                description: `Former chemist and part time drug dealer, Edwarda broke through reality to reach the other world by synthesising a compound with negative molar mass. Now she synthesises her drugs with alchemy and deals meth in the other world, where there are no pesky poice to ruin her business. However, the return of the demon king has negatively affected her profits, so the demon lord must die.`,
                personality: 'angry',
                stats: {atk: 'low', def: 'low'},
                rarity: SR,
                gender: female,
                pfp: `assets/AnimeGirl56.jpeg`,
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
                pfp: `assets/AnimeGirl52.jpeg`,
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
                description: `Kohana is a grand archmage who has seen countless battles over the centuries. She weilds high teir shadow magic.`,
                personality: 'confident',
                stats: {atk: 'high', def: 'low'},
                rarity: L,
                gender: female,
                pfp: `assets/AnimeGirl27.jpeg`,
                hp: 300,
                mp: 650,
                str: 1.2,
                int: 200,
                mpRegen: 80,
                skills: ['shadowLance', 'darkBlast', 'arcaneBlast', 'shadowVeil'],
                armour: {physical: [10, 15], magic: [20, 50]},
            },
        },
        { // G
            Natsuki: { // glass cannon
                name: `Natsuki`,
                title: `Sword Goddess`,
                description: `Natsuki, the Sword Goddess, is an unparalleled master of swordsmanship. Her strikes are swift and devastating, but her frail body cannot withstand much damage.`,
                personality: 'calm',
                stats: {atk: 'extreme', def: 'none'},
                rarity: G,
                gender: female,
                pfp: `assets/AnimeGirl10.jpeg`,
                hp: 200,
                mp: 875,
                str: 4,
                int: 120,
                mpRegen: 125,
                skills: ['ascendedSlash', 'rapidStrikes', 'swordDance', 'realitySlash', 'superCharge'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Yui: { // commander
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
                int: 120,
                mpRegen: 50,
                skills: ['ascendedSlash', 'rapidStrikes', 'warCry', 'battlefieldCommand', 'righteousSmite'],
                armour: {physical: [200, 50], magic: [200, 40]},
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
                int: 5,
                mpRegen: 5,
                skills: ['debugFist', 'punch', 'bodySlam', 'pervertedStare', 'brag'],
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
                pfp: `assets/AnimeGirl51.jpeg`,
                hp: 975,
                mp: 1625,
                str: 2,
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
            pfp: `assets/Goblin1.jpeg`,
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
            pfp: `assets/Goblin2.jpeg`,
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
            pfp: `assets/Goblin3.jpeg`,
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
    skills: {},
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
        ap: 0,
    }
};

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
        // chnage stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 2,
    },
    lesserWeaken: {
        desc: `a minor weakening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 2 rounds`,
            },
            {
                icon: `brokenSword.png`,
                desc: `- 5% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // chnage stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: -0.05, int: 0, reg: 0},
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
        // chnage stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 100], magic: [0, 100]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 1,
    },
    lesserPhysicalEnhancement: {
        desc: `a minor strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `sword.png`,
                desc: `+ 20% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // chnage stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0.2, int: 0, reg: 0},
        duration: 3,
    },
    mediumPhysicalEnhancement: {
        desc: `a medium strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `sword.png`,
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
        // chnage stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 10], magic: [0, 10]},
        statChange: {str: 0.25, int: 0, reg: 0},
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
                icon: `sword.png`,
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
        // chnage stats per round
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
                desc: `lasts 1 rounds`,
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
        // chnage stats per round
        change: {hp: 0, mp: 0}, 
        // buggs / debuffs
        defChange: {physical: [5, 10], magic: [0, 0]},
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
        // chnage stats per round
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
        // chnage stats per round
        change: {hp: 15, mp: 0}, 
        // buggs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 0, int: 0, reg: 0},
        duration: 3,
    },
    attackBoost: {
        desc: `a greater strengthening effect`, 
        stats: [
            {
                icon: `clock.png`,
                desc: `lasts 3 rounds`,
            },
            {
                icon: `sword.png`,
                desc: `+ 100% physical strength`,
            },
        ],
        // inflict damage per round
        type: physical, 
        dmg: 0, 
        accuracy: 100, 
        // chnage stats per round
        change: {hp: 0, mp: 0}, 
        // buffs / debuffs
        defChange: {physical: [0, 0], magic: [0, 0]},
        statChange: {str: 1, int: 0, reg: 0},
        duration: 3,
    },

};
const basicPhysicalAttacks = { // martial arts attacks
    punch: {
        name: `Punch`, 
        desc: `[attacker] punches the targeted enemy several times.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
            moveSpeed: 50,
            projectileSpeed: 10,
            smooth: false,
        },
        type: physical, 
        targeting: single, 
        dmg: 10, 
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
        dmg: 25, 
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
        dmg: 15, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100,
        attacks: 1, 
    },
    elbowStrike: {
        name: `Elbow Strike`, 
        desc: `[attacker] strikes the targeted enemy with their elbow, potentially causing a minor bleed effect.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
        },
        type: physical, 
        targeting: single,
        dmg: 18, 
        multiplier: str, 
        effects: [{effect: 'lesserBleed', chance: 90}], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 85,
        attacks: 1, 
    },
    kneeStrike: {
        name: `Knee Strike`, 
        desc: `[attacker] delivers a powerful knee strike, potentially weakening the enemy.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
        },
        type: physical, 
        targeting: single,
        dmg: 18, 
        multiplier: str, 
        effects: [{effect: 'lesserWeaken', chance: 80}],
        cost: {hp: 0, mp: 0}, 
        accuracy: 85,
        attacks: 1, 
    },
    palmStrike: {
        name: `Palm Strike`, 
        desc: `[attacker] delivers a precise palm strike, hitting through the opponent's armour.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'physicalHit',
        },
        type: piercing, 
        targeting: single,
        dmg: 10, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 95,
        attacks: 1, 
    },
    bodySlam: {
        name: `Body Slam`, 
        desc: `[attacker] slams [pronoun] body into the targeted enemy, dealing massive damage but costing health.`, 
        animation: { 
            range: 'melee',
            projectile: 'none',
            hitEffect: 'bigPhysicalHit',
        },
        type: 'physical', 
        targeting: single,
        dmg: 50, 
        multiplier: 'str', 
        effects: [], 
        cost: {hp: 20, mp: 0}, 
        accuracy: 70,
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
        },
        type: physical, 
        targeting: single,
        dmg: 30, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 85,
        attacks: 1, 
    },
    thrust: {
        name: `Thrust`,
        desc: `[attacker] thrusts at the targeted enemy.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
        },
        type: physical,
        targeting: single,
        dmg: 25,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 95,
        attacks: 1,
    },
    swordCharge: {
        name: `Sword Charge`, 
        desc: `[attacker] charges at the enemy with a powerful sword strike.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
        },
        type: physical, 
        targeting: single,
        dmg: 40, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 10}, 
        accuracy: 80,
        attacks: 1, 
    },
    overheadStrike: {
        name: `Overhead Strike`,
        desc: `[attacker] leaps into the air and strikes at the targeted enemy from above.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
        },
        type: physical,
        targeting: single,
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
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
        },
        type: physical,
        targeting: single,
        dmg: 36,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
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
        attackType: `physical`,
        type: normal,
        targeting: single,
        dmg: 20,
        multiplier: str,
        effects: [],
        cost: {hp: 40, mp: 100},
        accuracy: 100,
        attacks: 5,
    },
};
const healingSkills = { // heals
    lesserHeal: { // A healing skill is an attack that does negative damage
        name: `Lesser Healing`,
        desc: `[attacker] heals the targeted ally.`,
        animation: { 
            range: 'ranged',
            projectile: 'healingLight',
            hitEffect: 'none',
        },
        type: heal,
        targeting: single,
        dmg: -20,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 25},
        accuracy: Infinity,
        attacks: 1,
    },
    lesserAreaHeal: {
        name: `Lesser Area Healing`,
        desc: `[attacker] heals all allies.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'areaHealingLight',
            hitEffect: 'none',
        },
        type: heal,
        targeting: aoe,
        dmg: -10,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 75},
        accuracy: Infinity,
        attacks: 1,
    },
    mediumHeal: {
        name: `Medium Healing`,
        desc: `[attacker] heals the targeted ally.`,
        animation: { 
            range: 'ranged',
            projectile: 'healingLight',
            hitEffect: 'none',
        },
        type: heal,
        targeting: single,
        dmg: -50,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 45},
        accuracy: Infinity,
        attacks: 1,
    },
    mediumAreaHeal: {
        name: `Medium Area Healing`,
        desc: `[attacker] heals all allies moderately.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'areaHealingLight',
            hitEffect: 'none',
        },
        type: heal,
        targeting: aoe,
        dmg: -25,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 100},
        accuracy: Infinity,
        attacks: 1,
    },
    greaterHeal: {
        name: `Greater Healing`,
        desc: `[attacker] heals the targeted ally and leaves a lingering heal over time effect.`,
        animation: { 
            range: 'ranged',
            projectile: 'healingLight',
            hitEffect: 'none',
        },
        type: heal,
        targeting: single,
        dmg: -75,
        multiplier: int,
        effects: [{effect: 'mediumHealOverTime', chance: 100}],
        cost: {hp: 0, mp: 60},
        accuracy: Infinity,
        attacks: 1,
    },
    greaterAreaHeal: {
        name: `Greater Area Healing`,
        desc: `[attacker] heals all allies greatly.`,
        animation: { 
            range: 'fullScreen',
            projectile: 'areaHealingLight',
            hitEffect: 'none',
        },
        type: heal,
        targeting: aoe,
        dmg: -50,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 150},
        accuracy: Infinity,
        attacks: 1,
    }
};
const selfBuffs = { // self enhancement
    lesserPhysicalEnhancement: {
        name: `Lesser Physical Enhancement`, 
        desc: `[attacker] enhances their physical abilities temporarily.`, 
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'buff',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'lesserPhysicalEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 15}, 
        accuracy: none,
    },
    raiseGuard: {
        name: `Raise Guard`,
        desc: `[attacker] raises [pronoun] guard, reducing damage from all attacks in the next round.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'defenceUp',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'raiseGuard', chance: 100}],
        cost: {hp: 0, mp: 5},
        accuracy: none,
        attacks: 1,
    },
    cower: {
        name: `Cower in Fear`,
        desc: `[attacker] cowers in fear, channeling mana into [pronoun] armour to reist more damage.`,
        animation: { 
            range: 'self',
            projectile: 'none',
            hitEffect: 'defenceUp',
        },
        type: none, 
        targeting: selfOnly,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'lesserArmourReinforcement', chance: 100}],
        cost: {hp: 0, mp: 25},
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
            projectile: 'fireSpear',
            hitEffect: 'smallExplosion',
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
            projectile: 'smallFireball',
            hitEffect: 'smallExplosion',
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
            hitEffect: 'smallExplosion',
        },
        type: magic,
        targeting: aoe,
        dmg: 7,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 100},
        accuracy: Infinity,
        attacks: 3,
    },
    shadowLance: {
        name: `Shadow Lance`,
        desc: `[attacker] launches a shadow lance constructed from mana at the targeted enemy. It can penetrate through barriers and armour.`,
        animation: { 
            range: 'ranged',
            projectile: 'shadowLance',
            hitEffect: 'smallDarkExplosion',
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
            projectile: 'magicBall',
            hitEffect: 'mediumExplosion',
        },
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
        desc: `[attacker] releases a burst of dark energy at the enemies.`,
        animation: { 
            range: 'ranged',
            projectile: 'shadowball',
            hitEffect: 'smallDarkExplosion',
        },
        type: magic,
        targeting: aoe,
        dmg: 40,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 150},
        accuracy: 100,
        attacks: 1,
    },
    shadowVeil: {
        name: `Shadow Veil`,
        desc: `[attacker] surrounds the targeted ally in a barrier, protecting them from all damage.`,
        animation: { 
            range: 'ranged',
            projectile: 'shadowball',
            hitEffect: 'defenceUp',
        },
        type: magic,
        targeting: single,
        dmg: 0,
        multiplier: int,
        effects: [{effect: 'immortality', chance: 100}],
        cost: {hp: 0, mp: 300},
        accuracy: Infinity,
        attacks: 1,
    },
};
const godlySkills = { // very op skills
    debugFist: {
        name: `Debug Fist`, 
        desc: `[attacker] punches the targeted enemy several times to debug the code.`, 
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'physicalHit',
            moveSpeed: 20,
            projectileSpeed: 10,
            smooth: false,
        },
        type: physical, 
        targeting: multi, 
        dmg: 10, 
        multiplier: str, 
        effects: [], 
        cost: {hp: 0, mp: 0}, 
        accuracy: 100, 
        attacks: 30, 
    },
    ascendedSlash: {
        name: `Slash`,
        desc: `[attacker] unleashes a powerful slash imbued with divine energy that pierces through armour.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
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
    rapidStrikes: {
        name: `Rapid Strikes`,
        desc: `[attacker] performs a series of rapid strikes on the targeted enemy.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
        },
        type: normal,
        targeting: single,
        dmg: 50,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 0},
        accuracy: 100,
        attacks: 7,
    },
    swordDance: {
        name: `Sword Dance`,
        desc: `[attacker] dances through enemies, striking all of them.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
            moveSpeed: 5,
            projectileSpeed: 10,
        },
        type: normal,
        targeting: multi,
        dmg: 35,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 425},
        accuracy: 100,
        attacks: 45,
    },
    realitySlash: {
        name: `Reality Slash`,
        desc: `[attacker] charges [pronoun] sword with a vast amount of energy, releasing a slash that cuts through reality itself.`,
        animation: { 
            range: 'melee',
            projectile: 'swordSwing',
            hitEffect: 'none',
        },
        type: piercing,
        targeting: single,
        dmg: 1250,
        multiplier: str,
        effects: [],
        cost: {hp: 0, mp: 600},
        accuracy: Infinity,
        attacks: 1,
    },
    superCharge: {
        name: `Super Charge`,
        desc: `[attacker] super charges [pronoun] body with aura, greatly increasing attack power and defence as well as recovering some health.`,
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
    },
    warCry: {
        name: `War Cry`,
        desc: `[attacker] lets out a powerful war cry, boosting the attack of all allies.`,
        animation: { 
            range: 'allUnits',
            projectile: 'none',
            hitEffect: 'attackUp',
        },
        targeting: aoe,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'attackBoost', chance: 100}], 
        cost: {hp: 0, mp: 150},
        accuracy: none,
        attacks: 1,
    },
    battlefieldCommand: {
        name: `Battlefield Command`,
        desc: `[attacker] commands the battlefield, boosting the attack and defense of all allies.`,
        animation: { 
            range: 'allUnits',
            projectile: 'none',
            hitEffect: 'statUp',
        },
        targeting: aoe,
        dmg: 0,
        multiplier: none,
        effects: [{effect: 'mediumPhysicalEnhancement', chance: 100}], 
        cost: {hp: 0, mp: 125},
        accuracy: none,
        attacks: 1,
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
        dmg: 750,
        multiplier: int,
        effects: [],
        cost: {hp: 0, mp: 100},
        accuracy: 100,
        attacks: 1,
    },
};
const miscSkills = {
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
    brag: {
        name: `Brag`,
        desc: `[attacker] brags about [pronoun] accomplishments, irritating the targeted enemy.`,
        animation: { 
            range: 'ranged',
            projectile: 'musicNotes',
            hitEffect: 'none',
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
data.skills = {...debuffEffects, ...buffEffects, ...basicPhysicalAttacks, ...basicSwordAttacks, ...healingSkills, ...selfBuffs, ...magicAttacks, ...godlySkills, ...miscSkills };
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
    return `<button ${buttonData}><span id="up"><p id="noPadding" class="characterTitle">${title}</p><img src="${character.pfp}" class="characterIcon"></span>${desc}</button>`;
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
                case 'dmgnum':
                    document.getElementById(value.id).style.top = modifyPx(document.getElementById(value.id).style.top, num => num - 2);
                    //console.log(document.getElementById(value.id).style.top);
                    if (document.getElementById(value.id).style.opacity == 0) document.getElementById(value.id).style.opacity = 1; // somehow it defaults to 0 ig
                    if (value.life < 25) document.getElementById(value.id).style.opacity *= 0.9;
                    //console.log(document.getElementById(value.id).style.opacity);
                    break;
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
        await new Promise(resolve => setTimeout(resolve, 25));
    }
};

async function fakeMoveElement(card, targetCard, steps, reset=false) {
    let startingPos = getCoordsManual(card);
    let pos = getCoordsManual(targetCard);
    if (!reset) pos = vMath(pos, {x: 0, y: 210}, '+');
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
        element.style.top = `${parseFloat(element.style.top.slice(0, -2))+velocity.y}px`;
        element.style.left = `${parseFloat(element.style.left.slice(0, -2))+velocity.x}px`;
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

async function attackAnimation(user, skill, target) {
    switch (skill.animation.range) {
        case 'melee': // move the user to the target
            await fakeMoveElement(user, target, skill.animation.moveSpeed);
            break;
        case 'ranged': // move a projectile to target
            break;
        case 'self':
            break;
        case 'allUnits':
            break;
        case 'fullScreen':
            break;
        default:
            console.error(`Unknown range: ${skill.animation.range}`);
    };
};

async function changeStat(target, effect) {
    if (effect.change == 0) return;
    //print(`final ${final}`);                                                                                                                                                                            
    let time = 1000;
    let steps = 20;
    //console.log(target);
    //let position = readID(target.id);
    //console.log(target);
    //console.log(effect.change);
    //console.log(effect.change/steps);
    for (let i = 0; i < steps; i++) {
        target[effect.stat] += effect.change/steps;
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

function dmgNumber(card, dmg) {
    let particle = {
        id: generateId(),
        life: 70,
        type: 'dmgnum',
    };
    console.log(particle);
    let html = `<div id="${particle.id}" class="dmgNum">${dmg}</div>`;
    addhtml('effects', html);
    let coords = getCoords(card.id);
    document.getElementById(particle.id).style.top = `${coords.y+randint(-60, 60)}px`;
    document.getElementById(particle.id).style.left = `${coords.x-60+randint(-50, 50)}px`;
    game.gamestate.particles[particle.id] = particle;
    console.log(document.getElementById(particle.id));
    console.log(document.getElementById('game'));
};

async function simulateSingleAttack(user, skill, target) {
    let dmg = Math.floor(skill.dmg > 0? Math.max(0, calcResistance(skill.type, skill.dmg * (skill.multiplier? user[skill.multiplier] * (skill.multiplier == int? 0.025 : 1) : 1), target)) : skill.dmg);
    await attackAnimation(user, skill, target);
    print('done');
    changeStat(target, {stat: 'hp', change: -dmg});
    print(`damage ${dmg}`);
    dmgNumber(target, dmg)
    return dmg;
};

async function simulateSkill(user, skill, target=undefined) {
    console.log('skill used');
    if (skill.cost.hp) {
        changeStat(user, {stat: 'mp', change: -skill.cost.mp}); 
        await changeStat(user, {stat: 'hp', change: -skill.cost.hp});
    } else if (skill.cost.mp) {
        await changeStat(user, {stat: 'mp', change: -skill.cost.mp}); 
    }
    await sleep(10);
    await fakeMoveElement(user, target, 100);
    switch (skill.targeting) {
        case aoe:
            for (let i = 0; i < skill.attacks; i++) {
                if (target.id[0] == 'E') { // target is enemy team
                    for (let i = 0; i < game.gamestate.battleState.ef; i++) {
                        simulateSingleAttack(user, skill, game.gamestate.battleState.ef[i]);
                    }
                    for (let i = 0; i < game.gamestate.battleState.eb; i++) {
                        simulateSingleAttack(user, skill, game.gamestate.battleState.eb[i]);
                    }
                } else { // target is player team
                    for (let i = 0; i < game.gamestate.battleState.pf; i++) {
                        simulateSingleAttack(user, skill, game.gamestate.battleState.pf[i]);
                    }
                    for (let i = 0; i < game.gamestate.battleState.pb; i++) {
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
                print(chosen.id);
                await simulateSingleAttack(user, skill, chosen);
                await sleep(100);
            }
            break;
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
    await fakeMoveElement(user, user, 100, true);
};

function selectAction(id) {
    let card = selectCard(id);
    if (!card.ap) return;
    let cardHtml = document.getElementById(id);
    for (let i = 0; i < game.gamestate.battleState.pb.length; i++) {
        print(`${id.slice(0, 2)}${i}ID`);
        document.getElementById(`${id.slice(0, 2)}${i}ID`).className = document.getElementById(`${id.slice(0, 2)}${i}ID`).className.replace(` selected`, ``);
    }
    for (let i = 0; i < game.gamestate.battleState.pf.length; i++) {
        document.getElementById(`${id.slice(0, 2)}${i}ID`).className = document.getElementById(`${id.slice(0, 2)}${i}ID`).className.replace(` selected`, ``);
    }
    cardHtml.className += ` selected`;
    game.gamestate.battleState.tempStorage.activeCardId = id;
    skills(card);
};

function selectTarget(id) {
    let targetedCard = selectCard(id);
    let activeCard = selectCard(game.gamestate.battleState.tempStorage.activeCardId);
    let skillUsed = data.skills[game.gamestate.battleState.tempStorage.skillId];
    print(targetedCard);
    print(activeCard);
    print(skillUsed);
    
    game.gamestate.battleState.tempStorage = {};
    simulateSkill(activeCard, skillUsed, targetedCard);
    renderCards(`selectAction`);
};

function useSkill(skillId=undefined) {
    let skill = data.skills[skillId];
    print(`skill selected`);
    print(skill);
    document.getElementById(`buttonGridInventory`).innerHTML = document.getElementById(`buttonGridInventory`).innerHTML.replace(` selected`, ``);
    document.getElementById(skill.name).className += ` selected`;
    if (skill.targeting == selfOnly || skill.targeting == summon) {
        simulateSkill(selectCard(game.gamestate.battleState.tempStorage.activeCardId), skill);
    } else {
        game.gamestate.battleState.tempStorage.skillId = skillId;
        renderCards(`selectTarget`, `selectTarget`);
    }
};

async function battle() {
    let battleState = game.gamestate.battleState;
    console.log(game.gamestate.battleState);
    let prev = battleState.turn;
    while (game.gamestate.inBattle) {
        switch(battleState.turn) {
            case `player`:
                renderCards(`selectAction`);
                for (let i = 0; i < game.gamestate.player.team.length; i++) {
                    game.gamestate.player.team[i].ap = 1;
                }
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
            handleEffects();
            //console.log(`Battle: Waiting`);
        }
    }
};

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
        startWave();
        renderCards();
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
    let battleState = game.gamestate.battleState;
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        game.gamestate.player.team[i].hpMax = game.gamestate.player.team[i].hp;
        game.gamestate.player.team[i].mpMax = game.gamestate.player.team[i].mp;
        game.gamestate.player.team[i].ap = 1;
        battleState.pb.push(game.gamestate.player.team[i]);
    }
    game.gamestate.inBattle = true;
    game.gamestate.battleState.wave = 0;
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
    print(getComputedStyle(document.getElementById(id)).minWidth);
    if (document.getElementById(id)) return parseFloat(getComputedStyle(document.getElementById(id)).minWidth.slice(0, -2))/60;
    else console.error(`can not find card id: ${id}`);
};

function updateBar(id, percent, value=-1000000000) {
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

function focusCharacter(characterId) { //TODO: fix attack effects
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
                switch (data.skills[character.skills[i]].effects[j].id) { // right here gotta fix this somehow
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

function skills(card=undefined) {
    if (card) {
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
    } else {
        replacehtml(`nav`, `<button onclick="inventory()" class="unFocusedButton"><h3>Inventory</h3></button><button onclick="skills()" class="focusedButton"><h3>Skills</h3></button>`);
        replacehtml(`money`, `<span>Select Card</span>`);
        replacehtml(`grid`, `<div id="buttonGridInventory"></div>`);
    }
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

console.log('loaded');
