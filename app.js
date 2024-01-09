const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
document.body.style.overflow = "hidden";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let circles = [];
const borders = {
  x: 100,
  y: 100,
  w: canvas.width - 200,
  h: canvas.height - 200,
};

function squareCollisionDetection(obj1, obj2) {
  const XColl1 = obj1.x + obj1.w >= obj2.x && obj1.x <= obj2.x + obj2.w;
  const YColl1 = obj1.y + obj1.h >= obj2.y && obj1.y <= obj2.y + obj2.h;
  if (XColl1 && YColl1) return XColl1 && YColl1;

  const XColl2 = obj2.x + obj2.w >= obj1.x && obj2.x <= obj1.x + obj1.w;
  const YColl2 = obj2.y + obj2.h >= obj1.y && obj2.y <= obj1.y + obj1.h;
  return XColl2 && YColl2;
}

class Circle {
  constructor(x, y, xs, ys, radius) {
    this.x = x - radius;
    this.y = y - radius;
    this.w = 2 * radius;
    this.h = 2 * radius;
    this.xm = x;
    this.ym = y;
    this.xs = xs;
    this.ys = ys;
    this.radius = radius;
    this.hex = (Math.floor(Math.random() * (200 - 50 + 1)) + 50).toString(16);
  }
  update() {
    this.x = this.xm - this.radius;
    this.y = this.ym - this.radius;

    this.xm += this.xs;
    this.ym += this.ys;

    if (this.xm > canvas.width + 1) {
      this.xs = Math.random() * 1.99 + 0.01;
      this.xm = 0;
    }
    if (this.ym > canvas.height + 1) {
      this.ys = Math.random() * 1.99 + 0.01;
      this.ym = 0;
    }
    if (this.xm < -1) {
      this.xs = -1 * (Math.random() * 1.99 + 0.01);
      this.xm = canvas.width;
    }
    if (this.ym < -1) {
      this.ys = -1 * (Math.random() * 1.99 + 0.01);
      this.ym = canvas.height;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.xm, this.ym, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#" + this.hex + this.hex + this.hex;
    ctx.fill();
  }
}

for (let i = 0; i < 200; i++) {
  circles.push(
    new Circle(
      Math.floor(Math.random() * (canvas.width - 10 + 1)) + 10,
      Math.floor(Math.random() * (canvas.height - 10 + 1)) + 10,
      Math.random() * 1 * (Math.random() * 2 > 1 ? -1 : 1),
      Math.random() * 1 * (Math.random() * 2 > 1 ? -1 : 1),
      Math.floor(Math.random() * (5 - 3 + 1)) + 3
    )
  );
}

function start() {
  requestAnimationFrame(start);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#7775";
  for (let circle1 of circles)
    for (let circle2 of circles)
      if (
        circle1 !== circle2 &&
        Math.hypot(circle1.xm - circle2.xm, circle1.ym - circle2.ym) < 250
      ) {
        ctx.moveTo(circle1.xm, circle1.ym);
        ctx.lineTo(circle2.xm, circle2.ym);
      }

  let arr = circles.filter((circle) => {
    if (!squareCollisionDetection(circle, borders)) {
      return true;
    }
  });

  for (let circle1 of arr) {
    let direction = "";
    if (circle1.xm <= 100) {
      direction += "l";
    }
    if (circle1.xm >= canvas.width - 100) {
      direction += "r";
    }
    if (circle1.ym <= 100) {
      direction += "u";
    }
    if (circle1.ym >= canvas.height - 100) {
      direction += "d";
    }

    for (let circle2 of arr) {
      let distanseX = (circle1.xm > circle2.xm) ? circle2.xm + (canvas.width - circle1.xm ) : circle1.xm + (canvas.width - circle2.xm );
      let distanseY = (circle1.ym > circle2.ym) ? circle2.ym + (canvas.height - circle1.ym ) : circle1.ym + (canvas.height - circle2.ym );
      // console.log(distanseX, distanseY, Math.hypot(distanseX, distanseY))
      if ( circle1 !== circle2 && Math.hypot(distanseX, distanseY) < 500) {
        if (direction.indexOf("l") !== -1) {
          if (circle2.xm >= canvas.width - 100) {
            ctx.moveTo(circle1.xm, circle1.ym);
            ctx.lineTo(0, circle1.ym + distanseY/2);
            ctx.moveTo(canvas.width, circle2.ym - distanseY/2);
            ctx.lineTo(circle2.xm, circle2.ym);
          }
        }

        if (direction.indexOf("r") !== -1) {
          if (circle2.xm <= 100) {
            ctx.moveTo(circle1.xm, circle1.ym);
            ctx.lineTo(canvas.width, circle1.ym + distanseY/2);
            ctx.moveTo(0, circle2.ym - distanseY/2);
            ctx.lineTo(circle2.xm, circle2.ym);
          }
        }

        if (direction.indexOf("u") !== -1) {
          if (
            circle2.ym >= canvas.height - 100
          ) {
            ctx.moveTo(circle1.xm, circle1.ym);
            ctx.lineTo(circle1.xm + distanseX/2, 0);
            ctx.moveTo(circle2.xm - distanseX/2, canvas.height);
            ctx.lineTo(circle2.xm, circle2.ym);
          }
        }

        if (direction.indexOf("d") !== -1) {
          if (circle2.ym <= 100) {
            ctx.moveTo(circle1.xm, circle1.ym);
            ctx.lineTo(circle1.xm + distanseX/2, canvas.height);
            ctx.moveTo(circle2.xm - distanseX/2, 0);
            ctx.lineTo(circle2.xm, circle2.ym);
          }
        }
      }
    }
  }
  ctx.stroke();

  for (let circle of circles) {
    circle.update();
    circle.draw();
  }
}

start();
