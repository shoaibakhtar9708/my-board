// const { Socket } = require("socket.io");

let canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;

let mouseDown = false;
//api
let tool = canvas.getContext("2d");

let AllpencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthEle = document.querySelector(".pencil-width");
let eraserWidthEle = document.querySelector(".eraser-width");

let clear = document.querySelector('.clear');

let download = document.querySelector(".download");

let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let pencilColor = "red";
let pencilWidth = pencilWidthEle.value;

let eraserWidth = eraserWidthEle.value;
let eraserColor = "white";

let undoRedoTracker = []; // data represent
let track = 0; // represent which actions from tracker array
// tool.strokeStyle="red";
// tool.lineWidth="4";

// tool.beginPath();
// tool.moveTo(10,10);// start point
// tool.lineTo(100,150);//end point
// tool.stroke()//fill colors

tool.strokeStyle = pencilColor;
tool.lineWidth = pencilWidth;

//mousedown --> start new path //mousemove --> path fill

clear.addEventListener("click",(e)=>{
    let data = {
        x1:0,
        y1:0,
        x2:canvas.width,
        y2:canvas.height
    }
    socket.emit("clear",data);
    //tool.clearRect(0, 0, canvas.width, canvas.height);
})

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  //   tool.beginPath();
  //   tool.moveTo(e.clientX, e.clientY);

  let data = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: eraserFlag ? eraserColor : pencilColor,
      width: eraserFlag ? eraserWidth : pencilWidth,
    };
    socket.emit("drawStroke", data);
    // drawStroke({
    //   x: e.clientX,
    //   y: e.clientY,
    //   color: eraserFlag ? eraserColor : pencilColor,
    //   width: eraserFlag ? eraserWidth : pencilWidth,
    // });
  }
  //   if (mouseDown) {
  //     tool.lineTo(e.clientX, e.clientY);
  //     tool.stroke();
  //   }
});

canvas.addEventListener("mouseup", (e) => {
  mouseDown = false;

  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

function clearScreen(strokeObj){
    tool.clearRect(0, 0, canvas.width, canvas.height);
}

AllpencilColor.forEach((colorEle) => {
  colorEle.addEventListener("click", (e) => {
    let color = colorEle.classList[0];
    pencilColor = color;
    tool.strokeStyle = pencilColor;
    //console.log(pencilColor);
  });
});

pencilWidthEle.addEventListener("change", (e) => {
  pencilWidth = pencilWidthEle.value;
  tool.lineWidth = pencilWidth;
});

eraserWidthEle.addEventListener("change", (e) => {
  eraserWidth = eraserWidthEle.value;
  tool.lineWidth = eraserWidth;
});

eraser.addEventListener("click", (e) => {
  if (eraserFlag) {
    tool.strokeStyle = eraserColor;
    tool.lineWidth = eraserWidth;
  } else {
    tool.strokeStyle = pencilColor;
    tool.lineWidth = pencilWidth;
  }
});

download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

redo.addEventListener("click", (e) => {
  if (track > 0) {
    track--;
  }
//   let trackobj = {
//     trackValue: track,
//     undoRedoTracker,
//   };
  //track action
  //   undoRedoCanvas(trackobj);


  let data ={
    trackValue: track,
    undoRedoTracker,
  }
  socket.emit("redoUndo", data);
});

undo.addEventListener("click", (e) => {
  if (track < undoRedoTracker.length - 1) {
    track++;
  }
//   let trackobj = {
//     trackValue: track,
//     undoRedoTracker,
//   };
//   //track actions
//   undoRedoCanvas(trackobj);

  let data ={
    trackValue: track,
    undoRedoTracker,
  }
  socket.emit("redoUndo", data);
});

function undoRedoCanvas(trackobj) {
  track = trackobj.trackValue;
  undoRedoTracker = trackobj.undoRedoTracker;

  let url = undoRedoTracker[track];
  let img = new Image(); // new image refrence
  img.src = url;
  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

socket.on("beginPath", (data) => {
  // data from server
  beginPath(data);
});

socket.on("drawStroke", (data) => {
  // data from server
  drawStroke(data);
});

socket.on("redoUndo", (data) => {
  // data from server
  undoRedoCanvas(data);
});

socket.on("clear", (data) => {
  // data from server
  clearScreen(data);
});

