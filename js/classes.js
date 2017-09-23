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
    this.x = x;
    this.y = y;
    
    this.draw();
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