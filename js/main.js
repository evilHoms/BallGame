;'use strict';

canvas = document.querySelector(`#drawing-area`);
c = canvas.getContext(`2d`);

canvas.width = innerWidth;
canvas.height = innerHeight;

const BALLS_RADIUS = 20;
const NUMBER_OF_BALLS = { easy: { target: 3, active: 5 }, 
                         normal: { target: 6, active: 4 }, 
                         hard: { target: 10, active: 3 }, 
                         nightmare: { target: 20, active: 1 } 
                        };
const BALLS_COLORS = {
  active: `#700`,
  target: `#add`,
  hited: `#abb`,
  current: `#f00`
}



const mouse = { x: 0, y: 0 };
const cursor = new Cursor(c);
const ground = new Ground(c);
const ACTIVE_BALL_START_POS = { x: ground.x, y: ground.y - ground.r + BALLS_RADIUS * 1.5 };
const strach = new Traectory(c, ACTIVE_BALL_START_POS.x, ACTIVE_BALL_START_POS.y, ACTIVE_BALL_START_POS.x, ACTIVE_BALL_START_POS.y);

const targetBalls = [];
const activeBalls = [];


let isActiveBallPressed = false;
let currentActiveBall = undefined;
let isWin = false;


window.addEventListener(`resize`, winResizeEvent);
window.addEventListener(`mousemove`, mouseMoveEvent);
window.addEventListener(`mousedown`, activeBallMouseDown);
window.addEventListener(`mouseup`, activeBallMouseUp);

addActiveBalls(c, NUMBER_OF_BALLS.easy.active, ground);
addTargetBalls(c, NUMBER_OF_BALLS.easy.target, ground);

animate();


function animate() {
  requestAnimationFrame(animate);
  
  clear();
  
  ground.update();
  updateObjectsArray(c, targetBalls);
  updateObjectsArray(c, activeBalls);
  
  /* При нажатии на активный бол заставляем его перемещаться за курсором
    о отрисовываем силу натяжения и направление
  */
  if (isActiveBallPressed) {
    currentActiveBall.update(mouse.x, mouse.y);
    strach.update(mouse.x, mouse.y);
  }
  else if(currentActiveBall.isActive) {
    strach.update();
    currentActiveBall.checkCollision(targetBalls);
    currentActiveBall.update();
    /* Данное условие выполнится сразу после остановки текущего 
      активного шара
    */
    if (!currentActiveBall.isActive) {
      /* Проверяем, остались ли не выбитые шары
      */
      isWin = true;
      targetBalls.forEach(el => {
        if (el.isBoundable) isWin = false;
      });
      if (isWin) console.log(`You Win!`);
      currentActiveBall.color = BALLS_COLORS.target;
      targetBalls.push(currentActiveBall);
      /* При наличии активных болов в запасе берем один и делаем 
        текущим, иначе игра проиграна
      */
      if (activeBalls.length > 0) currentActiveBall = activeBalls.pop();
      else console.log(`Game Over Mate!`)
    }
  }
  else {
    currentActiveBall.update();
  }
  
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
    
    targetBalls.push(new Ball(ctx, availableXY.x, availableXY.y, BALLS_RADIUS, BALLS_COLORS.target));
    
    targetBalls[i].isBoundable = true;
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
                               BALLS_RADIUS, BALLS_COLORS.active));
  }
  
  currentActiveBall = activeBalls.pop();
  
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
  
  if (Math.sqrt(Math.pow(currentActiveBall.x - e.x, 2) + Math.pow(currentActiveBall.y - e.y, 2)) < BALLS_RADIUS && !currentActiveBall.isActive) {
    console.log(`active ball clicked`);
    isActiveBallPressed = true;
    currentActiveBall.x = e.x;
    currentActiveBall.y = e.y;
    currentActiveBall.color = BALLS_COLORS.current;
  }
  
}

function activeBallMouseUp(e) {

  if (isActiveBallPressed) {
    currentActiveBall.isActive = true;
    isActiveBallPressed = false;

    currentActiveBall.vx = (strach.x2 - strach.x1) / 5;
    currentActiveBall.vy = (strach.y2 - strach.y1) / 5;

    strach.x1 = ACTIVE_BALL_START_POS.x;
    strach.y1 = ACTIVE_BALL_START_POS.y;
    }
  
}