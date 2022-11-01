window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

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

        var modelViewMatrixLoc = gl.getUniformLocation(program, "ModelViewPosition");
        
        var eye = vec3(0.5,0.5,0.5)
        var at = vec3(0.,0.,0.)
        var up = vec3(0.,1.,0)
        var VA = lookAt(eye,at,up);
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));

        var rgba = [vec4(0.7,0.,0.2,1)] 
        var aBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(rgba), gl.STATIC_DRAW);
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


    function initSphere(gl, numSubdivs) {
        tetrahedron(pointsArray, va, vb, vc, vd, numSubdivs);
        gl.deleteBuffer(gl.vBuffer);
        gl.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
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
        pointsArray.push(a);
        pointsArray.push(b);
        pointsArray.push(c);
        // pointsArray.push(vec3(a,b,c))
        index += 3;
    }
    
    
    
    

    // var iBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),
    // gl.STATIC_DRAW);

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
   
    //var P = gl.getUniformLocation(program,"P");
    //var V = gl.getUniformLocation(program,"V");
    //var M = gl.getUniformLocation(program,"M");
//
//
    //var betaloc = gl.getUniformLocation(program, "betaloc");
    //var beta = 0.0;

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
       // gl.uniform1f(betaloc,beta)
       // gl.uniform1f(P,p)
       // gl.uniform1f(V,v)
       // gl.uniform1f(M,m)
        // gl.uniform4f(translation,tx,ty,tz,tpadding);

        // gl.uniform1f(betaLoc, beta);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.drawArrays(gl.lines, 0, numPoints);
        // gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numPoints);
    }
    function tick() { render(gl, pointsArray.length); requestAnimationFrame(tick);
     }
    tick();   



}