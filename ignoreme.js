window.onload = function init() {

    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(gl.program);


    //Define variables
    var rectangle = [
        vec4(-4, -1, -1, 1),
        vec4(4, -1, -1, 1),
        vec4(4, -1, -21, 1),
        vec4(-4, -1, -21, 1)];

    var textureCoords = [
        vec2(-1.5, 0.0),
        vec2(2.5, 0.0),
        vec2(2.5, 10.0),
        vec2(-1.5, 10.0)];

    var numRows = 8;
    var numCols = 8;
    var texSize = 64;
    var myTexels = new Uint8Array(4 * texSize * texSize);

    //Make checkerboard
    for (var i = 0; i < texSize; ++i) {
        for (var j = 0; j < texSize; ++j) {
            var patchx = Math.floor(i / (texSize / numRows));
            var patchy = Math.floor(j / (texSize / numCols));
            var c = (patchx % 2 !== patchy % 2 ? 255 : 0);
            myTexels[4 * i * texSize + 4 * j] = c;
            myTexels[4 * i * texSize + 4 * j + 1] = c;
            myTexels[4 * i * texSize + 4 * j + 2] = c;
            myTexels[4 * i * texSize + 4 * j + 3] = 255;
        }
    }

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);
    gl.uniform1i(gl.getUniformLocation(gl.program, "texMap"), 0);

       

    //Projection  
    var modelLoc = gl.getUniformLocation(gl.program, "modelMatrix");
    var modelMatrix = mat4();
    gl.uniformMatrix4fv(modelLoc, false, flatten(modelMatrix));

    var viewLoc = gl.getUniformLocation(gl.program, "viewMatrix");
    var viewMatrix = mat4();
    gl.uniformMatrix4fv(viewLoc, false, flatten(viewMatrix));

    var perspectiveLoc = gl.getUniformLocation(gl.program, "projectionMatrix");
    var p = perspective(90, (canvas.height / canvas.width), 0.01, 30.0);
    gl.uniformMatrix4fv(perspectiveLoc, false, flatten(p));

    //Vertices Buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rectangle), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(gl.program, "a_Position");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    //Texture Buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureCoords), gl.STATIC_DRAW);
    var vTexture = gl.getAttribLocation(gl.program, "v_Texture");
    gl.vertexAttribPointer(vTexture, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexture);


    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        console.log(rectangle.length);
    }
    render();
}