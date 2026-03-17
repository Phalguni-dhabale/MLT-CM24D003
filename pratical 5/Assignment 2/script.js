const video = document.getElementById("webcam");
const label = document.getElementById("label");

let model;

// Start webcam
async function startCamera(){

    const stream = await navigator.mediaDevices.getUserMedia({
        video:true
    });

    video.srcObject = stream;

    model = await mobilenet.load();

    detectObjects();
}


// Classification loop
async function detectObjects(){

    const predictions = await model.classify(video);

    label.innerText =
    predictions[0].className +
    " (" + (predictions[0].probability*100).toFixed(2) + "%)";

    requestAnimationFrame(detectObjects);
}