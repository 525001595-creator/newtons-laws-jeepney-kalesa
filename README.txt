# Newton's Laws — Jeepney & Kalesa Simulation

A beginner-friendly, no-framework educational web simulation inspired by the general layout and interactivity of PhET-style simulations.

## Files

- index.html — page structure and illustrations
- style.css — appearance/layout
- script.js — simulation behavior and physics

## How to run

### Easiest method
1. Create a folder named `newtons-laws-simulation`.
2. Put the three files inside it.
3. Double-click `index.html`.
4. The simulation should open in Chrome, Edge, or Firefox.

No internet connection is required.

### Recommended editor
Install Visual Studio Code if you want to edit the site:
https://code.visualstudio.com/

Open the folder in VS Code, then edit the files.

## What is included

- Newton's 1st, 2nd, and 3rd Law tabs
- Jeepney and kalesa contextualized objects
- Mass, applied force, friction, and initial velocity controls
- Start, Step, and Reset controls
- Force/reaction arrows
- Live velocity, acceleration, and net-force readouts
- Learner challenge
- Suggested classroom use
- Responsive layout for smaller screens

## Important physics note

This is a teaching prototype, not a high-fidelity engineering simulator. It uses a simplified one-dimensional model:

Net force = Applied force - Friction

Acceleration = Net force / Mass

Velocity changes according to acceleration.

For a production classroom version, the physics rules can be refined to distinguish static/kinetic friction, braking, multiple forces, and two-body interactions.

## Next upgrades

Possible additions:
1. Separate interactive experiments for each law.
2. A guided Learning Activity Sheet inside the simulation.
3. Automatic scoring and feedback.
4. More Filipino contexts: tricycle, bicycle, sari-sari store cart, banca.
5. Teacher mode with a hidden answer key.
6. Save/export learner results.
7. Publish online with GitHub Pages or another static hosting service.
