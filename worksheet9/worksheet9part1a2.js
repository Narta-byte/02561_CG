window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var program = initShaders(gl, "vertex-shader-tea", "fragment-shader-tea");
    gl.useProgram(program);
   
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);

    var eye = vec3(1*Math.sin(0.33),0.33,1*Math.cos(0.33));
    var at = vec3(0.,0.,0.)
    var up = vec3(0.,1.,0.)
    var VA = lookAt(eye,at,up);
    var modelViewMatrixLoc = gl.getUniformLocation(program, "ModelViewPosition");
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
    
    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_Normals = gl.getAttribLocation(program, 'a_Normals');
    program.v_Color = gl.getAttribLocation(program, 'v_Color');
    
    var model = initVertexBuffers(gl, program);
    readOBJFile('LilleKatrine.obj', gl, model, 4, true);
    // Perspective
    var p = perspective(90, (canvas.height/canvas.width), 0.01, 100);
    var P = gl.getUniformLocation(program,"P");
    gl.uniformMatrix4fv(P,false,flatten(p));

    pointsArray = []
    index = 0
    gl.vBuffer = null;
    
    //translation
    var v = mat4()
    var V = gl.getUniformLocation(program,"V");
    gl.uniformMatrix4fv(V,false,flatten(v));
    //modelview
    var lightPosL = gl.getUniformLocation(program,"lightPos");
    var lp = vec4(50.0,-150.0,50.0,0.0);
    gl.uniform4f(lightPosL,lp[0],lp[1],lp[2],lp[3]);
        
    var lightEmisL = gl.getUniformLocation(program,"lightEmis");
    var le = vec4(1.0,1.0,1.0,1.0);
    gl.uniform4f(lightEmisL,le[0],le[1],le[2],le[3]);
    
    function render(gl, numPoints)
    {

        gl.useProgram(program);
        // initAttributeVariable(gl, program.a_Position, model.vertexBuffer, 3);
        // initAttributeVariable(gl, program.a_Color, model.colorBuffer, 4);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
            
        if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
            // OBJ and all MTLs are available
            g_drawingInfo = onReadComplete(gl, model, g_objDoc);
            }
        if (!g_drawingInfo) return;


        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
    }
    function tick() { render(gl, pointsArray.length); requestAnimationFrame(tick);
     }
    tick();   
    function initAttributeVariable(gl, attribute, buffer)
    {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribute, buffer.num, buffer.type, false, 0, 0);
    gl.enableVertexAttribArray(attribute);
    }


    function initVertexBuffers(gl, program) {
        var o = new Object();
        o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
        o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normals, 3, gl.FLOAT);
        o.colorBuffer = createEmptyArrayBuffer(gl, program.v_Color, 4, gl.FLOAT);
        o.indexBuffer = gl.createBuffer();
    
        return o;
    }
    
    // Create a buffer object, assign it to attribute variables
    function createEmptyArrayBuffer(gl, a_attribute, num, type) {
        var buffer = gl.createBuffer(); // Create a buffer object
    
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
        gl.enableVertexAttribArray(a_attribute); // Enable the assignment
    
        return buffer;
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
    
    var g_objDoc = null;
    var g_drawingInfo = null;
    
    // OBJ file has been read
    function onReadOBJFile(fileString, fileName, gl, o, scale, reverse) {
        var objDoc = new OBJDoc(fileName); // Create a OBJDoc object
        var result = objDoc.parse(fileString, scale, reverse);
        if (!result) {
            g_objDoc = null; g_drawingInfo = null;
            console.log("OBJ file parsing error.");
            return;
        }
        g_objDoc = objDoc;
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
}