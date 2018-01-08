/**
 * Created by Administrator on 2016/12/22.
 */
window.onload = function () {
    var canvas = document.getElementById("scratch-shapes");

    // canvas dimensions
    var width = parseInt(canvas.style.width);
    var height = parseInt(canvas.style.height);

    // retina
    var dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.getContext("2d").scale(dpr, dpr);

    // simulation
    var sim = new VerletJS(width, height, canvas);
    sim.friction = 1;

    // entities
    var segment = sim.lineSegments([new Vec2(20, 10), new Vec2(40, 10), new Vec2(60, 10), new Vec2(80, 10), new Vec2(100, 10)], 0.02);
    var pin = segment.pin(0);
    var pin = segment.pin(4);

    var tire1 = sim.tire(new Vec2(200, 50), 50, 30, 0.3, 0.9);
    var tire2 = sim.tire(new Vec2(400, 50), 70, 7, 0.1, 0.2);
    var tire3 = sim.tire(new Vec2(600, 50), 70, 3, 1, 1);

    // animation loop
    var loop = function () {
        sim.frame(16);
        sim.draw();
        requestAnimFrame(loop);
    };

    loop();
};