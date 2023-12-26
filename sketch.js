let myShader;
let input;
let img;

function preload() {
  // 1. preload our vertex & fragment shaders
  myShader = loadShader('displayTexture.vert', 'displayTexture.frag');
}

function setup() {
  // createFileInput for image upload
  input = createFileInput(handleImage);
  input.position(20, 120);

  // create our window with default size, use webgl for drawing
  createCanvas(1000, 1000, WEBGL); // Default size, will be adjusted later
}

function draw(){
  if (img) {
    // 'bind' the shader
    shader(myShader);
    myShader.setUniform("uTexture0", img);
    myShader.setUniform("u_resolution", [width, height]);
    myShader.setUniform("u_time", millis()/630);

    // draw a rectangle mesh that takes up the whole screen
    rect(0, 0, width, height);
  }
}

// Create an image if the file is an image and adjust canvas size
function handleImage(file) {
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();

    // Resize the canvas to match the uploaded image dimensions
    img.onload = () => {
      resizeCanvas(img.width, img.height);
    };
  } else {
    img = null;
  }
}