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
    gl.frontFace(gl.CW);

    

    var pointsArray = []
    var index = 0 
    var vb = vec4(0.0, 0.942809, -0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
    var vd = vec4(0.816497, -0.471405, -0.333333, 1);
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
    // var eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
    var eye = vec3(1,0,4)
    var at = vec3(0.,0.,0.)
    var up = vec3(0.,1,0)
    var VA = lookAt(eye,at,up);
    var VA = mat4(); // FARLIG
    var modelViewMatrixLoc = gl.getUniformLocation(program, "ModelViewPosition");
    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));

    // var backQuad = [(-1, -1, 0.999, 1),(1, -1, 0.999, 1),(-1, 1, 0.999, 1),(1, 1, 0.999, 1)]
    // backQuad = [
    //     vec4(-4, -1, -1, 1), //a
    //     vec4(4, -1, -1, 1), //b
    //     vec4(4, -1, -21, 1), //c
    //     vec4(-4, -1, -21, 1)]
        
    var backQuad = [vec4(-1, -1, 0.999, 1),vec4(1, -1, 0.999, 1),vec4(-1, 1, 0.999, 1),vec4(1, 1, 0.999, 1)]
    // var backQuad = [
    //     vec4(-4, -1, -1, 1), //a
    //     vec4(4, -1, -1, 1), //b
    //     vec4(4, -1, -21, 1), //c
    //     vec4(-4, -1, -21, 1), //d
    //     ];

    var g_tex_ready = 0;
    function initTexture()
    {
     var cubemap = ['textures/cm_left.png', // POSITIVE_X
                    'textures/cm_right.png', // NEGATIVE_X
                    'textures/cm_top.png', // POSITIVE_Y
                    'textures/cm_bottom.png', // NEGATIVE_Y
                    'textures/cm_back.png', // POSITIVE_Z
                    'textures/cm_front.png']; // NEGATIVE_Z
     gl.activeTexture(gl.TEXTURE0);
     var texture = gl.createTexture();
     gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
     gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
     gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

     for(var i = 0; i < 6; ++i) {
        var image = document.createElement('img');
        image.crossorigin = 'anonymous';
        image.textarget = gl.TEXTURE_CUBE_MAP_POSITIVE_X + i;
        image.onload = function(event)
        {
            var image = event.target;
            gl.activeTexture(gl.TEXTURE0);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(image.textarget, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
            ++g_tex_ready;
        };
     image.src = cubemap[i];
     }
     gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);
    }
    initTexture()

    
    spaghetti()
    function spaghetti() {
        pointsArray = []
        for (let i = 0; i < backQuad.length; i++) {
            pointsArray.push(backQuad[i]);
            index+=4;
        }
        gl.vBuffer = null;
        
        //tetrahedron(va, vb, vc, vd, 2);
        var vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(backQuad), gl.STATIC_DRAW); // ændre til verticies
        var vPosition = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);
        // Perspective
        var p = perspective(90, (canvas.height/canvas.width), 0.01, 20);
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
        var lp = vec4(-1.0,0.0,1.0,0.0);
        gl.uniform4f(lightPosL,lp[0],lp[1],lp[2],lp[3]);
            
        var lightEmisL = gl.getUniformLocation(program,"lightEmis");
        var le = vec4(1.0,1.0,1.0,1.0);
        gl.uniform4f(lightEmisL,le[0],le[1],le[2],le[3]);

        gl.uniform1f(alphaloc,alpha)
        gl.uniform1f(betaloc,beta)


        // var rgba = [vec4(0.7,0.,0.2,1)] 
        // var aBuffer = gl.createBuffer();
        // gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
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
        pointsArray.push(a);
        pointsArray.push(b);
        pointsArray.push(c);
        pointsArray.push(1);
        index += 4;
    }
    
    var p = 0.0
    var m = 0.0

    function render(gl, numPoints)
    {
        if (g_tex_ready < 6) {
            return;
        }

        // beta += 0.01;
        // alpha +=0.01;
        // eye = vec3(r*Math.sin(alpha),0,r*Math.cos(alpha))
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));


        gl.uniform1f(betaloc,beta)
        gl.uniform1f(alphaloc,alpha)
        // gl.frontFace(gl.CCW);
        // gl.cullFace(gl.BACK);
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGE_FAN, 0, 4);

        // gl.drawArrays(gl.TRIANGLES,6, numPoints-6);
    }
    function tick() { render(gl, index); requestAnimationFrame(tick);
     }
    tick();   



}