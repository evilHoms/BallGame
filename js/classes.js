;'use strict';

/*class VisualObject {
  construct(ctx, x = 0, y = 0, r = 20, color = '#000') {
    this.x = x;
    this.y = y;
    this.r = r;
    
    this.color = color;
    
    this.c = ctx;
  }
  
  update(x = this.x, y = this.y) {
    this.x = x;
    this.y = y;
    
    this.draw();
  }
}*/

class Cursor {
  constructor(ctx, x = 0, y = 0, r = 20, color = '#000') {

    this.x = x;
    this.y = y;
    this.r = r;
    
    this.color = color;
    
    this.c = ctx;
  }
  
  draw() {
    let c = this.c;
    
    c.beginPath();
    c.moveTo(this.x, this.y);
    c.lineTo(this.x + this.r / 2, this.r + this.y);
    c.lineTo(this.r + this.x, this.r / 2 + this.y);
    c.closePath();
    c.fillStyle = this.color;
    c.fill();
  }
  
  update(x = this.x, y = this.y) {
    this.x = x;
    this.y = y;
    
    this.draw();
  }
}


class Ball {
  constructor(ctx, x = 0, y = 0, r = 20, color = '#000') {
    
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = 0;
    this.vy = 0;
    this.a = 0.97;
    
    this.isBoundable = false;
    this.isActive = false;
    
    this.color = color;
    
    this.c = ctx;
  }
    
  draw() {
    let c = this.c;
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
  }
  
  update(x = this.x, y = this.y) {
    if (!this.isActive) {
      this.x = x;
      this.y = y;
    }
    else {
      this.x += this.vx;
      this.y += this.vy;
      
      this.vx *= this.a;
      this.vy *= this.a;
      
      if (this.vx < 0.5 && this.vy < 0.5 && this.vx > -0.5 && this.vy > -0.5) {
        this.vx = 0;
        this.vy = 0;
        this.isActive = false;
        this.isBoundable = true;
      }
    }
    
    this.draw();
  }
  
  checkCollision(arrToCheck) {
    let arr = arrToCheck;
    arr.forEach((el) => {
      if (Math.sqrt(Math.pow(this.x - el.x, 2) + Math.pow(this.y - el.y, 2)) < this.r + el.r) {
        console.log(`collide!`);
      }
      if (this.x + this.r > innerWidth) {
        this.vx = -this.vx;
        this.x = innerWidth - this.r;
      }
      else if (this.x - this.r < 0) {
        this.vx = -this.vx;
        this.x = this.r;
      }
      else if (this.y + this.r > innerHeight) {
        this.vy = -this.vy;
        this.y = innerHeight - this.r;
      }
      else if (this.y - this.r < 0) {
        this.vy = -this.vy;
        this.y = this.r;
      }
    });
  }
}

class Ground {
  constructor(ctx, color = '#999') {
    this.x = innerWidth / 2;
    this.y = innerHeight;
    this.r = innerHeight / 3;
    
    this.color = color;
    
    this.c = ctx;
  }
  
  draw() {
    let c = this.c;
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, Math.PI, true);
    c.fillStyle = this.color;
    c.fill();
  }
  
  update() {
    this.x = innerWidth / 2;
    this.y = innerHeight;
    this.r = innerHeight / 3;
    
    this.draw();
  }
}

class Traectory {
  constructor(ctx, x1, y1, x2, y2, color = `#af0`) {
    this.c = ctx;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
  }
  
  draw() {
    let c = this.c;
    c.beginPath();
    c.moveTo(this.x1, this.y1);
    c.lineTo(this.x2, this.y2);
    c.strokeStyle = this.color;
    c.stroke();
  }
  
  update(x1 = this.x1, y1 = this.y1, x2 = this.x2, y2 = this.y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;;
    
    this.draw(); 
  }
}