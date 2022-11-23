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
    var va = vec4(0.0, 0.0, 1.0, 1);
    var color = []
    var normalsArray = []
    var betaloc = gl.getUniformLocation(program, "betaloc");
    var beta = 0.0;
    var alphaloc = gl.getUniformLocation(program, "alphaloc");
    var alpha = 0.2;
    var r = 0.05;
    var eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
    var at = vec3(0.,0.,0.)
    var up = vec3(0.,0.5,0)
    var VA = lookAt(eye,at,up);
    var modelViewMatrixLoc = gl.getUniformLocation(program, "ModelViewPosition");
    var speed = 1;
    var Ka = 0.0;
    var kd = 1.0;
    var ks = 1.0;
    var s = 10.0;
    var le = vec4(1.0,1.0,1.0,1.0);
    obj_filename = "Katrine.obj";

    
    // function initObject(gl, obj_filename, scale)
    // {
        program.a_Position = gl.getAttribLocation(program, 'a_Position');
        program.a_Normal = gl.getAttribLocation(program, 'a_Normal');
        program.a_Color = gl.getAttribLocation(program, 'a_Color');
        // Prepare empty buffer objects for vertex coordinates, colors, and normals
        var model = initVertexBuffers(gl,program);
        // Start reading the OBJ file
        readOBJFile("worksheet5\Katrine.obj", gl, model, 4, true);
        // return model;
    // }
    // initObject(program, obj_filename, 0.5)
    
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));

    draw()
    function draw() {
        pointsArray = []
        index = 0
        gl.vBuffer = null;
        
        // tetrahedron(va, vb, vc, vd, numTimesToSubdivide);









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
        // var le = vec4(1.0,1.0,1.0,1.0);
        // gl.uniform4f(lightEmisL,le[0],le[1],le[2],le[3]);

        gl.uniform1f(alphaloc,alpha)
        gl.uniform1f(betaloc,beta)




        // ambientProduct = mult(lightAmbient, materialAmbient);
        // diffuseProduct = mult(lightDiffuse, materialDiffuse);
        // specularProduct = mult(lightSpecular, materialSpecular);
        // var t1 = subtract(vertices[b], vertices[a]);
        // var t2 = subtract(vertices[c], vertices[a]);
        // var normal = vec4(normalize(cross(t1, t2)));

        // var d = dot(normal, lightPosL); // måske forket med lightPosL
        // diffuse = mult(lightDiffuse, reflectDiffuse);
        // diffuse = scale(d, diffuse);
        // var d = Math.max(dot(normal, lightPostiion), 0.0);

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
        draw();

    });
    var tri = document.getElementById("Decrease subdivision");
    tri.addEventListener("click", function (ev) {
        console.log("Decrease subdivision");
        numSubdivs-=1
        numTimesToSubdivide-=1
        draw();

    });
    var sliderSpeed = document.getElementById("speedSlider");
    sliderSpeed.oninput = function() {
        outputSpeed.innerHTML = this.value;
        speed = this.value;
        console.log("speed = "+speed);
    }
    var outputSpeed = document.getElementById("speed");
    outputSpeed.innerHTML = sliderSpeed.value;

    var rSlider = document.getElementById("rSlider");
    rSlider.oninput = function() {
        outputr.innerHTML = this.value;
        r = this.value*0.01;
        console.log("r = " + r);
    }
    var outputr = document.getElementById("r");
    outputSpeed.innerHTML = rSlider.value;

    var KaSlider = document.getElementById("KaSlider");
    KaSlider.oninput = function() {
        outputKa.innerHTML = this.value;
        Ka = this.value*0.1;
        console.log("ka = "+Ka);
    }
    var outputKa = document.getElementById("Ka");
    outputKa.innerHTML = KaSlider.value;

    var KdSlider = document.getElementById("KdSlider");
    KdSlider.oninput = function() {
        outputKd.innerHTML = this.value;
        kd = this.value*0.1;
        console.log("kd = " + kd);
    }
    var outputKd = document.getElementById("Kd");
    outputKd.innerHTML = KdSlider.value;

    var KsSlider = document.getElementById("KsSlider");
    KsSlider.oninput = function() {
        outputKs.innerHTML = this.value;
        ks = this.value*0.1;
        console.log("ks = "+ ks);
    }
    var outputKs = document.getElementById("Ks");
    outputKs.innerHTML = KsSlider.value;

    // var aSlider = document.getElementById("aSlider");
    // aSlider.oninput = function() {
    //     outputa.innerHTML = this.value;
    // //     a = this.value;
    // //     console.log("a = "+a);
    // // }
    // var outputa = document.getElementById("a");
    // outputa.innerHTML = aSlider.value;

    var leSlider = document.getElementById("leSlider");
    leSlider.oninput = function() {
        outputle.innerHTML = this.value*0.1;
        le = vec4(this.value,this.value,this.value,this.value);
        console.log("le = "+le);
    }
    var outputle = document.getElementById("le");
    outputle.innerHTML = leSlider.value;

    var sSlider = document.getElementById("sSlider");
    sSlider.oninput = function() {
        outputs.innerHTML = this.value;
        s = this.value;
        console.log("s = " +s);
    }
    var outputs = document.getElementById("s");
    outputs.innerHTML = sSlider.value;


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
    var leloc = gl.getUniformLocation(program,"leloc");
    var kdloc = gl.getUniformLocation(program,"kdloc");
    var kaloc = gl.getUniformLocation(program,"kaloc");
    var ksloc = gl.getUniformLocation(program,"ksloc");
    var sloc = gl.getUniformLocation(program,"sloc");
    var eyeloc = gl.getUniformLocation(program,"eyeloc");
   
    function render(gl, numPoints)
    {
        if (!g_drawingInfo && g_objDoc && g_objDoc.isMTLComplete()) {
            // OBJ and all MTLs are available
            g_drawingInfo = onReadComplete(gl, model, g_objDoc);
            }
            if (!g_drawingInfo) return;
            
        beta += speed*0.01;
        alpha +=speed*0.01;
        eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
        at = vec3(0.,0.,0.)
        up = vec3(0.,0.5,0)
        VA = lookAt(eye,at,up);
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
        gl.uniform4f(leloc,le[0],le[0],le[0],le[0]);
        gl.uniform4f(kdloc,kd,kd,kd,kd);
        gl.uniform4f(kaloc,Ka,Ka,Ka,Ka);
        gl.uniform4f(ksloc,ks,ks,ks,ks);
        gl.uniform1f(sloc,s);

        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
        
        gl.uniform3f(eyeloc,eye[0],eye[1],eye[2]);

        gl.uniform1f(betaloc,beta)
        gl.uniform1f(alphaloc,alpha)
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.drawArrays(gl.TRIANGLES,0, numPoints);
        gl.drawElements(gl.TRIANGLES, g_drawingInfo.indices.length,
            gl.UNSIGNED_SHORT, 0);
    }
    function tick() { render(gl, pointsArray.length); requestAnimationFrame(tick);
     }
    tick();   



}