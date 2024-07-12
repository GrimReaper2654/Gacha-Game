/*
------------------------------------------------------Changelog------------------------------------------------------
Rarities:
normal --> uncommon --> rare --> super rare --> epic --> legendary --> godly --> EX
grey        green       blue      purple         red       gold       diamond   black
 0            1          2          3             4          5           6        7
 x1         x1.3       x1.7       x2.2           x3        x3.8         x5      x6.5

---------------------------------------------------------------------------------------------------------------------
*/

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
deepFreeze(data);
console.log(data);

// Loading savegames
var game = {
    interface: `home`, // obsolete
    gamestate: undefined,
    keypresses: [], // obsolete
    mousepos: {x: 0, y: 0}, // obsolete
    forceMobile: false,
    forceDesktop: false,
};

// Steal Data (get inputs)
var mousepos = {x:0,y:0};
var display = {x: window.innerWidth, y: window.innerHeight};

// The support functions that might not be necessary
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
    let pos = readID(card.id);
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
};

function unPixel(px) {
    return parseFloat(px.slice(0, -2));
};

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
    display = {x: window.innerWidth, y: window.innerHeight};
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

function createCharacterCard(character, id=undefined, onClick=undefined) {
    let title = `<strong>${character.name}</strong>`;
    let buttonData = `${onClick ? `onclick="${onClick}" ` : ``}class="smallCharacterButton rank${character.rarity}Button" id="${id}"`;
    let desc = `<span id="left"><div id='hpBar'><div id="${id}hp" class="hpBarInner"></div></div><img src="assets/redCross.png" class="smallIcon"><span id="${id}hpDisplay">${Math.floor(character.hp)}</span></span><span id="right"><div id='mpBar'><div id="${id}mp" class="mpBarInner"></div></div><span id="${id}mpDisplay">${Math.floor(character.mp)}</span><img src="assets/blueStar.png" class="smallIcon"></span>`;
    return `<button ${buttonData}>${character.ap > 0? `<div id="cornerIcon"><span id="down">${character.ap > 99? `∞` : (character.ap > 1? character.ap : `!`)}</span></div>` : ``}<span id="up"><p id="noPadding" class="characterTitle">${title}</p><img src="${character.pfp}" class="characterIcon"></span>${desc}</button>`;
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

const countValidProperties = (obj) => {
    return Object.keys(obj).filter(key => {
        const value = obj[key];
        return value !== undefined && value !== null && value !== false && value !== 0 && value !== "" && !Number.isNaN(value);
    }).length;
}; window.countValidProperties = countValidProperties;
  
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
}; window.handleParticles = handleParticles;

async function handleEffects() {
    if (countValidProperties(game.gamestate.particles) == 0) return
    for (let i = 0; i < 9; i++) {
        handleParticles(game.gamestate.particles);
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
    document.getElementById(id).style.left = `${document.getElementById('battleScreen').getBoundingClientRect().width/2 - 325}px`;
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
        document.getElementById(id).style.opacity = 0.01;
        document.getElementById(id).style.position = `absolute`;
        await sleep(50); // let stuff load
        //console.log(document.getElementById(id).offsetHeight, document.getElementById(id).offsetWidth);
        document.getElementById(id).style.top = `${pos.y+95-document.getElementById(id).offsetHeight/2}px`;
        document.getElementById(id).style.left = `${pos.x+75-document.getElementById(id).offsetWidth/2}px`;
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
    document.getElementById(id).style.opacity = 0.01;
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
    
}; window.fakeMoveCard = fakeMoveCard;

async function changeStat(target, effect={stat: '', change: 0}, time=750) {
    if (effect.change == 0) return;
    //console.log(`final ${final}`);                                                                                                                                                                            
    let steps = 20;
    //console.log(target);
    //let position = readID(target.id);
    //console.log(target);
    //console.log(effect.change);
    //console.log(effect.change/steps);
    for (let i = 0; i < steps; i++) {
        target[effect.stat] = Math.min(target[effect.stat] + effect.change/steps, target[effect.stat+'Max']);
        //game.gamestate.battleState[position.row][position.pos][effect.stat] += effect.change/steps; // should handle multiple changeStat functions running for the same bar, however, floating point errors
        //console.log(Math.ceil(target[effect.stat]));
        //console.log(i);
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
}; window.changeStat = changeStat;

function readID(id) {
    return {
        row: id.slice(0, 2).toLowerCase(),
        pos: parseInt(id.slice(2, -2))
    };
}; window.readID = readID;

function selectCard(id) {
    let pos = readID(id)
    return game.gamestate.battleState[pos.row.toLowerCase()][pos.pos];
}; window.selectCard = selectCard;

function checkAllDead() {
    game.gamestate.battleState.eb = checkDead(game.gamestate.battleState.eb);
    game.gamestate.battleState.ef = checkDead(game.gamestate.battleState.ef);
    game.gamestate.battleState.pb = checkDead(game.gamestate.battleState.pb);
    game.gamestate.battleState.pf = checkDead(game.gamestate.battleState.pf);
}; window.checkAllDead = checkAllDead;

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
}; window.calcResistance = calcResistance;

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
        let miss = randint(0, 100) > effect.accuracy;
        console.log(miss);
        if (!miss) changeStat(card, {stat: 'hp', change: -effect.dmg}, 500);
        dmgNumber(card, miss? 0 : calcResistance(effect.type, effect.dmg, card), miss);
    }
    if (effect.change.hp) {
        changeStat(card, {stat: 'hp', change: effect.change.hp}, 500);
        dmgNumber(card, -effect.change.hp);
    }
    if (effect.change.mp) {
        changeStat(card, {stat: 'mp', change: effect.change.mp}, 500);
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
}; window.dmgNumber = dmgNumber;

async function simulateSingleAttack(user, skill, target) {
    let number = true;
    let miss = false;
    let dmg = skill.type == heal? skill.dmg : Math.floor(skill.dmg > 0? Math.max(0, calcResistance(skill.type, skill.dmg * (skill.multiplier? user[skill.multiplier] * (skill.multiplier == int? 0.01 : 1) : 1), target)) : skill.dmg);
    if (skill.dmg == 0 || skill.type == effect) number = false; // skills that do not intend to do damage should not have damage numbers
    else if (skill.accuracy != Infinity && randint(0,100) > skill.accuracy) {
        dmg = 0;
        miss = true;
    }
    let done = false;
    let offset = undefined;
    if (skill.animation.range === fullScreen) {
        aoeEffect(skill.animation.projectile, target.id[0]);
        console.log('changing stats');
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
    for (let i = 0; i < skill.effects.length; i++) {
        if (randint(0,100) <= skill.effects[i].chance) {
            let effect = JSON.parse(JSON.stringify(data.effects[skill.effects[i].effect]));
            effect.initialised = false;
            console.log(effect);
            target.effects.push(calculateEffect(target, effect));
            console.log(target);
        }
    }
    if (!done) {
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
        let buttonGridHtml = `<div id="stats"><p id="noPadding" class="statsText">  <img src="assets/lightning.png" class="smallIcon"> Actions Left:    ${card.ap > 99? `∞` : card.ap}<br>  <img src="assets/sword.png" class="smallIcon"> Strength:        ×${card.str}<br>  Intelligence:      ${card.int}<br>  <img src="assets/shield.png" class="smallIcon"> Physical Armour: ${card.armour.physical[0]}, ${card.armour.physical[1]}%<br>  <img src="assets/blueShield.png" class="smallIcon"> Magic Armour:    ${card.armour.magic[0]}, ${card.armour.magic[1]}%</p></div>`;
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
            let desc = `${data.skills[card.skills[i]].desc.replace(`[attacker]`, card.name).replace(`[pronoun]`, card.gender == female? `her` : `his`)}<br>${dmg == 0? `` : `${dmg > 0? `Damage:` : `Heal:`} <img src="assets/${dmg > 0? `lightning` : `greenCross`}.png" class="smallIcon"> ${dmg > 0? dmg : -dmg} × ${data.skills[card.skills[i]].attacks}<br>`}<img src="assets/explosion.png" class="smallIcon"> ${data.skills[card.skills[i]].targeting}<br>${(data.skills[card.skills[i]].cost.hp || data.skills[card.skills[i]].cost.mp)? `Costs:` : ``} ${data.skills[card.skills[i]].cost.hp ? `<img src="assets/redCross.png" class="smallIcon"> ${data.skills[card.skills[i]].cost.hp}` : ``} ${data.skills[card.skills[i]].cost.mp ? `<img src="assets/blueStar.png" class="smallIcon"> ${data.skills[card.skills[i]].cost.mp}` : ``}`;
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
    resize();
}; window.skills = skills;

async function simulateSkill(user, skill, target=undefined) { 
    console.log('skill used');
    user.ap--;
    replacehtml(`main`, `<button id="endTurnButton" class="endTurn disabled">End Turn</button>`);
    renderCards();
    skills(user, false);
    if (skill.cost.hp) {
        changeStat(user, {stat: 'mp', change: -skill.cost.mp}); 
        await changeStat(user, {stat: 'hp', change: -skill.cost.hp});
    } else if (skill.cost.mp) {
        await changeStat(user, {stat: 'mp', change: -skill.cost.mp}); 
    }
    await sleep(10);
    if (skill.animation.range === melee) await fakeMoveCard(user, target, 100);
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
                let chosen = randchoice([0,1]) ? target : randchoice(targets);
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

            break;
        default:
            console.error(`ERROR: unknown skill targeting: ${skill.targeting}`);
    }
    if (skill.animation.range === melee)  {
        if (skill.animation.smooth) await sleep(750 + skill.attacks * 5);
        await fakeMoveCard(user, user, 150, true);
    }
    if ((skill.animation.smooth || skill.targeting == aoe) && skill.animation.range != 'melee') { // estimate attack time (pretty reliable ngl)
        console.log('wait', Math.max(0, skill.attacks * (skill.animation.projectileDelay + skill.animation.moveSpeed)-2500) + (skill.animation.projectile != 'none'? skill.animation.projectileSpeed*10 : 0));
        await sleep(Math.max(0, skill.attacks * (skill.animation.projectileDelay + skill.animation.moveSpeed) - 2500));
        if (skill.animation.projectile != 'none') await sleep(skill.animation.projectileSpeed * 20);
        console.log('expected attack duration');
    }
    console.log('buffer start');
    await sleep(1000);
    console.log('buffer end');
    checkAllDead();
    renderCards(`selectAction`, `selectAction`);
    replacehtml(`main`, `<button onclick="enemyTurn()" id="endTurnButton" class="endTurn">End Turn</button>`);
    skills(user, false);
}; window.simulateSkill = simulateSkill;

function selectAction(id) {
    let card = selectCard(id);
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
    let targetedCard = selectCard(id);
    let activeCard = selectCard(game.gamestate.battleState.tempStorage.activeCardId);
    let skillUsed = data.skills[game.gamestate.battleState.tempStorage.skillId];
    //console.log(targetedCard);
    //console.log(activeCard);
    //console.log(skillUsed);
    
    game.gamestate.battleState.tempStorage = {};
    simulateSkill(activeCard, skillUsed, targetedCard);
}; window.selectTarget = selectTarget;

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
}; window.repositionCard = repositionCard;

function useSkill(skillId=undefined) {
    let skill = data.skills[skillId];
    console.log(`skill selected`);
    console.log(skill);
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
}; window.checkDead = checkDead;

async function handleEnemyAttack(enemy) {
    let skillToUse = data.skills[randchoice(enemy.skills)];
    console.log(skillToUse);
    let target = game.gamestate.battleState.pf.length > 0? randchoice(game.gamestate.battleState.pf) : randchoice(game.gamestate.battleState.pb);
    if (skillToUse.instantUse) target = enemy;
    await simulateSkill(enemy, skillToUse, target);
}; window.handleEnemyAttack = handleEnemyAttack;

function playerTurn() {
    for (let i = 0; i < game.gamestate.player.team.length; i++) {
        game.gamestate.player.team[i].ap = 1; 
        if (game.gamestate.player.team[i].additionalAp) game.gamestate.player.team[i].ap += game.gamestate.player.team[i].additionalAp;
    }
    replacehtml(`main`, `<button onclick="enemyTurn()" id="endTurnButton" class="endTurn">End Turn</button>`);
    renderCards(`selectAction`, `selectAction`);
    resize();
}; window.playerTurn = playerTurn;

async function enemyTurn() {
    console.log('player turn ended, enemy attacking');
    replacehtml(`main`, `<button id="endTurnButton" class="endTurn disabled">End Turn</button>`);
    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
        game.gamestate.battleState.eb[i].ap = 1;
    }
    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
        game.gamestate.battleState.ef[i].ap = 1;
    }
    renderCards();
    resize();
    for (let i = 0; i < game.gamestate.battleState.ef.length; i++) {
        await handleEnemyAttack(game.gamestate.battleState.ef[i]);
    }
    for (let i = 0; i < game.gamestate.battleState.eb.length; i++) {
        await handleEnemyAttack(game.gamestate.battleState.eb[i]);
    }
    console.log('end enemy turn, start handle effects');
    handleStatusEffects();
    regenMana();
    await sleep(550);
    game.gamestate.battleState.eb = checkDead(game.gamestate.battleState.eb);
    game.gamestate.battleState.ef = checkDead(game.gamestate.battleState.ef);
    game.gamestate.battleState.pb = checkDead(game.gamestate.battleState.pb);
    game.gamestate.battleState.pf = checkDead(game.gamestate.battleState.pf);
    console.log('end handle effects');
    playerTurn();
}; window.enemyTurn = enemyTurn;

async function battle() {
    playerTurn();
    while (1) {
        await new Promise(resolve => setTimeout(resolve, 250));
        handleEffects();
        if (!game.gamestate.inBattle) break;
    }
}; window.battle = battle;

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

async function runDungeon() {
    let dungeon = data.dungeons[game.gamestate.dungeon];
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
}; window.runDungeon = runDungeon;

function startDungeon() {
    let dungeon = data.dungeons[game.gamestate.dungeon];
    exitFocus();
    replacehtml(`bac`, `<img src="${dungeon.innerBac}" id="bigBacImg"><div id="battleScreen"></div>`); // battle screen is in background as it can be scrolled
    replacehtml(`main`, ``);
    // scroll the page to centre the battle
    document.getElementById(`bac`).scrollLeft = 185;
    inventory();
    replacehtml(`battleScreen`, `<div id="enemyBackline" class="battleCardContainer"></div><div id="enemyFrontline" class="battleCardContainer"></div><div id="gameHints"></div><div id="playerFrontline" class="battleCardContainer"></div><div id="playerBackline" class="battleCardContainer"></div><div id="effects"></div><div id="dialogueBox"></div>`);
    replacehtml(`main`, `<button onclick="enemyTurn()" id="endTurnButton" class="endTurn">End Turn</button>`);
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
    game.gamestate.battleState.wave = 0;
    resize();
    inventory();
    console.log('dungeon started');
    runDungeon();
}; window.startDungeon = startDungeon;

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
}; window.rank = rank;

function resize() { // css calc is sometimes not enough (or I have a skill issue)
    // due to my lack of css knowledge or plain laziness I have devised a system to change css styles without needing to edit style.css
    console.log('resized');
    if ((isMobileDevice() || game.forceMobile) && !game.forceDesktop) { // crappy mobile version
        document.body.style['overflow-x'] = `hidden`;
        document.body.style['overflow-y'] = `hidden`;
        let sidebarWidth = (game.gamestate && game.gamestate.inBattle)? 740 : Math.max(740, Math.floor((display.x*2 - display.y*2 - 60) / 340) * 340 + 60);
        let battleWidth = Math.max(display.x*2 - sidebarWidth, 1200);
        let batleHeight = Math.max(display.y*2, 1100);
        let battleCardsPosition = (battleWidth - 1020) / 2;
        if (document.getElementById('game')) document.getElementById('game').style['zoom'] = `0.5`;
        if (document.getElementById('sidebar')) document.getElementById('sidebar').style['width'] = `${sidebarWidth}px`;
        if (document.getElementById('sidebar')) document.getElementById('sidebar').style['height'] = `200vh`;
        if (document.getElementById('bac')) document.getElementById('bac').style['max-width'] = `${display.x*2 - sidebarWidth}px`;
        if (document.getElementById('bac')) document.getElementById('bac').style['max-height'] = `${display.y*2}px`;
        if (document.getElementById('bacImg')) document.getElementById('bacImg').style[(display.x*2 - sidebarWidth > display.y*2)? 'width' : 'height'] = `${Math.max(display.x*2 - sidebarWidth, display.y*2)}px`;
        if (document.getElementById('bacImg')) document.getElementById('bacImg').style[(display.x*2 - sidebarWidth < display.y*2)? 'width' : 'height'] = `auto`;
        if (document.getElementById('nav')) document.getElementById('nav').style['zoom'] = `2`;
        if (document.getElementById('money')) document.getElementById('money').style['zoom'] = `2`;
        if (document.getElementById('buttonGridInventory')) document.getElementById('buttonGridInventory').style['zoom'] = `2`;
        if (document.getElementById('dungeonName')) document.getElementById('dungeonName').style['width'] = `${display.x*2 - sidebarWidth}px`;
        if (document.getElementById('dungeonName')) document.getElementById('dungeonName').style['transform'] = `scale(1.5, 1.5)`;
        if (document.getElementById('dungeonNav')) document.getElementById('dungeonNav').style['width'] = `${display.x*2 - sidebarWidth}px`;
        if (document.getElementById('prevDungeon')) document.getElementById('prevDungeon').style['left'] = `20px`;
        if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['left'] = `${display.x*2 - sidebarWidth - 90}px`;
        if (document.getElementById('prevDungeon')) document.getElementById('prevDungeon').style['top'] = `90vh`;
        if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['top'] = `90vh`;
        if (document.getElementById('prevDungeon')) document.getElementById('prevDungeon').style['transform'] = `scale(1.5, 2.25)`;
        if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['transform'] = `scale(-1.5, 2.25)`;
        if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style['left'] = `${((display.x*2 - sidebarWidth) - 685) / 2}px`;
        if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style['top'] = `calc(200vh - 235px)`;
        if (document.getElementById('playButton')) document.getElementById('playButton').style['left'] = `${((display.x*2 - sidebarWidth) - 200) / 2}px`;
        if (document.getElementById('playButton')) document.getElementById('playButton').style['top'] = `calc(200vh - 350px)`;
        if (document.getElementById('playButton')) document.getElementById('playButton').style['transform'] = `scale(1.5, 1.5)`;
        if (document.getElementById('focus')) document.getElementById('focus').style['position'] = `absolute`;
        if (document.getElementById('focus')) document.getElementById('focus').style['top'] = `20px`;
        if (document.getElementById('focus')) document.getElementById('focus').style['left'] = `20px`;
        if (document.getElementById('focus')) document.getElementById('focus').style['height'] = `calc(200vh - 40px)`;
        if (document.getElementById('focus')) document.getElementById('focus').style['width'] = `${display.x*2 - sidebarWidth - 40}px`;
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
        if (document.getElementById('endTurnButton')) document.getElementById('endTurnButton').style.bottom = `20px`;
    } else {
        let sidebarWidth = (game.gamestate && game.gamestate.inBattle)? 370 : Math.max(370, Math.ceil((display.x - display.y - 30) / 170) * 170 + 30);
        let battleWidth = Math.max(display.x - sidebarWidth, 1200);
        let batleHeight = Math.max(display.y, 1100);
        let battleCardsPosition = (battleWidth - 1020) / 2;
        if (document.getElementById('sidebar')) document.getElementById('sidebar').style.width = `${sidebarWidth}px`;
        if (document.getElementById('bac')) document.getElementById('bac').style['max-width'] = `${display.x - sidebarWidth}px`;
        if (document.getElementById('bac')) document.getElementById('bac').style['max-height'] = `100vh`;
        if (document.getElementById('bacImg')) document.getElementById('bacImg').style['height'] = `100vh`;
        if (document.getElementById('dungeonName')) document.getElementById('dungeonName').style['width'] = `${display.x - sidebarWidth}px`;
        if (document.getElementById('dungeonNav')) document.getElementById('dungeonNav').style['width'] = `${display.x - sidebarWidth}px`;
        if (document.getElementById('nextDungeon')) document.getElementById('nextDungeon').style['left'] = `${display.x - sidebarWidth - 60}px`; // grrrr there has to be a better way
        if (document.getElementById('teamSelection')) document.getElementById('teamSelection').style.left = `${((display.x - sidebarWidth) - 685) / 2}px`;
        if (document.getElementById('playButton')) document.getElementById('playButton').style.left = `${((display.x - sidebarWidth) - 200) / 2}px`;
        if (document.getElementById('focus')) document.getElementById('focus').style.width = `${display.x - sidebarWidth - 10}px`;
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
        if (value > -1000000000) document.getElementById(id+`Display`).innerHTML = Math.floor(value); // scuffed but necessary (idk what this does anymore)
    }
    else console.error(`can not find card id: ${id}`);
}; window.updateBar = updateBar;

function clearData() {
    localStorage.removeItem('GatchaGameData');
    console.log('cleared previous data');
}; window.clearData = clearData;

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
}; window.removeFromTeam = removeFromTeam;

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
}; window.inventorySellItem = inventorySellItem;

function inventoryBuyItem(itemId) {
    let item = game.gamestate.player.inventory[itemId];
    item.quantity += 1;
    game.gamestate.player.money -= item.purchacePrice;
    focusItem(itemId);
    inventory();
}; window.inventoryBuyItem = inventoryBuyItem;

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
}; window.focusItem = focusItem;

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
}; window.focusCharacter = focusCharacter;

function exitFocus() {
    document.getElementById('focus').style.display = `none`;
}; window.exitFocus = exitFocus;

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
}; window.updateTeam = updateTeam;

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
    resize();
}; window.pull = pull;

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
    resize();
}; window.inventory = inventory;

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
    resize();
}; window.characters = characters;

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
    resize();
}; window.shop = shop;

async function startGame() {
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
    await sleep(100);
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
}; window.startGame = startGame;

function setDungeon(dungeon) {
    game.gamestate.dungeon = dungeon;
    replacehtml(`bac`, `<img src="${data.dungeons[game.gamestate.dungeon].outerBac}" id="bacImg"> `);
    replacehtml(`dungeonTitle`, `<div id="dungeonName">${data.dungeons[game.gamestate.dungeon].name}</div>`);
    let navHtml = `<div id="prevDungeon" class="leftNextButtonBack"><button class="leftNextButton${data.dungeons[game.gamestate.dungeon-1]? `` : ` disabled`}" ${data.dungeons[game.gamestate.dungeon-1]? `onclick="setDungeon(${game.gamestate.dungeon-1})"` : ``}></button></div> <div id="nextDungeon" class="rightNextButtonBack"><button class="rightNextButton${data.dungeons[game.gamestate.dungeon+1]? `` : ` disabled`}" ${data.dungeons[game.gamestate.dungeon+1]? `onclick="setDungeon(${game.gamestate.dungeon+1})"` : ``}></button></div>`;
    replacehtml(`dungeonNav`, navHtml);
    resize();
}; window.setDungeon = setDungeon;

function home() {
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
    setDungeon(game.gamestate.dungeon);
    resize();
    updateTeam();
}; window.home = home;

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
}; window.main = main;

console.error('ERROR: The operation completed successfully.');