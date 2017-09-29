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

const startMsg = new Message(c, `BALL EM ALL!!!`, innerWidth / 4, innerHeight / 4, innerWidth / 2, innerHeight / 2, 2.2, 1.9, `#000`);
const winMsg = new Message(c, `YOU WIN!!!`, innerWidth / 4, innerHeight / 4, innerWidth / 2, innerHeight / 2, 2, 1.9, `#000`);
const looseMsg = new Message(c, `YOU LOOSE!!!`, innerWidth / 4, innerHeight / 4, innerWidth / 2, innerHeight / 2, 2.25, 1.9, `#000`);

const helpText = [];
helpText.push(new Text(c, innerWidth / 5, innerHeight / 5, `Your goal is to knock out all blue balls.`, 14));
helpText.push(new Text(c, innerWidth / 5, innerHeight / 4, `If your current mooving ball stops, it becomes`, 14));
helpText.push(new Text(c, innerWidth / 5, innerHeight / 3.3, `blue and you should knock it out too.`, 14));
helpText.push(new Text(c, innerWidth / 5, innerHeight / 2.8, `You loose if your red balls ends and blue balls still standing.`, 14));

const buttons = [];
const startBtn = new Button(c, startMsg.x + startMsg.width / 4.5, startMsg.y + startMsg.height / 2.8, startMsg.width / 1.8, startMsg.height / 5, `START`);
const optionsBtn = new Button(c, startMsg.x + startMsg.width / 4.5, startMsg.y + startMsg.height / 1.8, startMsg.width / 1.8, startMsg.height / 5, `OPTIONS`);
const retryBtn = new Button(c, startMsg.x + startMsg.width / 4.5, startMsg.y + startMsg.height / 2.8, startMsg.width / 1.8, startMsg.height / 5, `RETRY`);
const helpBtn = new Button(c, startMsg.x + startMsg.width / 4.5, startMsg.y + startMsg.height / 1.33, startMsg.width / 1.8, startMsg.height / 5, `HELP`);
buttons.push(startBtn, optionsBtn, retryBtn, helpBtn);

const GAME_STATE = {
  inGame: false,
  isWin: false,
  isLoose: false,
  difficulty: `easy`
};

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
window.addEventListener(`click`, clickEvent);

addActiveBalls(c, NUMBER_OF_BALLS.normal.active, ground);
addTargetBalls(c, NUMBER_OF_BALLS.normal.target, ground);

animate();


function animate() {
  requestAnimationFrame(animate);
  
  clear();
  
  if (!GAME_STATE.inGame) {
    if (GAME_STATE.isWin) {
      /* Действия в случае победы */
      
      retryBtn.isActive = true;
      helpBtn.isActive = true;
      optionsBtn.isActive = true;
      winMsg.update();
      retryBtn.update();
      helpBtn.update();
      optionsBtn.update();
      helpText.forEach(el => {
        if (el.isActive) el.update();
      });
    }
    else if (GAME_STATE.isLoose) {
      /* Действия  случае поражения */
      
      retryBtn.isActive = true;
      helpBtn.isActive = true;
      optionsBtn.isActive = true;
      looseMsg.update();
      retryBtn.update();
      helpBtn.update();
      optionsBtn.update();
      helpText.forEach(el => {
        if (el.isActive) el.update();
      });
    }
    else {
      /* Действия при заходе на страницу с игрой */
      
      startBtn.isActive = true;
      helpBtn.isActive = true;
      optionsBtn.isActive = true;
      startMsg.update();
      startBtn.update();
      helpBtn.update();
      optionsBtn.update();
      helpText.forEach(el => {
        if (el.isActive) el.update();
      });
    }
  }
  else {
    /* Обновление игрового экрана */
    
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
        if (isWin) { 
          GAME_STATE.inGame = false;
          GAME_STATE.isWin = true;
        }
        currentActiveBall.color = BALLS_COLORS.hited;
        targetBalls.push(currentActiveBall);
        targetBalls[targetBalls.length - 1].isBoundable = false;
        /* При наличии активных болов в запасе берем один и делаем 
          текущим, иначе игра проиграна
        */
        if (activeBalls.length > 0) currentActiveBall = activeBalls.pop();
        else {
          GAME_STATE.inGame = false;
          GAME_STATE.isLoose = true;
        }
      }
    }
    else {
      currentActiveBall.update();
    }
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
/* Создаем активные болы, которые будем запускать, верхний болл
  из массива помещается в переменную текущего бола
*/
function addActiveBalls(ctx, numberOfElements, startingArea) {
  
  for (let i = 0; i < numberOfElements; i++) {
     activeBalls.push(new Ball(ctx, startingArea.x, 
                               startingArea.y - startingArea.r + BALLS_RADIUS * 1.5, 
                               BALLS_RADIUS, BALLS_COLORS.active));
  }
  
  currentActiveBall = activeBalls.pop();
  
}

/*function winAction(ctx) {
  console.log(`You Win!`);
}*/

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

function clickEvent(e) {
  
  buttons.forEach(el => {
    if (mouse.x > el.x && mouse.y > el.y && mouse.x < el.x + el.w && mouse.y < el.y + el.h && el.isActive) {
      
      if (el.text === `START`) {
        GAME_STATE.inGame = true;
        el.isActive = false;
      }
      else if (el.text === `RETRY`) {
        GAME_STATE.inGame = true;
        GAME_STATE.isLoose = false;
        GAME_STATE.isWin = false;
        el.isActive = false;  
        
        isActiveBallPressed = false;
        currentActiveBall = undefined;
        isWin = false;
        
        activeBalls.splice(0);
        targetBalls.splice(0);
        
        addActiveBalls(c, NUMBER_OF_BALLS.normal.active, ground);
        addTargetBalls(c, NUMBER_OF_BALLS.normal.target, ground);
      }
      else if (el.text === `OPTIONS`) {
        chooseDifficulty();
      }
      else if (el.text === `HELP`) {
        //helpMenu();     
      }
    }
  });
}

function chooseDifficulty() {
  
}

function helpMenu() { 
  helpText.forEach(el => {
    console.log(`click`);
    el.isActive = el.isActive === true ? false : true;
  });
}