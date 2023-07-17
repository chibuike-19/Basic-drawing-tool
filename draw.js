const canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d",{willReadFrequently: true});
const fillColor = document.querySelector("#fill-check");
const toolBtn = document.querySelectorAll(".tool");
const colorBtn = document.querySelectorAll(".colors .option");
let colorPicker = document.querySelector("#color-picker");
let clearCanvas = document.querySelector(".clear-canvas");
let saveImage = document.querySelector(".save-img");
const slider = document.querySelector('#slide-range')

let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let brushWidth = 2;
let selectedTool = "brush";
let selectedColor = "rgb(0, 0, 0)";


const setBackGroundColor = () => {
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = selectedColor
}

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setBackGroundColor();
});

const drawRectangle = (e) => {
  if (!fillColor.checked) {
    ctx.strokeRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  } else {
    ctx.fillRect(
      e.offsetX,
      e.offsetY,
      prevMouseX - e.offsetX,
      prevMouseY - e.offsetY
    );
  }
};

const drawCircle = (e) => {
  ctx.beginPath();

  let radius = Math.sqrt(
    Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const startDraw = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
};

const drawing = (e) => {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  if (selectedTool == "brush" || selectedTool == 'eraser') {
    ctx.strokeStyle = selectedTool == 'eraser' ? '#fff' : selectedColor
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (selectedTool == "rectangle") {
    drawRectangle(e);
  } else if (selectedTool == "circle") {
    drawCircle(e);
  } else if (selectedTool == "triangle") {
    drawTriangle(e);
  }
};

toolBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    
    document.querySelector(".options .active").classList.remove("active");
    selectedTool = btn.id;
    console.log(selectedTool);
    btn.classList.add("active");
  });
});

colorBtn.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.options .selected').classList.remove('selected')
    btn.classList.add('selected')
    selectedColor = window.getComputedStyle(btn).getPropertyValue('background-color')
  })
});

colorPicker.addEventListener('change', () => {
  colorPicker.parentElement.style.backgroundColor = colorPicker.value;
  colorPicker.parentElement.click()
})

clearCanvas.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  setBackGroundColor();
})

saveImage.addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = `${Date.now()}.jpeg`
  link.href = canvas.toDataURL();
  link.click();
})
slider.addEventListener('change', () => brushWidth = slider.value)
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", () => (isDrawing = false));
