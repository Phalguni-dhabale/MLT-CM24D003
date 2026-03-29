// Show sections
function show(id) {
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

// ================= Regression =================
async function runRegression() {
  const model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [1]}));

  model.compile({
    loss: 'meanSquaredError',
    optimizer: 'sgd'
  });

  const xs = tf.tensor([1, 2, 3, 4]);
  const ys = tf.tensor([2, 4, 6, 8]);

  await model.fit(xs, ys, {epochs: 200});

  const output = model.predict(tf.tensor([5]));
  document.getElementById("regOutput").innerText =
    "Prediction for 5: " + output.dataSync()[0];
}

// ================= Image Classification =================
let net;

document.getElementById("imgUpload").onchange = function(event) {
  const file = event.target.files[0];
  const img = document.getElementById("preview");
  img.src = URL.createObjectURL(file);
};

async function classifyImage() {
  if (!net) net = await mobilenet.load();

  const img = document.getElementById("preview");
  const result = await net.classify(img);

  document.getElementById("imgResult").innerText =
    result[0].className;
}

// ================= Object Detection =================
async function startObject() {
  const model = await cocoSsd.load();
  const video = document.getElementById("video");

  navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => video.srcObject = stream);

  setInterval(async () => {
    const predictions = await model.detect(video);
    console.log(predictions);
  }, 1000);
}

// ================= Pose Detection =================
async function startPose() {
  const net = await posenet.load();
  const video = document.getElementById("poseVideo");

  navigator.mediaDevices.getUserMedia({video: true})
    .then(stream => video.srcObject = stream);

  setInterval(async () => {
    const pose = await net.estimateSinglePose(video);
    console.log(pose);
  }, 1000);
}