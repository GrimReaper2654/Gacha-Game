/*
------------------------------------------------------Changelog------------------------------------------------------
Rarities:
normal --> uncommon --> rare --> super rare --> epic --> legendary --> godly --> EX
grey        green       blue      purple         red       gold       diamond   black



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

function replacehtml(text) {
    document.getElementById("game").innerHTML = text;
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
            inventory: [],
            characters: [`Eco`],
            team: [undefined, undefined, undefined, undefined],
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
            },
            {
                name: `Starter Card Pack`,
                cost: 80,
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
            },
            {
                name: `Default Card Pack`,
                cost: 100,
                attempts: 10,
                rates: {
                    itemCharacterBias: 0.9,
                    normal: 0.8,
                    uncommon: 0.13,
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
                rarity: N,
                gender: female,
                pfp: undefined,
                hp: [80,0,0,0,0,0,0,0],
                mp: [100,0,0,0,0,0,0,0],
                str: [0.8,0,0,0,0,0,0,0],
                int: [20,0,0,0,0,0,0,0],
                mpRegen: [20,0,0,0,0,0,0,0],
                skils: ['slap', 'lesserHeal', 'mediumHeal', 'lesserAreaHeal'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
            Yuki: { // melee dps
                name: `Yuki`,
                description: `Yuki recently graduated from the kingdom's swordsmen academy. She's not inexperienced with the sword and knows how to use mana to strengthen her attacks.`,
                rarity: N,
                gender: female,
                pfp: undefined,
                hp: [100,0,0,0,0,0,0,0],
                mp: [50,0,0,0,0,0,0,0],
                str: [1,0,0,0,0,0,0,0],
                int: [15,0,0,0,0,0,0,0],
                mpRegen: [5,0,0,0,0,0,0,0],
                skils: ['slash', 'heavyStrike', 'raiseGuard', 'swordCharge'],
                armour: {physical: [10, 10], magic: [0, 0]},
            }
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

        },
        { // G

        },
        { // EX
            Eco: { // useless trash
                name: `Eco`,
                description: `Former high school student, Eco was isekaied into the other world and is on a quest to defeat the demon lord. However, he is clumsy and unfit, so Eco plans on forming a party of beautiful girls to fight for him. Eco also has a mysterious power sealed within his right eye that he doesn't fully understand.`,
                rarity: EX,
                gender: male,
                pfp: undefined,
                hp: [0,0,0,0,0,0,0,60],
                mp: [0,0,0,0,0,0,0,25],
                str: [0,0,0,0,0,0,0,0.9],
                int: [0,0,0,0,0,0,0,5],
                mpRegen: [0,0,0,0,0,0,0,5],
                skils: ['punch', 'bodyslam', 'stare', 'brag'],
                armour: {physical: [0, 0], magic: [0, 0]},
            },
        },
    ],
    skills: {
        slash: {
            type: physical,
            dmg: 12,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 80,
            attacks: 3,
        },
        heavyStrike: {
            type: physical,
            dmg: 80,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 20},
            accuracy: 100,
            attacks: 1,
        },
        raiseGuard: {
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [{id: 'def', lvl: [15, 5]}],
            cost: {hp: 0, mp: 5},
            accuracy: Infinity,
            attacks: 1,
            selfOnly: true,
        },
        swordCharge: {
            type: physical,
            dmg: 125,
            multiplier: str,
            effects: [],
            cost: {hp: -5, mp: 15},
            accuracy: 90,
            attacks: 1,
        },
        punch: {
            type: physical,
            dmg: 15,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 100,
            attacks: 1,
        },
        bodyslam: {
            type: physical,
            dmg: 50,
            multiplier: str,
            effects: [],
            cost: {hp: -10, mp: 0},
            accuracy: 90,
            attacks: 1,
        },
        slap: {
            type: physical,
            dmg: 10,
            multiplier: str,
            effects: [],
            cost: {hp: 0, mp: 0},
            accuracy: 100,
            attacks: 1,
        },
        stare: {
            type: normal,
            dmg: 0,
            multiplier: none,
            effects: [],
            cost: {hp: 0, mp: 15},
            accuracy: 60,
            exec: ```
            if (enemy.gender == female) {
                attack.dmg = 99999,
            }
            ```,
            attacks: 1,
        },
        brag: {
            type: piercing,
            dmg: 0,
            multiplier: int,
            effects: [{id: 'dot', lvl: 10}],
            cost: {hp: 0, mp: 5},
            accuracy: 100,
            attacks: 1,
        },
        lesserHeal: {
            type: magic,
            dmg: -20,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 25},
            accuracy: 500,
            attacks: 1,
        },
        lesserAreaHeal: {
            type: magic,
            dmg: -10,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 60},
            accuracy: 500,
            exec: ```
            for (let i = 0; i < game.gamestate.player.team.length; i++) {
                game.gamestate.player.team[i].hp += 10;
            }
            ```,
            attacks: 1,
        },
        mediumHeal: {
            type: magic,
            dmg: -50,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 50},
            accuracy: 500,
            attacks: 1,
        },
        greaterHeal: {
            type: magic,
            dmg: -100,
            multiplier: int,
            effects: [],
            cost: {hp: 0, mp: 80},
            accuracy: 500,
            attacks: 1,
        },
    },
    pulls: {
        bronze: {
            name: `Bronze Card Pack`,
            cost: 500,
            attempts: 5,
            rates: {
                itemCharacterBias: 0.9,
                normal: 0.35,
                uncommon: 0.25,
                rare: 0.15,
                superRare: 0.12,
                epic: 0.07,
                legendary: 0.01,
                godly: 0,
                ex: 0,
            },
            exp: 5000,
            stock: Infinity,
            duration: Infinity,
        },
        silver: {
            name: `Silver Card Pack`,
            cost: 2500,
            attempts: 5,
            rates: {
                itemCharacterBias: 0.8,
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
        },
        gold: {
            name: `Gold Card Pack`,
            cost: 10000,
            attempts: 1,
            rates: {
                itemCharacterBias: 0.2,
                normal: 0,
                uncommon: 0,
                rare: 0,
                superRare: 0.05,
                epic: 0.25,
                legendary: 0.5,
                godly: 0.1,
                ex: 0,
            },
            exp: 100000,
            stock: Infinity,
            duration: Infinity,
        },
        bigGold: {
            name: `Mega Gold Card Pack`,
            cost: 100000,
            attempts: 10,
            rates: {
                itemCharacterBias: 0.2,
                normal: 0,
                uncommon: 0,
                rare: 0,
                superRare: 0,
                epic: 0.3,
                legendary: 0.45,
                godly: 0.14,
                ex: 0.01,
            },
            exp: 1000000,
            stock: Infinity,
            duration: Infinity,
        },
        item: {
            name: `Item Card Pack`,
            cost: 1000,
            attempts: 10,
            rates: {
                itemCharacterBias: 1,
                normal: 0.1,
                uncommon: 0.2,
                rare: 0.4,
                superRare: 0.15,
                epic: 0.1,
                legendary: 0.05,
                godly: 0,
                ex: 0,
            },
            stock: Infinity,
            duration: Infinity,
        },
        hero: {
            name: `Hero Card Pack`,
            cost: 5000,
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
        },
        whale: {
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
                godly: 0,
                ex: 1,
            },
            exp: 1000000000,
            stock: Infinity,
            duration: Infinity,
        },
    }
}

// Loading savegames
var game = {
    interface: `home`,
    gamestate: undefined,
};
//localStorage.removeItem('player');

// Steal Data (get inputs)
var mousepos = {x:0,y:0};
var display = {x:window.innerWidth, y:window.innerHeight};
//console.log(display);
//console.log(entities);
window.onkeyup = function(e) {
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].directControl) {
            entities[i].keyboard[e.key.toLowerCase()] = false; 
        }
    }
};
window.onkeydown = function(e) {
    for (var i = 0; i < entities.length; i++) {
        if (entities[i].directControl) {
            entities[i].keyboard[e.key.toLowerCase()] = true; 
            if (!paused) {
                e.preventDefault();
            }
        }
    }
};
document.addEventListener('mousedown', function(event) {
    if (event.button === 0) { // Check if left mouse button was clicked
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].directControl) {
                entities[i].keyboard.click = true;
            }
        }
    }
});
document.addEventListener('mouseup', function(event) {
    if (event.button === 0) { // Check if left mouse button was released
        for (var i = 0; i < entities.length; i++) {
            if (entities[i].directControl) {
                entities[i].keyboard.click = false;
            }
        }
    }
});
window.addEventListener("resize", function () {
    if (t > 0) {
        display = {x:window.innerWidth,y:window.innerHeight};
        replacehtml(`<canvas id="main" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 1;"></canvas><canvas id="canvasOverlay" width="${display.x}" height="${display.y}" style="position: absolute; top: 0; left: 0; z-index: 2;"></canvas>`);
    }
});
function tellPos(p){
    mousepos = {x: p.pageX, y:p.pageY};
};
window.addEventListener('mousemove', tellPos, false);

function clearData() {
    localStorage.removeItem('GatchaGameData');
    console.log('cleared previous data');
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
        player = JSON.parse(JSON.stringify(data.startingGamestate));
        entities.push(player);
    };
    home();
}

function home() {
    homePage = ```
    
    ```;
    replacehtml(homePage);
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
























/*
<div id="overlay">
    <div id="upgradesOverlay">
    </div>
    <div id="buttonGrid">
    </div>
</div>
*/