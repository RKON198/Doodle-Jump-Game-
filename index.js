let box
// taking background image size
let boxWidth = 360
let boxHeight = 576
let context

// creating doodler
let doodlerWidth = 46
let doodlerHeight = 46
let doodlerX = boxWidth/2 - doodlerWidth/2
let doodlerY = boxHeight*7/8 - doodlerHeight
let doodlerRightImg     
let doodlerLeftImg

// game physics
let velX = 0
let velY = 0
// -ve y for upward direction
let initialVelY = -5
let gravity = 0.15

// platforms
let platArray = []
let platWidth = 120/2
let platHeight = 36/2
let platImg

// object for doodler, 0,0 from the top left of the image x
let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}


// score
let score = 0
let curr = 0
let gameOver = false

// on loading event handler, for canvas tag
window.onload = function() {
    box = document.getElementById("box")
    box.height = boxHeight
    box.width = boxWidth
    context = box.getContext("2d")

    // creating doodler
    // context.fillStyle = "red"
    // context.fillRect(doodler.x, doodler.y, doodler.width, doodler.height)

    // load images (Default face right) 
    // to create image <img> represented by constructor - Image()
    doodlerRightImg = new Image()

    // .src for specifying the URL
    doodlerRightImg.src = "./doodler-right.png"

    // setting the image
    doodler.img = doodlerRightImg
    //to assign image as soon as it loads assign the rectangle the image
    doodlerRightImg.onload = function() {
        // similar to fillRect
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height)
    }
    doodlerLeftImg = new Image()
    doodlerLeftImg.src = "./doodler-left.png"

    //platform image load 
    platImg = new Image()
    platImg.src = "./platform.png"

    velY = initialVelY 

    // placing the platforms on to the canvas
    placePlat()

    // we need to change x y coordinates everytime 
    // so had to redraw the canvas everytime
    requestAnimationFrame(update)

    // whenever any key is pressed
    document.addEventListener("keydown", moveDoodler)
}


// game loop
// no of callbacks mostly 60 but depends on display refresh rate
function update() {
    requestAnimationFrame(update)
    if(gameOver) {
        return
    }
    // clear the before image
    // from x,y 0,0 to last point box width, height
    context.clearRect(0,0, box.width, box.height)

    doodler.x += velX
    if(doodler.x > boxWidth) {
        doodler.x = 0
    }
    else if( doodler.x + doodler.width < 0) {
        doodler.x = boxWidth
    }

    velY += gravity
    doodler.y += velY

    if(doodler.y > box.height) {
        gameOver = true
    }

    // drawing the doodler over and over again
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height)

    // drawing platforms
    for( let i = 0; i < platArray.length; i++) {
        let platform = platArray[i]
        if( velY < 0 && doodler.y < boxHeight*3/4) {
            platform.y -= initialVelY
        }
        if( intersecting(doodler, platform) && velY >= 0) { 
            // velyY >= 0 so that it bounce only whenit touches the top , similar to when it falls down
            // remember +ve in downward direction
            velY = initialVelY // jumping from the platform
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height)
    }

    // deleting old plats and adding new plats
    while(platArray.length > 0 && platArray[0].y >= boxHeight) {
        platArray.shift() // removes the first element of array
        newplat()
    }

    // updating score
    updateScore()
    context.fillStyle = "black"
    context.font = "16px sans-serif"
    context.fillText(score, 5, 20,)

    if( gameOver) {
        context.fillText("Game Over: Press 'Space' to restart", boxWidth/7,boxHeight/2)
    }

}


// function taking an event 
// code property returns the key code when a keyboard event occures event.code
// https://www.toptal.com/developers/keycode
function moveDoodler(e) {
    if(e.code == "ArrowRight" || e.code == "KeyD") {
        // 4 pixels right
        velX = 4
        doodler.img = doodlerRightImg
    }
    else if( e.code == "ArrowLeft" || e.code == "KeyA") {
        velX = -4
        doodler.img = doodlerLeftImg
    }
    else if( e.code == "Space" && gameOver) {
        // starting game again
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }
        velX = 0
        velY = initialVelY
        score = 0
        curr = 0
        gameOver = false
        placePlat()
    }
}
// 18:26

function placePlat() {
    // clear the platform array first
    platArray = []

    // creating starting platforms statically for now
    // object
    let platform = {
        img : platImg,
        x : boxWidth/2,
        y : boxHeight - 50,
        width : platWidth,
        height : platHeight
    }

    platArray.push(platform)

    // taking gap of 100
    // platform = {
    //     img : platImg,
    //     x : boxWidth/2,
    //     y : boxHeight - 150,
    //     width : platWidth,
    //     height : platHeight
    // }

    // platArray.push(platform)
    
    // adding randomised platforms
    for( let i = 0; i < 6; i++) {
        let randomX = Math.floor( Math.random() * boxWidth*3/4) // math.random => no. b/w [0, 1) 
        let platform = {
            img : platImg,
            x : randomX,
            y : boxHeight - 75*i - 150,
            width : platWidth,
            height : platHeight
        }

        platArray.push(platform)
    }
}

function newplat() {
    let randomX = Math.floor( Math.random() * boxWidth*3/4) // math.random => no. b/w [0, 1) 
    let platform = {
        img : platImg,
        x : randomX,
        y : -platHeight, // i.e = 0
        width : platWidth,
        height : platHeight
    }
    // 36: 00
    platArray.push(platform)
}
function intersecting(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y
}

function updateScore() {
    let points = Math.floor(50*Math.random())
    if(velY < 0) {
        curr +=points
        if(score < curr) {
            score = curr
        }
    }
    else if(velY >= 0) {
        curr -=points
    }
}