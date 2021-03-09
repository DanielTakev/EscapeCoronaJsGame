// ESCAPE CORONA GAME - Daniel Takev, F99102, Autumn 2020-2021

// SELECT CANVAS
const myCanvas = document.getElementById("escapecorona");
const ctx = myCanvas.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
const DEGREE = Math.PI / 180;

// LOAD MY IMAGE
const myImage = new Image();
myImage.src = "img/escapeCoronaImage.png";

// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLY = new Audio();
FLY.src = "audio/sfx_fly.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

// GAME STATE
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

// START BUTTON COORDINATIONS
const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29
}

// CONTROL THE STATES
myCanvas.addEventListener("click", function(evt) {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            if (generalMutafchiyski.y - generalMutafchiyski.radius <= 0) return;
            generalMutafchiyski.fly();
            FLY.play();
            break;
        case state.over:
            let rect = myCanvas.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;

            // CHECK IF WE CLICK ON THE START BUTTON
            if (clickX >= startBtn.x &&
                clickX <= startBtn.x + startBtn.w &&
                clickY >= startBtn.y &&
                clickY <= startBtn.y + startBtn.h) {
                viruses.reset();
                generalMutafchiyski.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
});


// BACKGROUND
const myBackground = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 226,
    x: 0,
    y: myCanvas.height - 226,

    draw: function() {
        ctx.drawImage(myImage, this.sX, this.sY, this.w, this.h,
            this.x, this.y, this.w, this.h);

        ctx.drawImage(myImage, this.sX, this.sY, this.w, this.h,
            this.x + this.w, this.y, this.w, this.h);
    }

}

// FOREGROUND
const foreground = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: myCanvas.height - 112,

    dx: 2,

    draw: function() {
        ctx.drawImage(myImage, this.sX, this.sY, this.w, this.h,
            this.x, this.y, this.w, this.h);

        ctx.drawImage(myImage, this.sX, this.sY, this.w, this.h,
            this.x + this.w, this.y, this.w, this.h);
    },

    update: function() {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }
}

// GENERAL MUTAFCHIYSKI
const generalMutafchiyski = {
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    radius: 12,

    frame: 0,

    gravity: 0.2,
    jump: 3.8,
    speed: 0,
    rotation: 0,

    draw: function() {
        let generalMutafchiyski = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(myImage, generalMutafchiyski.sX, generalMutafchiyski.sY,
            this.w, this.h, -this.w / 2, -this.h / 2, this.w, this.h);

        ctx.restore();
    },

    fly: function() {
        this.speed = -this.jump;
    },

    update: function() {
        // IF THE GAME STATE IS GET READY STATE, THE GENERAL MUTAFCHIYSKI MUST FLY SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames % this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 TO 4, THEN AGAIN TO 0
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150; // RESET POSITION OF THE GENERAL MUTAFCHIYSKI AFTER GAME OVER
            this.rotation = 0 * DEGREE;
        } else {
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h / 2 >= myCanvas.height - foreground.h) {
                this.y = myCanvas.height - foreground.h - this.h / 2;
                if (state.current == state.game) {
                    state.current = state.over;
                    DIE.play();
                }
            }

            // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE GENERAL MUTAFCHIYSKI IS FALLING DOWN
            if (this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            } else {
                this.rotation = -25 * DEGREE;
            }
        }

    },
    speedReset: function() {
        this.speed = 0;
    }
}

// GET READY MESSAGE
const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: myCanvas.width / 2 - 173 / 2,
    y: 80,

    draw: function() {
        if (state.current == state.getReady) {
            ctx.drawImage(myImage, this.sX, this.sY, this.w, this.h,
                this.x, this.y, this.w, this.h);
        }
    }

}

// GAME OVER MESSAGE
const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: myCanvas.width / 2 - 225 / 2,
    y: 90,

    draw: function() {
        if (state.current == state.over) {
            ctx.drawImage(myImage, this.sX, this.sY, this.w, this.h,
                this.x, this.y, this.w, this.h);
        }
    }

}

// VIRUSES
const viruses = {
    position: [],

    top: {
        sX: 553,
        sY: 0
    },
    bottom: {
        sX: 502,
        sY: 0
    },

    w: 53,
    h: 400,
    gap: 140,
    maxYPos: -150,
    dx: 2,

    draw: function() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            // top viruse
            ctx.drawImage(myImage, this.top.sX, this.top.sY, this.w, this.h,
                p.x, topYPos, this.w, this.h);

            // bottom viruse
            ctx.drawImage(myImage, this.bottom.sX, this.bottom.sY, this.w, this.h,
                p.x, bottomYPos, this.w, this.h);
        }
    },

    update: function() {
        if (state.current !== state.game) return;

        if (frames % 100 == 0) {
            this.position.push({
                x: myCanvas.width,
                y: this.maxYPos * (Math.random() + 1)
            });
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let bottomViruseYPos = p.y + this.h + this.gap;

            // COLLISION DETECTION
            // TOP VIRUSE
            if (generalMutafchiyski.x + generalMutafchiyski.radius > p.x &&
                generalMutafchiyski.x - generalMutafchiyski.radius < p.x + this.w &&
                generalMutafchiyski.y + generalMutafchiyski.radius > p.y &&
                generalMutafchiyski.y - generalMutafchiyski.radius < p.y + this.h) {
                state.current = state.over;
                HIT.play();
            }
            // BOTTOM VIRUSE
            if (generalMutafchiyski.x + generalMutafchiyski.radius > p.x &&
                generalMutafchiyski.x - generalMutafchiyski.radius < p.x + this.w &&
                generalMutafchiyski.y + generalMutafchiyski.radius > bottomViruseYPos &&
                generalMutafchiyski.y - generalMutafchiyski.radius < bottomViruseYPos + this.h) {
                state.current = state.over;
                HIT.play();
            }

            // MOVE THE VIRUSES TO THE LEFT
            p.x -= this.dx;

            // if the VIRUSES go beyond canvas, we delete them from the array
            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },

    reset: function() {
        this.position = [];
    }

}

// SCORE
const score = {
    best: parseInt(localStorage.getItem("best")) || 0,
    value: 0,

    draw: function() {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "40px Teko";
            ctx.fillText(this.value, myCanvas.width / 2, 50);
            ctx.strokeText(this.value, myCanvas.width / 2, 50);

        } else if (state.current == state.over) {
            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);
            // BEST SCORE
            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228);
        }
    },

    reset: function() {
        this.value = 0;
    }
}

// MEDALS
const medal = {
    sX: 359,
    sY: 157,
    x: 72,
    y: 175,
    width: 48,
    height: 45,

    draw: function() {
        if (state.current == state.over && score.value <= 2) { // Bad
            ctx.drawImage(myImage, this.sX - 46, this.sY - 46, this.width, this.height,
                this.x, this.y, this.width, this.height);
        }
        if (state.current == state.over && (score.value > 2 && score.value <= 5)) { // Better
            ctx.drawImage(myImage, this.sX, this.sY - 46, this.width, this.height,
                this.x, this.y, this.width, this.height);
        }
        if (state.current == state.over && (score.value > 5 && score.value <= 9)) { // Good
            ctx.drawImage(myImage, this.sX - 46, this.sY, this.width, this.height,
                this.x, this.y, this.width, this.height);
        }
        if (state.current == state.over && score.value >= 10) { // Great
            ctx.drawImage(myImage, this.sX, this.sY, this.width, this.height,
                this.x, this.y, this.width, this.height);
        }
    }
}

// DRAW
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);

    myBackground.draw();
    viruses.draw();
    foreground.draw();
    generalMutafchiyski.draw();
    getReady.draw();
    gameOver.draw();
    medal.draw();
    score.draw();
}

// UPDATE
function update() {
    generalMutafchiyski.update();
    foreground.update();
    viruses.update();
}

// LOOP
function loop() {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);
}
loop();