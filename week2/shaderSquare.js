window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    var vertices = [ vec2(0.5, 0.5), vec2(0.5, -0.5), vec2(-0.5, -0.5),vec2(-0.5,0.5)];
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);




    var rgba = [vec4(0.,1.,0,1.),vec4(0.,0.0,1.,1.),vec4(1.0,0.,0.,0.5),vec4(1.0,0.,0.,0.5)] 
    var aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rgba), gl.STATIC_DRAW);
    var acolor = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(acolor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(acolor);

    // var tx = 0.05;
    // var ty = 0.05;
    // var tz = 0.05;
    // var tpadding = 0.0;
    // var translation = gl.getUniformLocation(program,"translation");
    // gl.uniform4f(translation,tx,ty,tz,tpadding);
    // gl.vertexAttribPointer(v, 4, gl.FLOAT, false, 0, 0);
    // gl.enableVertexAttribArray(v);

    var betaloc = gl.getUniformLocation(program, "betaloc");
    var beta = 0.0;
    gl.uniform1f(betaloc,beta)


    function render(gl, numPoints)
    {
        beta += 0.01;
        // ty += 0.01;
        // tz += 0.01;
        // tx =Math.cos(beta)*tx+Math.sin(beta)*-ty;
        // ty =Math.cos(beta)*ty+Math.sin(beta)*tx;
        // gl.uniform4f(translation,tx,ty,tz,tpadding);
        gl.uniform1f(betaloc,beta)

        // gl.uniform1f(betaLoc, beta);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numPoints);
    }
    function tick() { render(gl, vertices.length); requestAnimationFrame(tick);
     }
    tick();   



}