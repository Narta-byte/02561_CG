window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST) 
    //gl.depthFunc(gl.GREATER)

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
   

      var indices = [
        // First quad
        0, 1, 2, 
        0, 2, 3,
      
        // Second quad
        4, 5, 6,
        4, 6, 7,
      
        // Third quad
        8, 9, 10,
        8, 10, 11
      ];

    var vertices = [
    vec4(-2, -1, -1, 1), 
    vec4(2, -1, -1, 1), 
    vec4(2, -1, -5, 1), 
    vec4(-2, -1, -5, 1), 
    vec4(-0.25, -0.5, -1.25, 1),
    vec4(0.75, -0.5, -1.25, 1), 
    vec4(0.75, -0.5, -1.75, 1), 
    vec4(-0.25, -0.5, -1.75, 1) ,
    vec4(-1, -1, -2.5, 1), 
    vec4(-1, 0, -2.5, 1), 
    vec4(-1, 0, -3, 1), 
    vec4(-1, -1, -3, 1) 
    ];

    

    var texCoords = [
        vec2(-1, -1.0),
        vec2(-1, 1.0),
        vec2(1, 1.0),
        vec2(1, -1.0),
     ];
   

    

// Draw 
    

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
            gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
    };
    image.src = 'textures/xamp23.png';

    // var texture = gl.createTexture();
    // gl.bindTexture(gl.TEXTURE_2D, texture);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST); //hmm
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0]));
    // gl.uniform1i(gl.getUniformLocation(program, "texMap"), 1);
    

    var redTexture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, redTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0]));    
    
    var Ploc = gl.getUniformLocation(program,"projectionMatrix");
    var p = perspective(90, (canvas.height/canvas.width), 0.01, 20.0);
    gl.uniformMatrix4fv(Ploc,false,flatten(p));



    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  
    var texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords),
    gl.STATIC_DRAW);

    var vTexture = gl.getAttribLocation(program, "v_Texture"); //hmm
    gl.vertexAttribPointer(vTexture, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexture);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);



    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0); //hmmm



    var modelMatrixLoc = gl.getUniformLocation(program,
        "modelMatrix");


    // var VA = mat4();
    // gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));

    // Initialize the model matrix
    var modelMatrix = mat4();

    // Apply a translation transformation to the model matrix
    // modelMatrix = translate(0, 0, 0);

    // Apply a rotation transformation to the model matrix
    // modelMatrix = rotateY(45);

    // Apply a scaling transformation to the model matrix
    //modelMatrix = scale(modelMatrix, vec3(1,1,1));

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
    gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 6);
    var time = 0.0;

    var visibilityLoc = gl.getUniformLocation(program, "visibility");
    gl.uniform1f(visibilityLoc, 0.0);
    
    var projectionMatrix = mat4();
    projectionMatrix[3][3] = 0;
    projectionMatrix[3][1] = 1 / -(lightPos[1] - (-1)); // -1 is the ground y

    function render(gl, numPoints)
    {
        gl.clear(gl.COLOR_BUFFER_BIT);
        

        // Update the light position and radius
        lightPos = vec3(lightRadius * Math.sin(time), 2, lightRadius * Math.cos(time));
        lightRadius = 2 + Math.sin(time);

        // Update the time
        time += 0.01;

       

        gl.uniform1f(visibilityLoc, 1.0);
        gl.uniformMatrix4fv(Ploc,false,flatten(p));
        modelMatrix = mat4()
        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(modelMatrix));

        gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0); //hmmm
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);

        gl.uniform1i(gl.getUniformLocation(program, "texMap"), 1); //hmmm
        gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 6);

        time = time + 0.05;
 
        gl.uniform1f(visibilityLoc, 0.0);
        
        lightPos = vec3(2 * Math.sin(time), 2, -2 +2 * Math.cos(time));
        projectionMatrix[3][3] +=0.001 
        var shadowModelMatrix = [
            translate(lightPos),
            projectionMatrix,
            translate(-lightPos[0], -lightPos[1], -lightPos[2])
        ].reduce(mult);
        projectionMatrix[3][3] -=0.001 
        gl.uniformMatrix4fv(modelMatrixLoc, false, flatten(shadowModelMatrix));
        gl.drawElements(gl.TRIANGLES, 12, gl.UNSIGNED_BYTE, 6);
        // gl.drawElements(gl.TRIANGLES, numPoints, gl.UNSIGNED_BYTE, 0);

        // gl.drawArrays(gl.TRIANGLES, 4, numPoints-4);

        // gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_BYTE, 0);
    }
    function tick() { render(gl, vertices.length); requestAnimationFrame(tick);
     }
    tick();   



}