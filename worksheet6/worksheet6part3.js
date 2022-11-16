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
    var numTimesToSubdivide = 3;
    var numSubdivs = 3;
    var va = vec4(0.0, 0.0, 1.0, 1);
    var color = []
    var normalsArray = []
    var betaloc = gl.getUniformLocation(program, "betaloc");
    var beta = 0.0;
    var alphaloc = gl.getUniformLocation(program, "alphaloc");
    var alpha = 0.2;
    var r = 1;
    var eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
    var at = vec3(0.,0.,0.)
    var up = vec3(0.,0.5,0)
    var VA = lookAt(eye,at,up);
    var modelViewMatrixLoc = gl.getUniformLocation(program, "ModelViewPosition");
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));

    var image = document.createElement('earth');
    image.crossorigin = 'anonymous';
    image.onload = function () {
        // Insert WebGL texture initialization here
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.generateMipmap(gl.TEXTURE_2D); //hmm
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        // gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); //hmm
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);


        var myTexels = new Image();
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,gl.UNSIGNED_BYTE, image);
        gl.uniform1i(gl.getUniformLocation(gl.program, "texMap"), 0);
    };
    image.src = 'earth.jpg';
    
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
        //var eye = vec3(0.5,0.5,0.5)
        var eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
        var at = vec3(0.,0.,0.)
        var up = vec3(0.,0.5,0)
        var VA = lookAt(eye,at,up);
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
        
        // KIG PÅ SENERE
        var vNormals = gl.getAttribLocation(program, "a_Normals");
        gl.vertexAttribPointer(vNormals, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormals);


        var lightPosL = gl.getUniformLocation(program,"lightPos");
        var lp = vec4(0.0,0.0,1.0,0.0);
        gl.uniform4f(lightPosL,lp[0],lp[1],lp[2],lp[3]);
            
        var lightEmisL = gl.getUniformLocation(program,"lightEmis");
        var le = vec4(1.0,1.0,1.0,1.0);
        gl.uniform4f(lightEmisL,le[0],le[1],le[2],le[3]);

        gl.uniform1f(alphaloc,alpha)
        gl.uniform1f(betaloc,beta)


        // var rgba = [vec4(0.7,0.,0.2,1)] 
        var aBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
        // gl.bufferData(gl.ARRAY_BUFFER, flatten(vec4(0,0,0,color[3])), gl.STATIC_DRAW);
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
        beta += 0.01;
        alpha +=0.01;
        eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
        at = vec3(0.,0.,0.)
        up = vec3(0.,0.5,0)
        VA = lookAt(eye,at,up);
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));


        gl.uniform1f(betaloc,beta)
        gl.uniform1f(alphaloc,alpha)
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES,0, numPoints);
    }
    function tick() { render(gl, pointsArray.length); requestAnimationFrame(tick);
     }
    tick();   



}