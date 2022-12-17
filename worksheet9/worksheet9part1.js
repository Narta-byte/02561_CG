window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST) 
    // gl.depthFunc(gl.GREATER)
    gl.frontFace(gl.CW);
    
    
    var teaProgram = initShaders(gl, "vertex-shader-teapot", "fragment-shader-teapot");
    gl.useProgram(teaProgram);
     
    teaProgram.a_Position = gl.getAttribLocation(teaProgram,"a_PositionTea");
    teaProgram.a_Normal = gl.getAttribLocation(teaProgram, "a_NormalsTea");
    teaProgram.a_Color = gl.getAttribLocation(teaProgram, "a_ColorTea");
    
    var model = {
        vertexBuffer: createEmptyArrayBuffer(gl, teaProgram.position, 3, gl.FLOAT),
        normalBuffer: createEmptyArrayBuffer(gl, teaProgram.normal, 3, gl.FLOAT),
        colorBuffer: createEmptyArrayBuffer(gl, teaProgram.color, 4, gl.FLOAT),
        indexBuffer: gl.createBuffer()
    }
    readOBJFile('littleTeapot.obj', gl, model, 4, true);
    
    
    var modelMatrixTeaLoc = gl.getUniformLocation(teaProgram,"modelMatrixTea");
    var modelMatrix =mat4()
    gl.uniformMatrix4fv(modelMatrixTeaLoc,false,flatten(modelMatrix));
    
    
    var teaPloc = gl.getUniformLocation(teaProgram,"projectionMatrixTea");
    var teap = perspective(20, (canvas.height/canvas.width), 0.01,1000.0);
    gl.uniformMatrix4fv(teaPloc,false,flatten(teap));


    var ycompLoc = gl.getUniformLocation(teaProgram, "ycomp");
    gl.uniform1f(ycompLoc, 0.0);
    
    var visibilityLoc = gl.getUniformLocation(teaProgram, "visibilityTea");
    gl.uniform1f(visibilityLoc, 0.0);
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    
    
    // program.a_Position = gl.getAttribLocation(program, 'a_Position');
    // // program.a_Texture = gl.getAttribLocation(program, 'a_Texture');
    program.v_Texture = gl.getAttribLocation(program, 'v_Texture');
    program.a_Position = gl.getAttribLocation(program, "a_Position");
    program.a_Normals = gl.getAttribLocation(program, 'a_Normals');
    program.v_Color = gl.getAttribLocation(program, 'v_Color');
    

      var indices = [
        // First quad
        0, 1, 2, 
        0, 2, 3,
      
      ];

    var vertices = [
    vec4(-2, -1, -1, 1), 
    vec4(2, -1, -1, 1), 
    vec4(2, -1, -5, 1), 
    vec4(-2, -1, -5, 1), 
    ];

    var texCoords = [
        vec2(-1, -1.0),
        vec2(-1, 1.0),
        vec2(1, 1.0),
        vec2(1, -1.0),
     ];
   

    var image = document.createElement('img');
        image.crossorigin = 'anonymous';
        image.onload = function () {
            // Insert WebGL texture initialization here
            gl.activeTexture(gl.TEXTURE0);
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST); //hmm
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D); //hmm
            // gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
    };
    image.src = 'textures/xamp23.png';


    // var redTexture = gl.createTexture();
    // gl.activeTexture(gl.TEXTURE1);
    // gl.bindTexture(gl.TEXTURE_2D, redTexture);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0]));    
    
    var Ploc = gl.getUniformLocation(program,"projectionMatrix");
    var p = perspective(90, (canvas.height/canvas.width), 0.01, 20.0);
    gl.uniformMatrix4fv(Ploc,false,flatten(p));

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    // var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(program.a_Position, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.a_Position);
    
  
    var texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords),
    gl.STATIC_DRAW);

    //var vTexture = gl.getAttribLocation(program, "v_Texture"); //hmm
    gl.vertexAttribPointer(program.v_Texture, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.v_Texture);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0); //hmmm

    var modelMatrixLoc = gl.getUniformLocation(program,
        "modelMatrix");

    // var VA = mat4();
    // gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));

    // Initialize the model matrix
    // function scale(matrix, scale) {
    //     for (var i = 0; i < 16; i++) {
    //         matrix[i] *= scale[i];
    //         }
        
    // }
    
    // function translate(matrix, translation) {
    //     matrix[12] += translation[0];
    //     matrix[13] += translation[1];
    //     matrix[14] += translation[2];
    // }
    var modelMatrix = mat4();
    // scale(modelMatrix, [0.25, 0.25, 0.25]);
    // translate(modelMatrix, [0, -1, -3]);
    gl.uniformMatrix4fv(modelMatrixLoc,false,flatten(modelMatrix));

    // Define the point light position and radius
    var lightPos = vec3(0, 2, -2);
    var lightRadius = 2;

    // Define the ground plane equation (y = -1)
    var groundPlane = vec4(0, 1, 0, -1);
        
    // Create the projection matrix that projects onto the ground plane
    var projectionMatrix = mat4();
    projectionMatrix[1][1] = (lightPos.y - groundPlane.w) / lightPos.y;

    // Create the translation and model matrices
    var translationMatrix = translate(lightPos.x, lightPos.y, lightPos.z);
    var modelMatrix = mult(translationMatrix, modelMatrix);

    // Concatenate the projection, translation, and model matrices to create the shadow model matrix
    var shadowModelMatrix = mult(projectionMatrix, modelMatrix);

    // Draw the shadow polygons using the shadow model matrix
    //drawShadowPolygons(shadowModelMatrix);
    gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(shadowModelMatrix));
    gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_SHORT, 6);
    var time = 0.0;

    
    var projectionMatrix = mat4();
    projectionMatrix[3][3] = 0;
    projectionMatrix[3][1] = 1 / -(lightPos[1] - (-1)); // -1 is the ground y

    function render(gl, numPoints)
    {
        
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.frontFace(gl.CW);
        
        // Update the light position and radius
        
        lightPos = vec3(lightRadius * Math.sin(time), 2, lightRadius * Math.cos(time));
        lightRadius =  Math.sin(time);
        time += 0.03;
        
        // Update the time
        gl.useProgram(program);
        initAttributeVariable(gl,program.a_Position,vBuffer,4);
        initAttributeVariable(gl,program.v_Texture,texBuffer,2);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


        gl.uniformMatrix4fv(Ploc,false,flatten(p));
        modelMatrix = mat4()
        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));

        gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0); //hmmm
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

        //gl.uniform1i(gl.getUniformLocation(program, "texMap"), 1); //hmmm
        //gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 6);

        if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
            // OBJ and all MTLs are available
            g_drawingInfo = onReadComplete(gl, model, g_objDoc);
            }
        if (!g_drawingInfo) return;
        gl.frontFace(gl.CW);
        gl.useProgram(teaProgram);
        initAttributeVariable(gl,teaProgram.a_Position,model.vertexBuffer,3);
        // initAttributeVariable(gl,teaProgram.a_Color,model.colorBuffer,5);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
        

        gl.uniform1f(visibilityLoc, 1.0);

        eye = vec3(1.1*Math.sin(0.),0,1.1*Math.cos(0.))
        at = vec3(0.,0.,0.)
        up = vec3(0.,1.,0)
        VA = lookAt(eye,at,up);
        gl.uniform1f(ycompLoc, Math.cos(time*2.));

        gl.uniformMatrix4fv(modelMatrixTeaLoc,false,flatten(VA));
        

        // gl.drawElements(gl.TRIANGLES,g_drawingInfo.indices.length-6, gl.UNSIGNED_BYTE, 6);
        gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length-6, gl.UNSIGNED_SHORT, 6);
        
        gl.frontFace(gl.CW);

        // gl.useProgram(program);
        // initAttributeVariable(gl,program.a_Position,vBuffer,4);
        // initAttributeVariable(gl,program.v_Texture,texBuffer,2);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // time = time + 0.05;
 
        gl.uniform1f(visibilityLoc, 0.0);
        
        lightPos = vec3(2 * Math.sin(time), 2, 2 * Math.cos(time));
        projectionMatrix[3][3] +=0.001 
        var shadowModelMatrix = [
            translate(lightPos),
            projectionMatrix,
            translate(-lightPos[0], -lightPos[1], -lightPos[2])
        ].reduce(mult);
        projectionMatrix[3][3] -=0.001 
        gl.uniform1f(ycompLoc, 0);
        
        gl.uniformMatrix4fv(modelMatrixTeaLoc, false, flatten(shadowModelMatrix));
        gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length-6, gl.UNSIGNED_SHORT, 6);


    }
    function tick() { render(gl, vertices.length); requestAnimationFrame(tick);
     }
    tick();   
    function initVertexBuffers(gl, programfunc) {
        var o = new Object();
        o.vertexBuffer = createEmptyArrayBuffer(gl, programfunc.a_Position, 3, gl.FLOAT);
        o.normalBuffer = createEmptyArrayBuffer(gl, programfunc.a_Normals, 3, gl.FLOAT);
        o.colorBuffer = createEmptyArrayBuffer(gl, programfunc.v_Color, 4, gl.FLOAT);
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


    // function initAttributeVariable(gl, attribute, buffer,n)
    // {
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // gl.vertexAttribPointer(attribute, n, buffer.type, false, 0, 0);
    // gl.enableVertexAttribArray(attribute);
    // }
    function initAttributeVariable(gl, attribute, buffer, n) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attribute, n, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribute);
    }

}

