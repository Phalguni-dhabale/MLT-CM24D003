const video = document.getElementById("webcam");
const prediction = document.getElementById("prediction");
const fpsDisplay = document.getElementById("fps");

let model;
let frameCount = 0;
let lastTime = performance.now();

// Start Webcam
async function startCamera(){

    const stream = await navigator.mediaDevices.getUserMedia({
        video:true
    });

    video.srcObject = stream;

    model = await mobilenet.load();

    predictFrame();
}


// Prediction Loop
async function predictFrame(){

    const result = await model.classify(video);

    prediction.innerText =
    result[0].className +
    " (" + (result[0].probability*100).toFixed(2) + "%)";

    frameCount++;

    const now = performance.now();

    if(now - lastTime >= 1000){

        fpsDisplay.innerText = "FPS: " + frameCount;

        frameCount = 0;
        lastTime = now;
    }

    requestAnimationFrame(predictFrame);
}