window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    // gl.cullFce(gl.BACK);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
   
    gl.frontFace(gl.CCW);
    
 

    var pointsArray = []
    var index = 0 
    var betaloc = gl.getUniformLocation(program, "betaloc");
    var beta = 0.0;
    var alphaloc = gl.getUniformLocation(program, "alphaloc");
    var alpha = 0.2;
    var r = 1;
    // var eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
    var eye = vec3(r*Math.sin(0.33),0.33,r*Math.cos(0.33));
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
    var p = perspective(45, (canvas.height/canvas.width), 0.01, 100);
    var P = gl.getUniformLocation(program,"P");
    gl.uniformMatrix4fv(P,false,flatten(p));

    var Ka = 0.0;
    var kd = 1.0;
    var ks = 1.0;
    var a = 0.0;
    var s = 10.0;
    var le = vec4(1.0,1.0,1.0,1.0);







    spaghetti()
    function spaghetti() {
        pointsArray = []
        index = 0
        gl.vBuffer = null;
        
        //translation
        var v = mat4()
        var V = gl.getUniformLocation(program,"V");
        gl.uniformMatrix4fv(V,false,flatten(v));
        //modelview
        // var modelViewMatrixLoc = gl.getUniformLocation(program, "ModelViewPosition");

        var lightPosL = gl.getUniformLocation(program,"lightPos");
        var lp = vec4(50.0,50.0,50.0,0.0);
        gl.uniform4f(lightPosL,lp[0],lp[1],lp[2],lp[3]);
            
        var lightEmisL = gl.getUniformLocation(program,"lightEmis");
        var le = vec4(1.0,1.0,1.0,1.0);
        gl.uniform4f(lightEmisL,le[0],le[1],le[2],le[3]);

        gl.uniform1f(alphaloc,alpha)
        gl.uniform1f(betaloc,beta)


        // var rgba = [vec4(0.7,0.,0.2,1)] 
        // var aBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(vec4(0,0,0,color[3])), gl.STATIC_DRAW);
        // var acolor = gl.getAttribLocation(program, "a_Color");
        // gl.vertexAttribPointer(acolor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(acolor);
    }
    var leloc = gl.getUniformLocation(program,"leloc");
    var kdloc = gl.getUniformLocation(program,"kdloc");
    var kaloc = gl.getUniformLocation(program,"kaloc");
    var ksloc = gl.getUniformLocation(program,"ksloc");
    var sloc = gl.getUniformLocation(program,"sloc");
    var eyeloc = gl.getUniformLocation(program,"eyeloc");

    function render(gl, numPoints)
    {

        if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
            // OBJ and all MTLs are available
            g_drawingInfo = onReadComplete(gl, model, g_objDoc);
            }
        if (!g_drawingInfo) return;

        beta += 0.01;
        alpha +=0.01;
        // eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
        // at = vec3(0.,0.,0.)
        // up = vec3(0.,1.,0)
        // VA = lookAt(eye,at,up);
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
        gl.uniform4f(leloc,le[0],le[0],le[0],le[0]);
        gl.uniform4f(kdloc,kd,kd,kd,kd);
        gl.uniform4f(kaloc,Ka,Ka,Ka,Ka);
        gl.uniform4f(ksloc,ks,ks,ks,ks);
        gl.uniform1f(sloc,s);
        gl.uniform3f(eyeloc,eye[0],eye[1],eye[2]);
        
        gl.uniform1f(betaloc,beta)
        gl.uniform1f(alphaloc,alpha)
        // gl.cullFace(gl.BACK);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
        // gl.drawArrays(gl.TRIANGLES,0, numPoints);
    }
    function tick() { render(gl, pointsArray.length); requestAnimationFrame(tick);
     }
    tick();   


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