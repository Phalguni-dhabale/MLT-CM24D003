const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

let model;

// Access Webcam
async function setupWebcam(){
    const stream = await navigator.mediaDevices.getUserMedia({
        video:true
    });

    video.srcObject = stream;

    return new Promise(resolve=>{
        video.onloadedmetadata = ()=>{
            resolve(video);
        }
    });
}

// Detect Objects
async function detectObjects(){

    const predictions = await model.detect(video);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    predictions.forEach(prediction=>{

        const [x,y,width,height] = prediction.bbox;

        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x,y,width,height);

        ctx.font = "18px Arial";
        ctx.fillStyle = "red";
        ctx.fillText(
            prediction.class + " " + Math.round(prediction.score*100) + "%",
            x,
            y>10 ? y-5 : 10
        );
    });

    requestAnimationFrame(detectObjects);
}

// Start Detection
startBtn.addEventListener("click", async ()=>{

    await setupWebcam();

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    model = await cocoSsd.load();

    detectObjects();
});