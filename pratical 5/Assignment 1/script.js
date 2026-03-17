const video = document.getElementById("webcam");
const result = document.getElementById("result");

let model;

// Start webcam
async function startCamera(){

    const stream = await navigator.mediaDevices.getUserMedia({
        video:true
    });

    video.srcObject = stream;

    model = await mobilenet.load();

    classifyFrame();
}


// Classify webcam frame
async function classifyFrame(){

    const predictions = await model.classify(video);

    result.innerText =
    "Prediction: " +
    predictions[0].className +
    " (" + (predictions[0].probability*100).toFixed(2) + "%)";

    requestAnimationFrame(classifyFrame);
}