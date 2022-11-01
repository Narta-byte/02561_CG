window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
   

    

    var pointsArray = []
    var index = 0 
    var vb = vec4(0.0, 0.942809, -0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
    var vd = vec4(0.816497, -0.471405, -0.333333, 1);
    var vBuffer = gl.createBuffer();
    var nBuffer = gl.createBuffer();
    var numTimesToSubdivide = 3;
    var numSubdivs = 3;
    var va = vec4(0.0, 0.0, 1.0, 1);
    var color = []
    var normalsArray = []
    
    spaghetti()
    function spaghetti() {
        pointsArray = []
        index = 0
        gl.vBuffer = null;
        
        tetrahedron(va, vb, vc, vd, numTimesToSubdivide);
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
        var vPosition = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        // Perspective
        var p = perspective(90, (canvas.height/canvas.width), 1, 5);
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
        //light pos
        var lightPos = gl.getUniformLocation(program, "lightPos");
        var pos = vec4(0.,0.,1.,1.)
        gl.uniform1f (lightPos,flatten(pos));
        // var emisson = vec3(1,1.1);

        // uniform vec4 ambientProduct;
        // uniform vec4 diffuseProduct;
        // uniform vec4 specularProduct;
        // uniform float shininess;
        // varying vec3 N, L, E;
        var ambient = vec4(1,1,1,1)
        var diffuse = vec4(1,1,1,1)
        var specular = vec4(1,1,1,1)
        var shin = 1.

        var ambientProduct = gl.getUniformLocation(program, "ambientProduct");
        var diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
        var specularProduct = gl.getUniformLocation(program, "specularProduct");
        var shininess = gl.getUniformLocation(program, "shininess");
        gl.uniform1f (ambientProduct,flatten(ambient));
        gl.uniform1f (diffuseProduct,flatten(diffuse));
        gl.uniform1f (specularProduct,flatten(specular));
        gl.uniform1f(shininess,shin)
        //surface normal
        // var vNormal = gl.getUniformLocation(program,"vNormal");
        //v_normal = 
        // gl.uniformMatrix4fv(vNormal,false,flatten(normalsArray));

        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

        
        // var rgba = [vec4(0.7,0.,0.2,1)] 
        var aBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(color), gl.STATIC_DRAW);
        // var acolor = gl.getAttribLocation(program, "a_Color");
        // gl.vertexAttribPointer(acolor, 4, gl.FLOAT, false, 0, 0);
        // gl.enableVertexAttribArray(acolor);
    }
    var poi = document.getElementById("Increase subdivision");
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

        normalsArray.push(a);
        normalsArray.push(b);
        normalsArray.push(c);
        pointsArray.push(a);
        color.push(a)
        pointsArray.push(b);
        color.push(b)

        pointsArray.push(c);
        color.push(c)

        // pointsArray.push(vec3(a,b,c))
        index += 3;
    }
    
    var p = 0.0
    var m = 0.0

    function render(gl, numPoints)
    {
        gl.frontFace(gl.CW);
        gl.cullFace(gl.BACK);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0, numPoints);
    }
    function tick() { render(gl, pointsArray.length); requestAnimationFrame(tick);
     }
    tick();   



}