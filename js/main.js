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
const NUMBER_OF_BALLS = { easy: 3, normal: 6, hard: 10, nightmare: 20 };



window.addEventListener(`resize`, () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});

window.addEventListener(`mousemove`, (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});


addBallsToArr(c, targetBalls, NUMBER_OF_BALLS.nightmare);
animate();


function animate() {
  requestAnimationFrame(animate);
  
  clear();
  
  ground.update();
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

/* Создаем объекты Ball и помещаем их в переданный массив, 
  отрисовки в этом методе не происходит
*/
function addBallsToArr(ctx, objArray, numberOfElements, area) {
  
  let availableXY;
  
  for (let i = 0; i < numberOfElements; i++) {
    
    availableXY = randomBallPosition(objArray, BALLS_RADIUS, ground);
    objArray.push(new Ball(ctx, availableXY.x, availableXY.y, BALLS_RADIUS, TARGET_BALLS_COLOR));
    
  }
  
  availableXY = randomBallPosition(objArray, BALLS_RADIUS, ground);
  objArray.push(new Ball(ctx, availableXY.x, availableXY.y, BALLS_RADIUS, `#f00`));

}

/* Создаем рандомные координаты, новый обхект с которыми не будет соприкосаться
  с остальными объектами своего массива и будет находиться в определенной
  области
*/
function randomBallPosition(objArray, radius, wrongArea) {

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
    if (Math.sqrt(Math.pow(x - wrongArea.x, 2) + Math.pow(y - wrongArea.y, 2)) < radius + wrongArea.r) {
      isCoordsAvailable = false;
    }

  } while (!isCoordsAvailable);

  return { x, y };
}
