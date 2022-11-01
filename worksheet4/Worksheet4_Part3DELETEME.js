window.onload = function init() {
var canvas = document.getElementById("c");
var gl = canvas.getContext("webgl");
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
var program = initShaders(gl, "vertex-shader", "fragment-shader");
gl.useProgram(program);

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);

var va = vec4(0.0, 0.0, 1.0, 1);
var vb = vec4(0.0, 0.942809, -0.333333, 1);
var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
var vd = vec4(0.816497, -0.471405, -0.333333, 1);
var pointsArray = [];
var numTimesToSubdivide = 5;
var normalsArray = [ ];
var isSpinning = false;

tetrahedron(va, vb, vc, vd, numTimesToSubdivide);

render();

//Light stuff
var lightPosL = gl.getUniformLocation(program,"lightPos");
var lp = vec4(0.0,0.0,-1.0,0.0);
gl.uniform4f(lightPosL,lp[0],lp[1],lp[2],lp[3]);

var lightEmisL = gl.getUniformLocation(program,"lightEmis");
var le = vec4(1.0,1.0,1.0,1.0);
gl.uniform4f(lightEmisL,le[0],le[1],le[2],le[3]);

tick();

function tetrahedron(a, b, c, d, n)
{
divideTriangle(a, b, c, n);
divideTriangle(d, c, b, n);
divideTriangle(a, d, b, n);
divideTriangle(a, c, d, n);
}

function divideTriangle(a, b, c, count) {
    if (count > 0) {
    var ab = normalize(mix(a, b, 0.5), true);
    var ac = normalize(mix(a, c, 0.5), true);
    var bc = normalize(mix(b, c, 0.5), true);
    divideTriangle(a, ab, ac, count - 1);
    divideTriangle(ab, b, bc, count - 1);
    divideTriangle(bc, c, ac, count - 1);
    divideTriangle(ab, bc, ac, count - 1);
    } else {
    triangle(a, b, c);
    }
}

function triangle(a, b, c){
    pointsArray.push(a);
    pointsArray.push(b);
    pointsArray.push(c);

    normalsArray.push(vec4(a[0],a[1],a[2],0.0));
    normalsArray.push(vec4(b[0],b[1],b[2],0.0));
    normalsArray.push(vec4(c[0],c[1],c[2],0.0));
}

document.getElementById("Increase").onclick = function () {
    pointsArray = [];
    index = 0;
    numTimesToSubdivide ++;
    console.log("Increased to " + numTimesToSubdivide);
    tetrahedron(va,vb,vc,vd,numTimesToSubdivide);

    render();
};
document.getElementById("Decrease").onclick = function () {
    pointsArray = [];
    index = 0;
    numTimesToSubdivide --;
    console.log("Decreased to: " + numTimesToSubdivide);
    tetrahedron(va,vb,vc,vd,numTimesToSubdivide);

    render();
};
document.getElementById("Spin").onclick = function () {
    isSpinning = !isSpinning;
}

function tick() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    if(isSpinning){
        //Change position of camera.
        console.log("tick");
    }
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
    requestAnimationFrame(tick);
}

function render()   {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    gl.nBuffer = null;
    gl.deleteBuffer(gl.nBuffer);
    gl.nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(normalsArray),gl.STATIC_DRAW);

    var vNormals = gl.getAttribLocation(program, "a_Normals");
    gl.vertexAttribPointer(vNormals, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormals);

    gl.vBuffer = null;
    gl.deleteBuffer(gl.vBuffer);
    gl.vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(pointsArray),gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
    console.log("I rendered");
}
}
