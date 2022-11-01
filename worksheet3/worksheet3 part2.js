window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    // var vertices = [ vec2(0.00, 0.00)];
    // var r = 0.5;
    // var theta = 0.0;
    // var n = 100;
    // // theta = 2*Math.PI*1/n;
    // // vertices.push(vec2(r*Math.cos(theta),r*Math.sin(theta)));
    // for (let i = 0; i <= n; i++) {
    //     theta = 2*Math.PI*i/n;
    //     vertices.push(vec2(r*Math.cos(theta),r*Math.sin(theta)));
    // }
    var con = 1
    // var indices0 = [
    //     1, 0, 3,
    //     3, 2, 1,
    //     2, 3, 7,
    //     7, 6, 2,
    //     3, 0, 4,
    //     4, 7, 3,
    //     6, 5, 1,
    //     1, 2, 6,
    //     4, 5, 6,
    //     6, 7, 4,
    //     5, 4, 0,
    //     0, 1, 5
    //     ];
    var indices0 = [
        0,1,
        0,3,
        0,4,
        1,2,
        1,5,
        2,3,
        2,6,
        3,7,
        4,5,
        4,7,
        5,6,
        6,7


    ]
    var indices1 = [
        0,1,
        0,3,
        0,4,
        1,2,
        1,5,
        2,3,
        2,6,
        3,7,
        4,5,
        4,7,
        5,6,
        6,7


    ]
    var indices2 = [
        0,1,
        0,3,
        0,4,
        1,2,
        1,5,
        2,3,
        2,6,
        3,7,
        4,5,
        4,7,
        5,6,
        6,7


    ]
    
    var vertices0 = [
        vec4(0, 0, 1, 1.0),
        vec4(0, 1, 1, 1.0),
        vec4(1, 1, 1, 1.0),
        vec4(1, 0, 1, 1.0),
        vec4(0, 0, 0, 1.0),
        vec4(0, 1, 0, 1.0),
        vec4(1, 1, 0, 1.0),
        vec4(1, 0, 0, 1.0)
        ];
    var vertices1 = [
        vec4(0, 0, 1, 1.0),
        vec4(0, 1, 1, 1.0),
        vec4(1, 1, 1, 1.0),
        vec4(1, 0, 1, 1.0),
        vec4(0, 0, 0, 1.0),
        vec4(0, 1, 0, 1.0),
        vec4(1, 1, 0, 1.0),
        vec4(1, 0, 0, 1.0)
        ];
    var vertices2 = [
        vec4(0, 0, 1, 1.0),
        vec4(0, 1, 1, 1.0),
        vec4(1, 1, 1, 1.0),
        vec4(1, 0, 1, 1.0),
        vec4(0, 0, 0, 1.0),
        vec4(0, 1, 0, 1.0),
        vec4(1, 1, 0, 1.0),
        vec4(1, 0, 0, 1.0)
        ];
    var numVertices = 24;
    var points = [ ];
    var colors = [ ];
    function quad(a, b, c, d)
    {
    var indices0 = [ a, b, c, a, c, d ];
    for (var i = 0; i < indices0.length*3; ++i) {
    points.push(vertices[indices0[i]]);
    colors.push(vertexColors[indices0[i]]);
    }
    }
    function colorCube()
    {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    }

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ], // black
        [ 1.0, 0.0, 0.0, 1.0 ], // red
        [ 1.0, 1.0, 0.0, 1.0 ], // yellow
        [ 0.0, 1.0, 0.0, 1.0 ], // green
        [ 0.0, 0.0, 1.0, 1.0 ], // blue
        [ 1.0, 0.0, 1.0, 1.0 ], // magenta
        [ 1.0, 1.0, 1.0, 1.0 ], // white
        [ 0.0, 1.0, 1.0, 1.0 ] // cyan
    ];

    

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices0), gl.STATIC_DRAW);

    // var vBuffer1 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer1);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices1), gl.STATIC_DRAW);

    // var vBuffer2 = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer2);
    // gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices2), gl.STATIC_DRAW);

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices0),
    gl.STATIC_DRAW);

    // var iBuffer1 = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer1);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices0),
    // gl.STATIC_DRAW);

    // var iBuffer2 = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer2);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices0),
    // gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    
    function drawCube(a,b,c,d) {
        var a = a
        var b = b
        var c = c
        var d = d

        var p = perspective(45, (canvas.height/canvas.width), 1, 5);
    var P = gl.getUniformLocation(program,"P");
    gl.uniformMatrix4fv(P,false,flatten(p));

    v = mat4(0,0,0,0)
    var V = gl.getUniformLocation(program,"V");
    gl.uniformMatrix4fv(V,false,flatten(v));


    var modelViewMatrixLoc = gl.getUniformLocation(program,
        "ModelViewPosition");
    
    var eye = vec3(a,b,4.5)
    var at = vec3(d,c,0.)
    var up = vec3(0.,1.,0)
    var VA = lookAt(eye,at,up);
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
    

    

    var rgba = [vec4(0.7,0.,0.2,1)] 
    var aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
    var acolor = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(acolor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(acolor);

    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);
    }

    drawCube(0.01,0.01,0.1,-0.5)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);
    drawCube(0.0,-0.5,0.1,1.5)
    gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);
    drawCube(0.5,-1.5,2.5,0)
    gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);
// 
    var m = 0.0
   
    var M = gl.getUniformLocation(program,"M");


    var betaloc = gl.getUniformLocation(program, "betaloc");
    var beta = 0.0;

    // var V = lookAt(eye, at, up);


    //// gl.uniform1f(betaloc,beta)

    // gl.uniformMatrix4fv(VLoc, false, flatten(V));

    var w = 0.01;
    var vt = 0.0;
    var wt = 0.0;

   

    function render(gl, numPoints)
    {
        // beta += 0.05;
        
        // vt = vt + wt;
        // wt = Math.sign(1-r-Math.abs(vt))*wt;
        // tx += 0.000;
        // ty =Math.sin(ty-0.01);
        // ty = (0.5*Math.abs(Math.cos(beta)))-0.5; 
        gl.uniform1f(betaloc,beta)
        // gl.uniform1f(P,p)
        // gl.uniform1f(V,v)
        gl.uniform1f(M,m)
        // gl.uniform4f(translation,tx,ty,tz,tpadding);

        // gl.uniform1f(betaLoc, beta);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.drawArrays(gl.lines, 0, numPoints);
        // gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);
        // gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);


        
        // eye = vec3(0.4,0.2,5)
        // at = vec3(0.,0.5,0.)
        // up = vec3(0.,1.2,0)
        // VA = lookAt(eye,at,up);
        // gl.getUniformLocation(program,"ModelViewPosition");
        // gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));

        // p = perspective(35, (canvas.height/canvas.width), 1, 5);
        // P = gl.getUniformLocation(program,"P");
        // gl.uniformMatrix4fv(P,false,flatten(p));
        
        
        // eye = vec3(0.2,0.2,5)
        // at = vec3(0.,0.5,0.)
        // up = vec3(0.,1.,0)
        // VA = lookAt(eye,at,up);
        // gl.getUniformLocation(program,"ModelViewPosition");
        // gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);
        
        // p = perspective(25, (canvas.height/canvas.width), 1, 5);
        // P = gl.getUniformLocation(program,"P");
        // gl.uniformMatrix4fv(P,false,flatten(p));
        // gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);
    }
    function tick() { render(gl, vertices0.length); requestAnimationFrame(tick);
     }
    tick();   



}