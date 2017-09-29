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
    this.a = 0.98;
    
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
      if (Math.sqrt(Math.pow(this.x - el.x, 2) + Math.pow(this.y - el.y, 2)) < this.r + el.r && el.isBoundable) {
        
        el.isBoundable = false;
        el.color = BALLS_COLORS.hited;
        
        if (this.x < el.x + el.r / 3 * 2 && this.x > el.x - el.r / 3 * 2 && this.y > el.y) {
          this.vx = this.vx;
          this.vy = -this.vy;
        }
        else if (this.y > el.y - el.r / 3 * 2 && this.y < el.y + el.r / 3 * 2 && this.x < el.x) {
          this.vx = -this.vx;
          this.vy = this.vy;
        }
        else if (this.x < el.x + el.r / 3 * 2 && this.x > el.x - el.r / 3 * 2 && this.y < el.y) {
          this.vx = this.vx;
          this.vy = -this.vy;
        }
        else if (this.y < el.y + el.r / 3 * 2 && this.y > el.y - el.r / 3 * 2 && this.x > el.x) {
          this.vx = -this.vx;
          this.vy = this.vy;
        }
        else if (this.x > el.x && this.y < el.y) {
          
          if (this.vx < 0 && this.vy > 0) {
            let xy = this.vx;
            this.vx = this.vy;
            this.vy = xy;
          }
          else if (this.vx > 0 && this.vy > 0 || this.vx < 0 && this.vy < 0) {
            let xy = this.vx;
            this.vx = this.vy;
            this.vy = xy;
          }
          else {
            console.log(`1 error wrong dirrection`);
          }
          
        }
        else if (this.x > el.x && this.y > el.y) {
          
          if (this.vx < 0 && this.vy < 0) {
            let xy = this.vx;
            this.vx = -this.vy;
            this.vy = -xy;
          }
          else if (this.vx > 0 && this.vy < 0 || this.vx < 0 && this.vy > 0) {
            let xy = this.vx;
            this.vx = -this.vy;
            this.vy = -xy;
          }
          else {
            console.log(`3 error wrong dirrection`);
          }
          
        }
        else if (this.x < el.x && this.y < el.y) {
          
          if (this.vx > 0 && this.vy > 0) {
            let xy = this.vx;
            this.vx = -this.vy;
            this.vy = -xy;
          }
          else if (this.vx > 0 && this.vy < 0 || this.vx < 0 && this.vy > 0) {
            let xy = this.vx;
            this.vx = -this.vy;
            this.vy = -xy;
          }
          else {
            console.log(`7 error wrong dirrection`);
          }
          
        }
        else if (this.x < el.x && this.y > el.y) {
          
          if (this.vx > 0 && this.vy < 0) {
            let xy = this.vx;
            this.vx = this.vy;
            this.vy = xy;
          }
          else if (this.vx < 0 && this.vy < 0 || this.vx > 0 && this.vy > 0) {
            let xy = this.vx;
            this.vx = this.vy;
            this.vy = -xy;
          }
          else {
            console.log(`5 error wrong dirrection`);
          }
          
        }
        
        let rProection = {};

        rProection.x = Math.abs(el.x - this.x) * (this.r + el.r) / Math.sqrt(Math.pow((el.x - this.x), 2) + Math.pow(el.y - this.y, 2));
        rProection.y = Math.abs(el.y - this.y) * (this.r + el.r) / Math.sqrt(Math.pow((el.x - this.x), 2) + Math.pow(el.y - this.y, 2));
        
        /* Поправка положения
        */
        if (this.x < el.x) {
          this.x = el.x - rProection.x;
        }
        else if (this.x > el.x) {
          this.x = el.x + rProection.x;
        }
        
        if (this.y < el.y) {
          this.y = el.y - rProection.y;
        }
        else if (this.y > el.y) {
          this.y = el.y + rProection.y;
        }
        
        /*this.vx = 0;
        this.vy = 0;*/
        
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

class Message {
  constructor(ctx, text, x, y, width, height, textPosX, textPosY, color) {
    this.c = ctx;
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.height = height;
    this.textPosX = textPosX;
    this.textPosY = textPosY;
 }
  
  draw() {
    let c = this.c;
    c.beginPath();
    c.rect(this.x, this.y, this.width, this.height);
    c.fillStyle = `#fff`;
    c.font = `normal ${(this.width - this.x) / 5}px Arial`;
    c.fill();
    c.strokeText(this.text, (this.x + this.width) / this.textPosX, (this.y+ this.height) / this.textPosY);
  }
  
  update(x = this.x, y = this.y) {
    this.x = x;
    this.y = y;
    
    this.draw();
  }
}

class Button {
  constructor(ctx, x = 0, y = 0, w = 50, h = 50, text = `empty`) {
    this.c = ctx;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.isActive = false;
  }
  
  draw() {
    let c = this.c;
    c.beginPath();
    c.rect(this.x, this.y, this.w, this.h);
    c.strokeStyle = `#000`;
    c.stroke();
    c.font = `normal ${Math.abs(this.x - this.h) / 8}px Arial`;
    c.fillStyle = `#000`;
    c.fillText(this.text, this.x + this.w / 8, this.y + this.h / 1.5);
  }
  
  update(x = this.x, y = this.y) {
    this.x = x;
    this.y = y;
    
    this.draw();
  }
}

class Text {
  constructor(ctx, x, y, text, fontSize) {
    this.c = ctx;
    this.x = x;
    this.y = y;
    this.text = text;
    this.fontSize = fontSize;
    this.isActive = false;
  }
  
  draw() {
    let c = this.c;
    c.font = `normal ${this.fontSize}px Arial`;
    c.fillStyle = `#000`;
    c.fillText(this.text, this.x, this.y);
  }
  
  update(x = this.x, y = this.y) {
    this.x = x;
    this.y = y;
    
    this.draw();
  }
}