/*
TODO :
    SKRIV BESKRIVELSE
    LAV viewDirectionProjectionInverseLocation og den anden lange om til mtex
*/



window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CW);


    var program = initShaders(gl, "quad-vertex-shader", "quad-fragment-shader");
    gl.useProgram(program);

    var vertices = [
    vec4(-1, -1, 0.999, 1), //a
    vec4(1, -1, 0.999, 1), //b
    vec4(1, -1, -0.999, 1), //c
    vec4(-1, -1, -0.999, 1), //d
    ];
    var vertices =[
        vec4(-1, -1,0.,1.), 
        vec4(1, -1,0.,1), 
            vec4(-1,  1,0.,1), 
                vec4(-1,  1,0,1),
                    vec4( 1, -1,0,1),
                        vec4( 1,  1,0,1),
      ];
    var va = vec4(0.0, 0.0, 1.0, 1);
    var vb = vec4(0.0, 0.942809, -0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
    var vd = vec4(0.816497, -0.471405, -0.333333, 1);
    var pointsArray = []

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
    

    index = 6

    tetrahedron(va, vb, vc, vd, 3);


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    
    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var vNormals = gl.getAttribLocation(program, "a_Normals");
    gl.vertexAttribPointer(vNormals, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormals);


    var modelViewMatrixLoc = gl.getUniformLocation(program,
        "ModelViewPosition");

    var eye = vec3(0.0,1,0.0001)
    var at = vec3(0.,0.,0.)
    var up = vec3(0.,1.,0)

    var VA = lookAt(eye,at,up);

    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
    var eye = vec3(1*Math.sin(0.2),0,1*Math.cos(0.2))
    var at = vec3(0.,0.,0.)
    var up = vec3(0.,1.,0)
    var VA = lookAt(eye,at,up);
        
    var Ploc = gl.getUniformLocation(program,"P");
    var MtexLoc = gl.getUniformLocation(program,"mTex");
    var theta = 0.;
    var thetaLoc = gl.getUniformLocation(program,"theta");
    var viewDirectionProjectionInverseLocation = 
    gl.getUniformLocation(program, "u_viewDirectionProjectionInverse");
    var p = perspective(50, (canvas.height/canvas.width), 1, 2000.0);
    
    // var uvMap = getUniformLocation(program, "u_viewDirectionProjectionInverse");
    var DrawSphereUVMap = false;
    var UVLOC = gl.getUniformLocation(program, "DrawSphereUVMap");



    function render(gl, numPoints)
    {
        if (g_tex_ready < 6) {
            return;
        }
        // gl.clear(gl.COLOR_BUFFER_BIT| gl.DEPTH_BUFFER_BIT);
          
        gl.frontFace(gl.CCW);

        DrawSphereUVMap = false;
        gl.uniform1i(UVLOC,DrawSphereUVMap);

        theta+=0.01;
        gl.uniform1f(thetaLoc,theta);
        
        var p = perspective(120., (canvas.height/canvas.width), 1, 2000.0);
        gl.uniformMatrix4fv(Ploc,false,flatten(p));
        

        var eye = vec3(1*Math.sin(theta),0,1*Math.cos(theta))
        // var eye = vec3(0.0,1,0.0001)
        var at = vec3(0.,0.,0.)
        var up = vec3(0.,1,0)
        var VA = lookAt(eye,at,up);
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));
        
        var viewMatrix = inverse(VA);

        var viewDirectionProjectionMatrix = mult(p, viewMatrix);
        var viewDirectionProjectionInverseMatrix = inverse(viewDirectionProjectionMatrix);

        gl.uniformMatrix4fv(viewDirectionProjectionInverseLocation, false, flatten(viewDirectionProjectionInverseMatrix));


        var mTex = mat4();
        gl.uniformMatrix4fv(MtexLoc,false,flatten(mTex));

        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(mat4()));
        gl.uniformMatrix4fv(Ploc,false,flatten(mat4()));
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        
        DrawSphereUVMap = true;
        gl.uniform1i(UVLOC,DrawSphereUVMap);
       
        var VA = lookAt(eye,at,up);
        gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(VA));

        // var p = perspective(120., (canvas.height/canvas.width), 1, 2000.0);
        gl.uniformMatrix4fv(Ploc,false,flatten(p));
        gl.frontFace(gl.CW);
        

        gl.drawArrays(gl.TRIANGLES, 6, vertices.length-6);


        // gl.drawArrays(gl.LINES, 0, 6);

        // gl.drawElements(gl.TRIANGLES, numIndices, gl.UNSIGNED_BYTE, 0);
        // gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_BYTE, 0);
    }
    function tick() { render(gl, vertices.length); requestAnimationFrame(tick);
     }
    tick();   


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
    function triangle(a, b, c){

        var ab = normalize(mix(a, b, 0.5), true);
        var ac = normalize(mix(a, c, 0.5), true);
        var bc = normalize(mix(b, c, 0.5), true);

        pointsArray.push(a);
        pointsArray.push(b);
        pointsArray.push(c);
        vertices.push(a);
        vertices.push(b);
        vertices.push(c);
        index += 3;
    }
}