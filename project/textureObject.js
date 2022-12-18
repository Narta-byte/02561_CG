window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    var ext = gl.getExtension('OES_element_index_uint');
    if (!ext) {
    console.log('Warning: Unable to use an extension');
    }



    var DEBUGtexCoords = [
        vec2(0.,0.),
        vec2(1.,0.),
        vec2(1.,1.),
        vec2(0.,1.),
    ];
    var DEBUGtexCUBE  = [
    vec2( 0.375000, 0.500000),
    vec2( 0.625000, 0.500000),
    vec2( 0.625000, 0.750000),
    vec2( 0.375000, 0.750000),
    vec2( 0.375000, 0.250000),
    vec2( 0.625000, 0.250000),
    vec2( 0.375000, 0.000000),
    vec2( 0.625000, 0.000000),
    vec2( 0.625000, 1.000000),
    vec2( 0.375000, 1.000000),
    vec2( 0.875000, 0.500000),
    vec2( 0.875000, 0.750000),
    vec2( 0.125000, 0.500000),
    vec2( 0.125000, 0.750000)]


    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
   
    gl.frontFace(gl.CCW);
    console.log( gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
 

    var alphaloc = gl.getUniformLocation(program, "alphaloc");
    var alpha = 0.;
    gl.uniform1f(alphaloc,alpha)


    var modelViewMatrixLoc = gl.getUniformLocation(program, "ModelViewPosition");
    
   
    program.a_Position = gl.getAttribLocation(program, 'a_Position');
    program.a_Normals = gl.getAttribLocation(program, 'a_Normals');
    program.v_Color = gl.getAttribLocation(program, 'v_Color');
    program.a_Texture = gl.getAttribLocation(program, 'a_Texture');
    
    var model = initVertexBuffers(gl, program);
    readOBJFile('uvCube.obj', gl, model, 0.425, true);

    // Perspective
    var p = perspective(90, (canvas.height/canvas.width), 0.01, 200);
    var P = gl.getUniformLocation(program,"P");
    gl.uniformMatrix4fv(P,false,flatten(p));

    var Ka = 0.0;
    var kd = 1.0;
    var ks = 1.0;
    var a = 0.0;
    var s = 10.0;
    var le = vec4(1.0,1.0,1.0,1.0);

    
    getCheckerBoard();
    // getImageTexture('earth.jpg');
   
    //translation
    var v = mat4()
    var V = gl.getUniformLocation(program,"V");
    gl.uniformMatrix4fv(V,false,flatten(v));
    //modelview
    var lightPosL = gl.getUniformLocation(program,"lightPos");
    var lp = vec4(0.0,-1.0,2.0,0.0);
    gl.uniform4f(lightPosL,lp[0],lp[1],lp[2],lp[3]);
        
    var lightEmisL = gl.getUniformLocation(program,"lightEmis");
    var le = vec4(1.0,1.0,1.0,1.0);
    gl.uniform4f(lightEmisL,le[0],le[1],le[2],le[3]);

    var leloc = gl.getUniformLocation(program,"leloc");
    var kdloc = gl.getUniformLocation(program,"kdloc");
    var kaloc = gl.getUniformLocation(program,"kaloc");
    var ksloc = gl.getUniformLocation(program,"ksloc");
    var sloc = gl.getUniformLocation(program,"sloc");
    var eyeloc = gl.getUniformLocation(program,"eyeloc");

   
    function tick() { render(gl, 0); requestAnimationFrame(tick);
     }
    tick();   


    function getCheckerBoard() {
    var numRows = 8;
    var numCols = 8;
    var texSize = 64;
    var myTexels = new Uint8Array(4*texSize*texSize); // 4 for RGBA image, texSize is the resolution
    for(var i = 0; i < texSize; ++i) {
        for(var j = 0; j < texSize; ++j)
            {
                var patchx = Math.floor(i/(texSize/numRows));
                var patchy = Math.floor(j/(texSize/numCols));
                var c = (patchx%2 !== patchy%2 ? 255 : 0);
                var idx = 4*(i*texSize + j);
                myTexels[idx] = myTexels[idx + 1] = myTexels[idx + 2] = c;
                myTexels[idx + 3] = 255;
    }
    }
   
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);

    //  // DEBUG
    // var texBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(DEBUGtexCoords),
    // gl.STATIC_DRAW);
    // var vTexture = gl.getAttribLocation(program, "a_Texture");
    // gl.vertexAttribPointer(vTexture, 2, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(vTexture);



    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0); 
    }
    function getImageTexture(imageFilePath) {
        var image = document.createElement('img');
            image.crossorigin = 'anonymous';
            image.onload = function () {
                // Insert WebGL texture initialization here
                var texture = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, texture);
                
                // DEBUG
                // var texBuffer = gl.createBuffer();
                // gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
                // gl.bufferData(gl.ARRAY_BUFFER, flatten(DEBUGtexCoords),
                // gl.STATIC_DRAW);

                // var vTexture = gl.getAttribLocation(program, "a_Texture");
                // gl.vertexAttribPointer(vTexture, 2, gl.FLOAT, false, 0, 0);
                // gl.enableVertexAttribArray(vTexture);


                // DEBUG


                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST); //hmm
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D); //hmm
                gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
        };
        image.src = imageFilePath;
    }


    function initVertexBuffers(gl, program) {
        var o = new Object();
        o.vertexBuffer = createEmptyArrayBuffer(gl, program.a_Position, 3, gl.FLOAT);
        o.normalBuffer = createEmptyArrayBuffer(gl, program.a_Normals, 3, gl.FLOAT);
        o.textureBuffer = createEmptyArrayBuffer(gl, program.a_Texture,2, gl.FLOAT);
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
    
        console.log("in js");
        console.log(drawingInfo);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER,drawingInfo.textures, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, drawingInfo.indices, gl.STATIC_DRAW);
        
        // gl.bindBuffer(gl.ARRAY_BUFFER, model.textureBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, drawingInfo.textures, gl.STATIC_DRAW);
    
    
        return drawingInfo;
    }


      function render(gl, numPoints)
      {
  
          if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
              // OBJ and all MTLs are available
              g_drawingInfo = onReadComplete(gl, model, g_objDoc);
              }
          if (!g_drawingInfo) return;
  
          alpha +=0.01;
          eye = vec3(1*Math.sin(alpha),0,1*Math.cos(alpha))
          at = vec3(0.,-0.5,0.)
          up = vec3(0.,1.,0)
          VA = lookAt(eye,at,up);
          gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
          gl.uniform4f(leloc,le[0],le[0],le[0],le[0]);
          gl.uniform4f(kdloc,kd,kd,kd,kd);
          gl.uniform4f(kaloc,Ka,Ka,Ka,Ka);
          gl.uniform4f(ksloc,ks,ks,ks,ks);
          gl.uniform1f(sloc,s);
          gl.uniform3f(eyeloc,eye[0],eye[1],eye[2]);
          
          gl.uniform1f(alphaloc,alpha)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          gl.cullFace(gl.BACK);
          //gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_SHORT, 0);
          gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length, gl.UNSIGNED_INT, 0);
          
          
          // gl.drawArrays(gl.TRIANGLES,0, numPoints);
      }
}