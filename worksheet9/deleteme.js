var g_objDoc = null;
var g_drawingInfo = null;
////var teapotIsReady = false;

window.onload = function init() {
    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);

    //Initialization for Teapot
    var programTeapot = initShaders(gl, "vertex-shader-teapot", "fragment-shader-teapot");
    gl.useProgram(programTeapot);

    programTeapot.a_Position = gl.getAttribLocation(programTeapot, 'a_PositionTea');
    programTeapot.a_Normal = gl.getAttribLocation(programTeapot, 'a_NormalTea');
    programTeapot.a_Color = gl.getAttribLocation(programTeapot, 'a_ColorTea');

    //Create buffers
    var teapotModel = {
        vertexBuffer: createEmptyArrayBuffer(gl, programTeapot.position, 3, gl.FLOAT),
        normalBuffer: createEmptyArrayBuffer(gl, programTeapot.normal, 3, gl.FLOAT),
        colorBuffer: createEmptyArrayBuffer(gl, programTeapot.color, 4, gl.FLOAT),
        indexBuffer: gl.createBuffer()
    }

    readOBJFile('teapot.obj', gl, teapotModel, 4, true);


    //Initialization for Ground plane
    var programPlane = initShaders(gl, "vertex-shader-plane", "fragment-shader-plane");
    gl.useProgram(programPlane);

    programPlane.a_Position = gl.getAttribLocation(programPlane, 'a_PositionPlane');
    programPlane.a_Texture = gl.getAttribLocation(programPlane, 'a_TexturePlane');
    programPlane.a_TexturePos = gl.getAttribLocation(programPlane, 'a_TexturePosPlane');

    //Set coords for the plane vetecies
    var vertices = [
        vec3(-2, -1, -1),
        vec3(-2, -1, -5),
        vec3(2, -1, -5),
        vec3(2, -1, -1), //First 4 is the large texture (ground)
    ];

    var tCoords = [
        vec2(-1, -1),
        vec2(-1, 1),
        vec2(1, 1),
        vec2(1, -1),
    ];

    var indices = [0, 3, 2, 0, 2, 1];

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programPlane.a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programPlane.a_Position);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tCoords), gl.STATIC_DRAW);
    gl.vertexAttribPointer(programPlane.a_TexturePos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programPlane.a_TexturePos);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    //Load image from file
    var image = document.createElement('img');
    image.crossorigin = 'anonymous';
    image.onload = e => {
        var texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        //gl.uniform1i(programPlane.a_Texture, 0);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    image.src = 'xamp23.png';


    //Projectionmatrix of the shadow and defining variables for light
    var rotate = 0;
    var lightY = 5;
    var lightX;
    var lightZ;
    var translationY = 0;
    var shadowProjection = mat4(1);
    shadowProjection[3][3] = 0;
    shadowProjection[3][1] = 1 / -(lightY - (-1)); // -1 is the position of the ground


    //Toggle buttons for position, light rotation and bounc
    var bounce = true;
    var lightRot = true;
    var topPos = false;

    var bounceButton = document.getElementById("bounce");
    bounceButton.addEventListener("click", function () {
        bounce = !bounce;
    });

    var LightButton = document.getElementById("light");
    LightButton.addEventListener("click", function () {
        lightRot = !lightRot;
    });

    var lookAtEye;
    var PosButton = document.getElementById("pos");
    PosButton.addEventListener("click", function () {
        topPos = !topPos;
    });

    function render() {

        gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        //Render in the plane
        gl.useProgram(programPlane);

        initAttributeVariable(gl, programPlane.a_Position, vBuffer, 3);
        initAttributeVariable(gl, programPlane.a_TexturePos, tBuffer, 2);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        if (topPos == true) {
            lookAtEye = vec3(0, 3, -3.001);
        } else {
            lookAtEye = vec3(0, 0, 0);
        }

        var projectionMatrix = [
            perspective(90, 1, 1, 20),
            lookAt(lookAtEye, vec3(0, 0, -3), vec3(0, 1, 0)),
        ].reduce(mult);

        var uLocation = gl.getUniformLocation(programPlane, 'ProjectionMatrix1');
        gl.uniformMatrix4fv(uLocation, false, flatten(projectionMatrix));
        {
            var uLocation = gl.getUniformLocation(programPlane, 'modelViewMatrix');
            gl.uniformMatrix4fv(uLocation, false, flatten(mat4()));
        }
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);


        rotate = rotate + 0.05;

        if (lightRot == true) {
            lightX = 3 * Math.sin(rotate);
            lightZ = 3 * (-1 + Math.cos(rotate));
        } else {
            lightX = 0;
            lightZ = -3;
        }

        //Render in the Teapot
        gl.useProgram(programTeapot);
        initAttributeVariable(gl, programTeapot.a_Position, teapotModel.vertexBuffer, 3);
        initAttributeVariable(gl, programTeapot.a_Color, teapotModel.colorBuffer, 4);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotModel.indexBuffer);
        console.log(g_drawingInfo + ", " + g_objDoc);

        if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
            g_drawingInfo = onReadComplete(gl, teapotModel, g_objDoc);
        }

        if (!g_drawingInfo) {
            window.requestAnimationFrame(render);
            return;
        } else {
            if (bounce == true) {
                translationY = -0.5 * Math.cos(rotate);
                var modelViewMatrix = [
                    translate(0, translationY, -3),
                    scalem(0.1, 0.1, 0.1),
                ].reduce(mult);
            } else {
                translationY = -0.5;
                var modelViewMatrix = [
                    translate(0, translationY, -3),
                    scalem(0.1, 0.1, 0.1),
                ].reduce(mult);
            }

            //render Shadow
            var modelView = [
                translate(0, -0.0001, 0),
                translate(lightX, lightY, lightZ),
                shadowProjection,
                translate(-lightX, -lightY, -lightZ),
                modelViewMatrix
            ].reduce(mult);

            var uLocation = gl.getUniformLocation(programTeapot, 'modelViewMatrix');
            gl.uniformMatrix4fv(uLocation, false, flatten(modelView));

            // shadow mode
            var visLocation = gl.getUniformLocation(programTeapot, 'visible');
            gl.uniform1f(visLocation, false);
            gl.depthFunc(gl.GREATER);

            gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
            

            //render teapot
            var uLocation = gl.getUniformLocation(programTeapot, 'modelViewMatrix');
            gl.uniformMatrix4fv(uLocation, false, flatten(modelViewMatrix));
            
            var uLocation = gl.getUniformLocation(programTeapot, 'ProjectionMatrix2');
            gl.uniformMatrix4fv(uLocation, false, flatten(projectionMatrix));
            
            gl.depthFunc(gl.LESS);
            var visLocation = gl.getUniformLocation(programTeapot, 'visible');
            gl.uniform1f(visLocation, true);

            gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
        }
        window.requestAnimationFrame(render);
    }
    render();
}


function createEmptyArrayBuffer(gl, attribute, num, type) {
    var buffer = gl.createBuffer(); // Create a buffer object

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(attribute); // Enable the assignment

    return buffer;
}

function initAttributeVariable(gl, attribute, buffer, n) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, n, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
}

//Functions for loading in the object (taken from WS 5.3)
function initVertexBuffers(gl, programTeapot) {
    var teapot = new Object();
    teapot.vertexBuffer = createEmptyArrayBuffer(gl, programTeapot.a_Position, 3, gl.FLOAT);
    teapot.normalBuffer = createEmptyArrayBuffer(gl, programTeapot.a_Normal, 3, gl.FLOAT);
    teapot.colorBuffer = createEmptyArrayBuffer(gl, programTeapot.a_Color, 4, gl.FLOAT);
    teapot.indexBuffer = gl.createBuffer();

    return teapot;
}

// Read a file
function readOBJFile(fileName, gl, model, scale, reverse) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status !== 404) {
            onReadOBJFile(request.responseText, fileName, gl, model, scale, reverse);
        }
    }
    request.open('GET', fileName, true); // Create a request to get file
    request.send();
}

// OBJ file has been read
function onReadOBJFile(fileString, fileName, gl, o, scale, reverse) {
    var objDoc = new OBJDoc(fileName); // Create a OBJDoc object
    var result = objDoc.parse(fileString, scale, reverse);
    console.log(result);
    if (!result) {
        g_objDoc = null; g_drawingInfo = null;
        console.log("OBJ file parsing error.");
        return;
    } else {
        console.log(objDoc);
        g_objDoc = objDoc;
        teapotIsReady = true;
        console.log(g_objDoc);
    }
}

// OBJ File has been read completely
function onReadComplete(gl, model, objDoc) {
    var drawingInfo = objDoc.getDrawingInfo();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.vertices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);

    return drawingInfo;
}