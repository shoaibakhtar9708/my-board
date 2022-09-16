let optionsCont = document.querySelector(".options-cont");

let toolsCont = document.querySelector(".tools-cont");
let pencilToolCon = document.querySelector(".pencil-tool-cont");
let eraserToolCon = document.querySelector(".eraser-tool-cont");

let pencil = document.querySelector(".fa-pencil");
let eraser = document.querySelector(".fa-eraser");

let pencilFlag = false;
let eraserFlag = false;

let sticky = document.querySelector(".sticky");

let upload = document.querySelector(".upload");
//true -- show tools
// false hide tools
optionsCont.addEventListener("click", (e) => {
  let iconEle = optionsCont.children[0];
  let isPresent = iconEle.classList.contains("fa-bars");
  // console.log(isPresent);

  if (isPresent) {
    iconEle.classList.remove("fa-bars");
    iconEle.classList.add("fa-xmark");
    toolsCont.style.display = "flex";
  } else {
    iconEle.classList.remove("fa-xmark");
    iconEle.classList.add("fa-bars");
    toolsCont.style.display = "none";

    pencilToolCon.style.display = "none";
    eraserToolCon.style.display = "none";
  }
});

pencil.addEventListener("click", (e) => {
  // true --> show pencil tool
  // false --> hide tool
  pencilFlag = !pencilFlag;
  if (pencilFlag) {
    eraserToolCon.style.display = "none";
    pencilToolCon.style.display = "block";
  } else {
    pencilToolCon.style.display = "none";
  }
});
eraser.addEventListener("click", (e) => {
  // true --> show pencil tool
  // false --> hide tool
  eraserFlag = !eraserFlag;
  if (eraserFlag) {
    pencilToolCon.style.display = "none";
    eraserToolCon.style.display = "flex";
  } else {
    eraserToolCon.style.display = "none";
  }
});

upload.addEventListener("click", (e) => {
  //open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = `
      <div class="header-cont">
              <div class="minimize"></div>
              <div class="remove"></div>
          </div>
          <div class="note-cont">
              <img src="${url}">
          </div>`;

    document.body.appendChild(stickyCont);

    let minimize = document.querySelector(".minimize");
    let remove = document.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
      drag_Drop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
      return false;
    };
  });
});

sticky.addEventListener("click", (e) => {
  let stickyCont = document.createElement("div");
  stickyCont.setAttribute("class", "sticky-cont");
  stickyCont.innerHTML = `
    <div class="header-cont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-cont">
            <textarea name="" id="" cols="30" rows="10"></textarea>
        </div>`;

  document.body.appendChild(stickyCont);

  let minimize = document.querySelector(".minimize");
  let remove = document.querySelector(".remove");
  noteActions(minimize, remove, stickyCont);

  stickyCont.onmousedown = function (event) {
    drag_Drop(stickyCont, event);
  };

  stickyCont.ondragstart = function () {
    return false;
  };
});

function drag_Drop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;
  //   document.body.append(element);

  moveAt(event.pageX, event.pageY);

  // moves the ball at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the ball on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the ball, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}

function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  });

  minimize.addEventListener("click", (e) => {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") {
      noteCont.style.display = "block";
      console.log(display);
    } else {
      noteCont.style.display = "none";
      console.log(display);
    }
  });
}
