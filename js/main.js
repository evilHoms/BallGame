;'use strict';

canvas = document.querySelector(`#drawing-area`);
c = canvas.getContext(`2d`);

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = { x: 0, y: 0 };
const cursor = new Cursor(c);
const ground = new Ground(c);

const targetBalls = [];
const activeBalls = [];

const BALLS_RADIUS = 20;
const TARGET_BALLS_COLOR = `#add`;
const NUMBER_OF_BALLS = { easy: { target: 3, active: 5 }, 
                         normal: { target: 6, active: 4 }, 
                         hard: { target: 10, active: 3 }, 
                         nightmare: { target: 20, active: 1 } 
                        };


window.addEventListener(`resize`, winResizeEvent);
window.addEventListener(`mousemove`, mouseMoveEvent);
window.addEventListener(`mousedown`, activeBallMouseDown);
window.addEventListener(`mouseup`, activeBallMouseUp);

addActiveBalls(c, NUMBER_OF_BALLS.nightmare.active, ground);
addTargetBalls(c, NUMBER_OF_BALLS.nightmare.target, ground);

animate();


function animate() {
  requestAnimationFrame(animate);
  
  clear();
  
  ground.update();
  updateObjectsArray(c, activeBalls);
  updateObjectsArray(c, targetBalls);
  cursor.update(mouse.x, mouse.y);
}

/* Очищаем экран
*/
function clear() {
  c.clearRect(0, 0, canvas.width, canvas.height);
}

/* Обновляем все элементы в переданном массиве
*/
function updateObjectsArray(ctx, objArray) {
  objArray.forEach((el) => {
    el.update();
  });
}

/* Создаем объекты Ball и помещаем их в массив предназначенный
  для объектов, в которые нужно попасть, 
  отрисовки в этом методе не происходит
*/
function addTargetBalls(ctx, numberOfElements, unavailableArea) {
  
  let availableXY;
  
  for (let i = 0; i < numberOfElements; i++) {
    
    availableXY = randomBallPosition(targetBalls, BALLS_RADIUS, unavailableArea);
    
    targetBalls.push(new Ball(ctx, availableXY.x, availableXY.y, BALLS_RADIUS, TARGET_BALLS_COLOR));
    
  }
  
  
  /* Создаем рандомные координаты, новый обхект с которыми не будет соприкосаться
    с остальными объектами своего массива и будет находиться в определенной
    области
  */
  function randomBallPosition(objArray, radius, unavailableArea) {

    let isCoordsAvailable = true;
    let x = 0;
    let y = 0;

    do {

      isCoordsAvailable = true;

      x = Math.round(Math.random() * (innerWidth - radius * 3)) + radius * 1.5;

      y = Math.round(Math.random() * (innerHeight - radius * 3)) + radius * 1.5;

      /* Проверяем, не будет ли объект с данными координатами
      накладываться на уже созданные объекты
      */
      objArray.forEach((el) => {
        if (Math.sqrt(Math.pow(x - el.x, 2) + Math.pow(y - el.y, 2)) < radius * 2) {
          isCoordsAvailable = false;
        }
      });

      /* Проерить, не будут ли координаты соприкасаться с определенными областями
      */
      if (Math.sqrt(Math.pow(x - unavailableArea.x, 2) + Math.pow(y - unavailableArea.y, 2)) < radius + unavailableArea.r) {
        isCoordsAvailable = false;
      }

    } while (!isCoordsAvailable);

    return { x, y };
  }
  
}

function addActiveBalls(ctx, numberOfElements, startingArea) {
  for (let i = 0; i < numberOfElements; i++) {
     activeBalls.push(new Ball(ctx, startingArea.x, 
                               startingArea.y - startingArea.r + BALLS_RADIUS * 1.5, 
                               BALLS_RADIUS, `#f00`));
  }
}

function winResizeEvent(e) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function mouseMoveEvent(e) {
  mouse.x = e.x;
  mouse.y = e.y;
}

function activeBallMouseDown(e) {
  console.log(`mouseDown`);
}

function activeBallMouseUp(e) {
  console.log(`mouseUp`);
}