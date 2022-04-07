import "./App.css";
import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";

function App() {
  // engine
  let engine = Matter.Engine.create();
  // render
  let render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
      width: 500,
      height: 800,
      wireframes: false,
      // background: "#fafafa",
    },
  });
  Matter.Render.run(render);
  // runner
  let runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);
  // params: x, y, width, height, options
  let bottom = Matter.Bodies.rectangle(280, 800, 560, 20, {
    isStatic: true,
    render: {
      fillStyle: "#fafafa",
    },
  });
  Matter.World.add(engine.world, bottom);
  // Abstracting Wall Creation
  function wall(x: number, y: number, width: number, height: number) {
    return Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      render: {
        fillStyle: "#fafafa",
      },
    });
  }
  Matter.World.add(engine.world, [
    wall(280, 0, 560, 200),
    wall(280, 800, 560, 20),
    wall(0, 400, 20, 800),
    wall(560, 400, 20, 800),
  ]);
  for (let x = 0; x <= 560; x += 80) {
    let divider = wall(x, 610, 20, 8360);
    Matter.World.add(engine.world, divider);
  }
  function peg(x: number, y: number) {
    return Matter.Bodies.circle(x, y, 14, {
      label: "peg",
      restitution: 0.5,
      isStatic: true,
      render: {
        fillStyle: "#82c91e",
      },
    });
  }
  let isStaggerRow = false;
  for (let y = 200; y <= 400; y += 40) {
    let startX = isStaggerRow ? 80 : 40;
    for (let x = startX; x <= 520; x += 80) {
      Matter.World.add(engine.world, peg(x, y));
    }
    isStaggerRow = !isStaggerRow;
  }
  function bead() {
    return Matter.Bodies.circle(280, 40, 11, {
      restitution: 0.5,
      render: {
        fillStyle: "#e64980",
      },
    });
  }
  function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  function dropBead() {
    let droppedBead = bead();
    Matter.Body.setVelocity(droppedBead, { x: rand(-0.05, 0.05), y: 0.05 });
    Matter.Body.setAngularVelocity(droppedBead, rand(-0.05, 0.05));
    Matter.World.add(engine.world, droppedBead);
  }
  let dropBeadInterval = setInterval(dropBead, 2000);

  Matter.Events.on(engine, "collisionStart", lightPeg);
  function lightPeg(event: any) {
    event.pairs
      .filter((pair: any) => pair.bodyA.label === "peg")
      .forEach((pair: any) => {
        pair.bodyA.render.fillStyle = "#82c91e";
      });
  }
  return (
    <div className="App">
      {/* <button
        className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800 text-white hover:ring-4 align-baseline"
        onMouseDown={startCounter}
        onMouseUp={stopCounter}
      >
        Test
      </button> */}
    </div>
  );
}

export default App;
