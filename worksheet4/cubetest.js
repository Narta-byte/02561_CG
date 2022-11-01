window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
   

    

    var pointsArray = []
    var index = 0 
    var vb = vec4(0.0, 0.942809, -0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
    var vd = vec4(0.816497, -0.471405, -0.333333, 1);
    var poi = document.getElementById("Increase subdivision");
    var vBuffer = gl.createBuffer();
    var numTimesToSubdivide = 3;
    var numSubdivs = 3;
    var va = vec4(0.0, 0.0, 1.0, 1);
    var color = []
    spaghetti()
    function spaghetti() {
        pointsArray = []
        index = 0
        gl.vBuffer = null;
        
        // tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
        var indices = [
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
        var vertices = [
            vec3(0, 0, 1),
            vec3(0, 1, 1),
            vec3(1 , 1, 1),
            vec3(1 , 0, 1),
            vec3(0, 0, 0),
            vec3(0, 1, 0),
            vec3(1, 1, 0),
            vec3(1, 0, 0)
            ];
        var numVertices = 24;
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
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
        var vPosition = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        // Perspective
        var p = perspective(45, (canvas.height/canvas.width), 1, 5);
        var P = gl.getUniformLocation(program,"P");
        gl.uniformMatrix4fv(P,false,flatten(p));
        //translation
        var v = mat4()
        var V = gl.getUniformLocation(program,"V");
        gl.uniformMatrix4fv(V,false,flatten(v));
        //modelview
        var modelViewMatrixLoc = gl.getUniformLocation(program, "ModelViewPosition");
        var eye = vec3(0.5,0.5,0.5)
        var at = vec3(0.,0.,0.)
        var up = vec3(0.,0.5,0)
        var VA = lookAt(eye,at,up);
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
        
        // var rgba = [vec4(0.7,0.,0.2,1)] 
        var aBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);
        var acolor = gl.getAttribLocation(program, "a_Color");
        gl.vertexAttribPointer(acolor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(acolor);
    }
    
    poi.addEventListener("click", function (ev) {
        console.log("Increase subdivision");
        numSubdivs+=1
        numTimesToSubdivide+=1
        spaghetti();

    });
    var tri = document.getElementById("Decrease subdivision");
    tri.addEventListener("click", function (ev) {
        console.log("Decrease subdivision");
        numSubdivs-=1
        numTimesToSubdivide-=1
        spaghetti();

    });




    function tetrahedron(a, b, c, d, n)
    {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
    }


    function divideTriangle(a, b, c, count)
    {
    if (count > 0) {
        var ab = normalize(mix(a, b, 0.5), true);
        var ac = normalize(mix(a, c, 0.5), true);
        var bc = normalize(mix(b, c, 0.5), true);
        divideTriangle(a, ab, ac, count - 1);
        divideTriangle(ab, b, bc, count - 1);
        divideTriangle(bc, c, ac, count - 1);
        divideTriangle(ab, bc, ac, count - 1);
    }
    else {
        triangle(a, b, c);
    }
}
    // var va = vec4(0.0, 0.0, 1.0, 1);
    // var vb = vec4(0.0, 0.942809, -0.333333, 1);
    // var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
    // var vd = vec4(0.816497, -0.471405, -0.333333, 1);

  
    // var numVerts = initSphere(gl, numSubdivs);
    // tetrahedron(pointsArray, va, vb, vc, vd, numSubdivs)
    function triangle(a, b, c){

        var ab = normalize(mix(a, b, 0.5), true);
        var ac = normalize(mix(a, c, 0.5), true);
        var bc = normalize(mix(b, c, 0.5), true);

        pointsArray.push(a);
        color.push(ab)
        pointsArray.push(b);
        color.push(ac)

        pointsArray.push(c);
        color.push(bc)

        // pointsArray.push(vec3(a,b,c))
        index += 3;
    }
    
    var p = 0.0
    var m = 0.0

    function render(gl, numPoints)
    {
        // gl.frontFace(gl.CW);
        // gl.cullFace(gl.BACK);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.drawArrays(gl.TRIANGLES,0, numPoints);
        gl.drawElements(gl.LINES, numVertices, gl.UNSIGNED_BYTE, 0);
    }
    function tick() { render(gl, pointsArray.length); requestAnimationFrame(tick);
     }
    tick();   



}