window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    
    var indices = [
        0,1,
        1,2,
        2,3,
        3,0
    ]
 
    var vertices = [
        vec3(1, 1, 0.1),
        vec3(0, 1, 0.1),
        vec3(1 , 0, 0.1),
        vec3(0 , 0, 0.1)
        ];


    var texCoords = [
        vec2(0.0, 0.0),
        vec2(1.0, 0.0),
        vec2(0.0, 1.0),
        vec2(1.0, 1.0) ];
    // for (let inx = 0; inx < vertices.length; inx++) {
    //     //  add(vertices[inx],vertices[inx],vec3(0.5,0.5,0.5))
    //     console.log("before : ",vertices[inx])
    //     vertices[inx] = vertices[inx] + vec3(0.5,0.5,0.5)
    //     console.log("after : ",vertices[inx])
    // }
    var numVertices = 4;
    var points = [ ];
    var colors = [ ];
    function quad(a, b, c, d)
    {
    var indices = [ a, b, c, a, c, d ];
    for (var i = 0; i < indices.length; ++i) {
    points.push(vertices[indices[i]]);
    colors.push(vertexColors[indices[i]]);
    }
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
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),
    gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);


    var modelViewMatrixLoc = gl.getUniformLocation(program,
        "ModelViewPosition");

    var eye = vec3(0.5,0.5,0.5)
    var at = vec3(0.,0.0,0.)
    var up = vec3(0.,1.,0)
    var VA = lookAt(eye,at,up);
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));


    var aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
    var acolor = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(acolor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(acolor);

    

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

    
    // var vertices = [
    //     vec4(-0.5, -0.5, 0.5, 1.0),
    //     vec4(-0.5, 0.5, 0.5, 1.0),
    //     vec4(0.5, 0.5, 0.5, 1.0),
    //     vec4(0.5, -0.5, 0.5, 1.0),
    //     vec4(-0.5, -0.5, -0.5, 1.0),
    //     vec4(-0.5, 0.5, -0.5, 1.0),
    //     vec4(0.5, 0.5, -0.5, 1.0),
    //     vec4(0.5, -0.5, -0.5, 1.0)
    //     ];
    




    var p = 0.0
    var v = 0.0
    var m = 0.0
   
    var P = gl.getUniformLocation(program,"P");
    var V = gl.getUniformLocation(program,"V");
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
        gl.uniform1f(P,p)
        gl.uniform1f(V,v)
        gl.uniform1f(M,m)
        // gl.uniform4f(translation,tx,ty,tz,tpadding);

        // gl.uniform1f(betaLoc, beta);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.drawArrays(gl.lines, 0, numPoints);
        // gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);
        gl.drawElements(gl.LINESs, numVertices, gl.UNSIGNED_BYTE, 0);
    }
    function tick() { render(gl, vertices.length); requestAnimationFrame(tick);
     }
    tick();   



}