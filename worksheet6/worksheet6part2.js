window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    var indices = [
        0,1,
        0,3,
        1,2,
        2,3,
    ]

    
    // var vertices = [
    //     vec4(-4, -1, -1, 1),
    //     vec4(4, -1, -1, 1),
    //     vec4(4, -1, -21, 1),
    //     vec4(-4, -1, -21, 1)
    //     ];
/*
│abcd│abdc│acbd│acdb│adbc│adcb│bacd│badc│bcad│bcda│bdac│bdca│cabd│cadb│cbad│cbda│cdab│cdba│dabc│dacb│dbac│dbca│dcab│dcba│
*/
    var vertices = [
        vec4(-4, -1, -1, 1), //a
        vec4(4, -1, -1, 1), //b
        vec4(4, -1, -21, 1), //c
        vec4(-4, -1, -21, 1), //d
        ];

        var vertices = [
        vec4(-4, -1, -1, 1), //a
        vec4(4, -1, -1, 1), //b
        vec4(4, -1, -21, 1), //c
        vec4(-4, -1, -21, 1), //d
        ];
    var texCoords = [
        vec2(-1.5, 0.0),
        vec2(2.5, 0.0),
        vec2(2.5, 10.0),
        vec2(-1.5, 10.0) ];
    var numIndices = indices.length;

    //texture
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
    // for (var i = 0; i < texSize; ++i) {
    //     for (var j = 0; j < texSize; ++j) {
    //     var patchx = Math.floor(i/(texSize/numRows));
    //     var patchy = Math.floor(j/(texSize/numCols));
    //     var c = (patchx%2 !== patchy%2 ? 255 : 0);
    //     myTexels[4*i*texSize+4*j] = c;
    //     myTexels[4*i*texSize+4*j+1] = c;
    //     myTexels[4*i*texSize+4*j+2] = c;
    //     myTexels[4*i*texSize+4*j+3] = 255;
    //     }
    //     }
    var menu = document.getElementById("texture_wrapping");
    menu.addEventListener("click", function(ev) {
        console.log("we are here")
        switch (menu.selectedIndex) {
            case 0:
                console.log("CLAMP");
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                break;
            case 1:
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                console.log("REPEAT");
                
                break;
            default:
                break;
        }
        
    });
    var menu2 = document.getElementById("texture_filtering_minification");
    menu2.addEventListener("click", function(ev) {
        console.log("we are here")
        switch (menu2.selectedIndex) {
            case 0:
                console.log("NEAREST");
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                break;
            case 1: 
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                console.log("LINEAR");
                break;
            case 2:
                console.log("MIPMAP");
                // gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
                break;
            case 3: 
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                break;
            case 4: 
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl. NEAREST_MIPMAP_LINEAR);
                break;
            case 5: 
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                break;
            default:
                break;
        }
        
    });
    var menu3 = document.getElementById("texture_filtering_magnification");
    menu3.addEventListener("click", function(ev) {
        console.log("we are here")
        switch (menu3.selectedIndex) {
            case 0:
                console.log("NEAREST");
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                break;
            case 1: 
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                console.log("LINEAR");
                break;
            default:
                break;
        }
        
    });

    var Ploc = gl.getUniformLocation(program,"P");
    var p = perspective(90, (canvas.height/canvas.width), 0.01, 20.0);
    gl.uniformMatrix4fv(Ploc,false,flatten(p));

    //attribute
    // var vTexture = gl.getAttribLocation(program, "v_Texture"); //hmm
    // gl.vertexAttribPointer(vTexture, 2, gl.FLOAT, false, 0, 0); //hmm
    // gl.enableVertexAttribArray(vTexture); //hmm
    //unifrom

    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // var iBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),
    // gl.STATIC_DRAW);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0, gl.RGBA, gl.UNSIGNED_BYTE, myTexels);

    var texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords),
    gl.STATIC_DRAW);

    var vTexture = gl.getAttribLocation(program, "v_Texture"); //hmm
    gl.vertexAttribPointer(vTexture, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexture);


    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);


    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0); //hmmm



    var modelViewMatrixLoc = gl.getUniformLocation(program,
        "ModelViewPosition");

    // var eye = vec3(0.0,0.2,0.5)
    // var at = vec3(0.,0.,0.)
    // var up = vec3(0.,1.,0)

    // eye = mat3();
    // var VA = lookAt(eye,at,up);
    var VA = mat4();
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));


    // var rgba = [vec4(0.7,0.,0.2,1)] 
    // var aBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(vec4(1.0,0,0,1)), gl.STATIC_DRAW);
    // var acolor = gl.getAttribLocation(program, "a_Color");
    // gl.vertexAttribPointer(acolor, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(acolor);

    

    // var V = lookAt(eye, at, up);
    // gl.uniformMatrix4fv(VLoc, false, flatten(V));

    // var tx = 0.05;
    // var ty = 0.05;
    // var tz = 0.05;
    // var tpadding = 0.0;
    // var translation = gl.getUniformLocation(program,"translation");
    // gl.uniform4f(translation,tx,ty,tz,tpadding);
    // gl.vertexAttribPointer(v, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(v);



    function render(gl, numPoints)
    {
        gl.clear(gl.COLOR_BUFFER_BIT );
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
        // gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_BYTE, 0);
        // gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_BYTE, 0);
    }
    function tick() { render(gl, vertices.length); requestAnimationFrame(tick);
     }
    tick();   



}