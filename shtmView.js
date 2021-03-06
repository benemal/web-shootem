var shootCanvas;
var shootContext;
var bulletCanvas;
var bulletContext;

var readyView = function(shootCanvasElement) {
    shootCanvas    = shootCanvasElement;
    shootContext   = shootCanvas.getContext('2d');
    bulletCanvas   = document.createElement('canvas');
    bulletContext  = bulletCanvas.getContext('2d');

    bulletCanvas.width = shootCanvas.width;
    bulletCanvas.height = shootCanvas.height;    

    return {
        width: shootCanvas.width,
        height: shootCanvas.height
    };
};

var showStartScreen = function() {
    $("#startScreen").show();
};

var clearBullets = function() {
    bulletContext.clearRect(0,0, bulletCanvas.height, bulletCanvas.width);
};

    //draw a red target circle at (x,y) with radius r
    //TODO add parameter "target"
var drawTarget = function (t, i, a) {
    shootContext.fillStyle = "yellow"
    shootContext.beginPath()
    shootContext.arc(t.loc.x, t.loc.y, t.radius, 0, 2*Math.PI)
    shootContext.fill()

    var timeElapsed = (Date.now()-t.startTime) / (targetTimeout)
    $("#targetTime").val(timeElapsed)
    //alert(timeElapsed)
    shootContext.fillStyle = "red"
    shootContext.beginPath()
    shootContext.moveTo(t.loc.x, t.loc.y)
    shootContext.arc(t.loc.x, t.loc.y, 
                t.radius+1, 
                0, 2*Math.PI* timeElapsed)
    shootContext.fill()
};

var drawBulletHole = function (coord) {
    bulletContext.fillStyle = "gray"
    bulletContext.beginPath()
    bulletContext.arc(coord.x, coord.y, 1, 0, 2*Math.PI)
    bulletContext.fill()
};

var render = function () {
    shootContext.clearRect(0,0, shootCanvas.height, shootCanvas.width)
    shootContext.drawImage(bulletCanvas, 0, 0);

    targetManager.targetList.forEach(drawTarget);

    window.requestAnimationFrame(render)
};

function updateScoreboard() {
    $("#score").val(hits)
    $("#missCount").val(misses)
    var accuracy = Math.round(hits / (hits + misses) * 100)
    $("#accuracy").val((isNaN(accuracy) ? 100 : accuracy) + "%")
    $("#targetCount").val(targetManager.count);
}

function updateDebug() {
    // update debugging info
    $("#targetx").val(target.loc.x)
    $("#targety").val(target.loc.y)
    $("#targetr").val(target.radius)
}
