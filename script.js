var plan = ["############################",
    "#       #    #   o       ##",
    "#                         #",
    "#           ####          #",
    "##      #   #      ##     #",
    "###      ##           #   #",
    "#            ###     #    #",
    "#   ###                   #",
    "#   ##       o            #",
    "# o  #             o   ## #",
    "#     #                    #",
    "#############################"
];

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.add = function (other) {
    return new Point(this.x + other.x, this.y + other.y);
};
//This function is only to have access to the points in space on the terrarium. 
//To provide a way for us to work with other points.

// Next, we define the Grid. 

function Grid(width, heigth) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
}

Grid.prototype.valueAt = function (point) {
    return this.cells[point.y * this.width + point.x];
};
Grid.prototype.setValueAt = function (point, value) {
    this.cells[point.y * this.width + point.x] = value;
};
Grid.prototype.isInside = function (point) {
    return point.x >= 0 && point.y >= 0 && point.x < this.width && point.y < this.height;
};
Grid.prototype.moveValue = function (to, from) {
    this.setValueAt(to, this.valueAt(from));
    this.setValueAt(from, undefined);
};

Grid.prototype.each = function (action) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var point = new Point(x, y);
            action(point, this.valueAt(point));
        }
    }
};

function Dictionary(startValues) {
    this.values = startValues || {};
};
Dictionary.prototype.store = function (name, value) {
    this.values[name] = value;
}
Dictionary.prototype.lookup = function (name) {
    return this.values[name];
}
Dictionary.prototype.contains = function (name) {
    return Object.prototype.propertyIsEnumerable.call(this.values, name);
}
Dictionary.prototype.each = function (action) {
    //this.values.forEach(action)
    forEachIn(this.values, action);
}

var directions = new Dictionary({
    "n": new Point(0, -1),
    "ne": new Point(1, -1),
    "e": new Point(1, 0),
    "se": new Point(1, 1),
    "s": new Point(0, 1),
    "sw": new Point(-1, 1),
    "w": new Point(-1, 0),
    "nw": new Point(-1, -1)
});

function StupidBug() {};
StupidBug.prototype.act = function (surroundings) {
    return {
        type: "move",
        direction: "s"
    };
};

var wall = {};
//Bellow we'll see why we need this function.
let elementFromCharacter = function (character) {
    if (character == " ")
        return undefined;
    else if (character == "#")
        return wall;
    else if (charcater == "o")
        return new StupidBug();
};

let terrarium = function Terrarium(plan) {
    var grid = new Grid(plan[0].length, plan.length);
    for (var y = 0; y < plan.length; y++) {
        var line = plan[y];
        for (var x = 0; x < line.length; x++) {
            grid.setValueAt(new Point(x, y), elementFromCharacter(line.charAt(x)));
        }
    }
    this.grid = grid;
}

/*Next, we will give both - the wall object and the prototype of 
the StupidBug, a property of character 
which will hold the character that represents them respectively.
We do this so we can use those when we transform the terrarium 
object into a string - with a method we attach onto its property (bellow). */

wall.character = "#";
StupidBug.prototype.character = "o";

//Also, a function with which we retreive these characters:

function characterFromElement(element) {
    if (element == undefined)
        return " ";
    else
        return element.character;
}

//and here is the method for which we will need the code above

Terrarium.prototype.toString = function () {
    let characters = [];
    let endOfLine = this.grid.width - 1;
    this.grid.each(function (point, value) {
        characters.push(characterFromElement(value));
        if (point.x == endOfLine)
            characters.push("\n");
    });
    return characters.join("");
}