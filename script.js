const state = {
  law: 1,
  running: false,
  time: 0,
  x: 5,
  velocity: 0,
  acceleration: 0,
  mass: 2500,
  force: 5000,
  friction: 1000,
  initialVelocity: 0,
  lastTime: null
};

const $ = id => document.getElementById(id);

const vehicle = $("vehicle");
const kalesa = $("kalesa");
const playBtn = $("playBtn");
const stepBtn = $("stepBtn");
const resetBtn = $("resetBtn");
const statusText = $("statusText");

function updateLabels() {
  $("massValue").textContent = state.mass;
  $("forceValue").textContent = state.force;
  $("frictionValue").textContent = state.friction;
  $("velocityValue").textContent = state.initialVelocity;
  $("actionValue").textContent = `${state.force} N`;
  $("reactionValue").textContent = `${state.force} N`;
}

function calculate() {
  let scenario = $("scenario").value;
  let netForce = state.force - state.friction;

  if (state.law === 1) {
    if (scenario === "steady") {
      netForce = 0;
    } else if (scenario === "brake") {
      netForce = -Math.min(state.friction + state.force, 7000);
    } else if (scenario === "accelerate") {
      netForce = Math.max(0, state.force - state.friction);
    }
  }

  state.acceleration = netForce / state.mass;
  return netForce;
}

function render() {
  const netForce = calculate();

  $("timeReadout").textContent = `${state.time.toFixed(1)} s`;
  $("velocityReadout").textContent = `${state.velocity.toFixed(2)} m/s`;
  $("accelerationReadout").textContent = `${state.acceleration.toFixed(2)} m/s²`;
  $("netForceReadout").textContent = `${Math.round(netForce)} N`;
  $("challengeAccel").textContent = `${state.acceleration.toFixed(2)} m/s²`;

  const showValues = $("showValues").checked;
  document.querySelector(".readouts").style.opacity = showValues ? "1" : ".35";

  const showArrows = $("showArrows").checked;
  $("forceArrow").classList.toggle("hidden", !showArrows || state.law === 3);
  $("reactionArrow").classList.toggle("hidden", !showArrows || state.law !== 3);

  // Map physics position into the visible scene.
  const sceneWidth = document.querySelector(".road").clientWidth || 900;
  const px = Math.max(2, Math.min(62, state.x));
  vehicle.style.left = `${px}%`;

  if (state.law === 3) {
    kalesa.style.opacity = ".25";
    vehicle.style.opacity = "1";
  } else {
    kalesa.style.opacity = ".95";
  }

  if (state.law === 3) {
    vehicle.style.transform = "scale(.92)";
  } else {
    vehicle.style.transform = "scale(1)";
  }

  updatePassengerVisual();
  updateLabels();

  const target = 2;
  if (Math.abs(state.acceleration - target) < 0.06) {
    $("challengeResult").textContent = "🎉 Challenge reached!";
  } else if (state.acceleration > target) {
    $("challengeResult").textContent = "A little less net force.";
  } else {
    $("challengeResult").textContent = "Try increasing the net force.";
  }
}


function updatePassengerVisual() {
  const passenger = $("passenger");
  if (!passenger) return;

  const scenario = $("scenario").value;
  passenger.classList.remove("inertia-forward", "inertia-backward");

  if (state.law !== 1) {
    passenger.classList.remove("inertia-forward", "inertia-backward");
    $("passengerStatus").textContent = "Normal motion";
    $("observationTitle").textContent = "Passenger observation";
    $("observationText").textContent = "Select the 1st Law to investigate passenger inertia.";
    return;
  }

  if (scenario === "brake" && state.running) {
    passenger.classList.add("inertia-forward");
    $("passengerStatus").textContent = "Moves forward";
    $("observationTitle").textContent = "The jeepney brakes suddenly";
    $("observationText").textContent = "The passenger tends to continue moving forward because the passenger's body was already moving.";
  } else if (scenario === "accelerate" && state.running && state.time < 2.0) {
    passenger.classList.add("inertia-backward");
    $("passengerStatus").textContent = "Moves backward relative to jeepney";
    $("observationTitle").textContent = "The jeepney suddenly accelerates";
    $("observationText").textContent = "The passenger tends to remain at rest while the jeepney moves forward underneath them.";
  } else if (scenario === "steady") {
    $("passengerStatus").textContent = "Moves with jeepney";
    $("observationTitle").textContent = "Constant velocity";
    $("observationText").textContent = "With no net force, the passenger and jeepney continue moving at constant velocity.";
  } else {
    $("passengerStatus").textContent = "Ready to observe";
    $("observationTitle").textContent = "What happens to the passenger?";
    $("observationText").textContent = "Press Start and observe how the passenger's motion differs from the jeepney when its motion changes.";
  }
}

function reset() {
  state.running = false;
  state.time = 0;
  state.x = 5;
  state.velocity = state.initialVelocity;
  state.lastTime = null;
  playBtn.textContent = "▶ Start";
  statusText.textContent = "Ready to explore";
  render();
}

function step(dt = 0.1) {
  const netForce = calculate();
  state.velocity += state.acceleration * dt;

  // Avoid unrealistic negative velocity in this beginner simulation.
  if (state.velocity < 0) state.velocity = 0;

  state.time += dt;
  state.x += state.velocity * dt * 0.7;
  if (state.x > 63) state.x = 5;
  render();
}

function toggleRun() {
  state.running = !state.running;
  playBtn.textContent = state.running ? "⏸ Pause" : "▶ Start";
  statusText.textContent = state.running ? "Simulation running…" : "Paused";
  if (state.running) {
    state.lastTime = performance.now();
    requestAnimationFrame(loop);
  }
}

function loop(now) {
  if (!state.running) return;
  const dt = Math.min((now - state.lastTime) / 1000, 0.05);
  state.lastTime = now;
  step(dt);
  requestAnimationFrame(loop);
}

function setLaw(law) {
  state.law = Number(law);
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.law) === state.law);
  });

  const title = $("lawTitle");
  const desc = $("lawDescription");
  const thirdBox = $("thirdLawBox");

  if (state.law === 1) {
    title.textContent = "Newton's 1st Law — Inertia";
    desc.textContent = "Investigate inertia using a jeepney and passenger: objects resist changes to their state of motion.";
    $("scenario").value = "accelerate";
    $("challengeTitle").textContent = "Can you demonstrate inertia?";
    $("challengeText").textContent = "Set the applied force and friction to zero, then start with a non-zero initial velocity.";
    thirdBox.classList.add("hidden");
  } else if (state.law === 2) {
    title.textContent = "Newton's 2nd Law — F = ma";
    desc.textContent = "Investigate how net force and mass affect acceleration.";
    $("scenario").value = "compare";
    $("challengeTitle").textContent = "Can you make the jeepney accelerate at 2 m/s²?";
    $("challengeText").textContent = "Set the mass to 2,500 kg and adjust the force until acceleration reaches 2 m/s². Remember to consider friction.";
    thirdBox.classList.add("hidden");
  } else {
    title.textContent = "Newton's 3rd Law — Action & Reaction";
    desc.textContent = "Observe how forces occur in equal-magnitude, opposite-direction pairs.";
    $("scenario").value = "kalesa";
    $("challengeTitle").textContent = "Can you identify the action–reaction pair?";
    $("challengeText").textContent = "Press Start and observe the equal force values. Ask: Which force is the action and which is the reaction?";
    thirdBox.classList.remove("hidden");
  }
  reset();
}

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => setLaw(btn.dataset.law));
});

$("massSlider").addEventListener("input", e => {
  state.mass = Number(e.target.value);
  render();
});
$("forceSlider").addEventListener("input", e => {
  state.force = Number(e.target.value);
  render();
});
$("frictionSlider").addEventListener("input", e => {
  state.friction = Number(e.target.value);
  render();
});
$("velocitySlider").addEventListener("input", e => {
  state.initialVelocity = Number(e.target.value);
  if (!state.running) state.velocity = state.initialVelocity;
  render();
});
$("showArrows").addEventListener("change", render);
$("showValues").addEventListener("change", render);

$("scenario").addEventListener("change", e => {
  const v = e.target.value;
  if (v === "accelerate") {
    state.mass = 2500; state.force = 5000; state.friction = 1000; state.initialVelocity = 0;
  } else if (v === "brake") {
    state.mass = 2500; state.force = 2500; state.friction = 1500; state.initialVelocity = 12;
  } else if (v === "steady") {
    state.mass = 2500; state.force = 1000; state.friction = 1000; state.initialVelocity = 10;
  } else if (v === "kalesa") {
    state.mass = 800; state.force = 1200; state.friction = 200; state.initialVelocity = 0;
  } else {
    state.mass = 2500; state.force = 5000; state.friction = 1000; state.initialVelocity = 0;
  }
  $("massSlider").value = state.mass;
  $("forceSlider").value = state.force;
  $("frictionSlider").value = state.friction;
  $("velocitySlider").value = state.initialVelocity;
  reset();
});

playBtn.addEventListener("click", toggleRun);
stepBtn.addEventListener("click", () => {
  state.running = false;
  playBtn.textContent = "▶ Start";
  step(0.1);
});
resetBtn.addEventListener("click", reset);

document.querySelectorAll(".mini-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const exp = btn.dataset.experiment;
    if (exp === "inertia") setLaw(1);
    if (exp === "force") setLaw(2);
    if (exp === "reaction") setLaw(3);
    document.querySelector(".simulation-card").scrollIntoView({behavior:"smooth"});
  });
});

updateLabels();
reset();

$("passengerDemo").addEventListener("click", () => {
  setLaw(1);
  $("scenario").value = "brake";
  state.mass = 2500;
  state.force = 2500;
  state.friction = 1500;
  state.initialVelocity = 12;
  $("massSlider").value = state.mass;
  $("forceSlider").value = state.force;
  $("frictionSlider").value = state.friction;
  $("velocitySlider").value = state.initialVelocity;
  reset();
  toggleRun();
});
