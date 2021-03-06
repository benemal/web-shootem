var targetTimeout
var targetManager

var targetLocMargin = 0.1
var targetRadius = { min: 10, max: 30 }
var targetModFactors

var readyTarget = function(viewSize) {
    // Calculate RNG modifiers for target location/radius
    targetModFactors = {
        width: { mod: viewSize.width * (1-targetLocMargin*2), min: viewSize.width*targetLocMargin},
        height: { mod: viewSize.height * (1-targetLocMargin*2), min: viewSize.height*targetLocMargin},
        radius: { mod: (targetRadius.max - targetRadius.min), min: targetRadius.min}
    }
};

var TargetManager = function(startCount) {
    this.targetList = [];
    var i;
    for (i = 0; i < startCount; i++) {
        this.targetList[this.targetList.length] = new Target();
    }

    this.remove = function(t) {
        this.targetList.splice(this.targetList.indexOf(t), 1);
        if (this.targetList.length <= 0) {
            $("#startScreen").show();
        }
        updateScoreboard();
    }

    this.__defineGetter__("count", function() { return this.targetList.length; });
}

var Target = function() {
    this.startTime = Date.now()
    this.loc = generateRandomLocation()
    this.radius = generateRandomRadius()
    this.timeoutID = window.setTimeout(targetExpired, targetTimeout, this)

    this.__defineGetter__("x", function() { return this.loc.x; });
    this.__defineGetter__("y", function() { return this.loc.y; });
}

Target.prototype.toString = function() {
    return "Target: startTime: " + this.startTime + ", loc: " + this.loc + ", radius: " + this.radius + ", timeoutID: " + this.timeoutID;
};

function generateRandomLocation() {
    return new Vector(Math.round(Math.random()*targetModFactors.width.mod + targetModFactors.width.min), 
                        Math.round(Math.random()*targetModFactors.height.mod + targetModFactors.height.min)); 
}

function generateRandomRadius() {
    return Math.round(Math.random()*targetModFactors.radius.mod + targetModFactors.radius.min)
}

function targetHit(target) {
    console.log("Target hit: " + target);

    hits++       
    targetTimeout *= 0.9
    // must clear timeout before calling decrement, lest the timeout event be left hanging
    window.clearTimeout(target.timeoutID)
    delete target.timeoutID
};

function targetMiss() {
    console.log("Miss");

    misses++;
};

function targetExpired(target) {
    console.log("Target expired: " + target);

    misses++;
    targetTimeout *= 1.1;
    targetManager.remove(target);
}
