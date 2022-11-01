window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    var vertices = [ vec2(0.00, 0.00)];
    var r = 0.5;
    var theta = 0.0;
    var n = 100;
    // theta = 2*Math.PI*1/n;
    // vertices.push(vec2(r*Math.cos(theta),r*Math.sin(theta)));
    for (let i = 0; i <= n; i++) {
        theta = 2*Math.PI*i/n;
        vertices.push(vec2(r*Math.cos(theta),r*Math.sin(theta)));
    }

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);




    var rgba = [vec4(0.7,0.,0.2,1)] 
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

    var tx = 0.05;
    var ty = 0.05;
    var tz = 0.05;
    var tx_h = gl.getUniformLocation(program,"tx_h");
    var ty_h = gl.getUniformLocation(program,"ty_h");
    var tz_h = gl.getUniformLocation(program,"tz_h");


    var betaloc = gl.getUniformLocation(program, "betaloc");
    var beta = 0.0;
    gl.uniform1f(betaloc,beta)


    var w = 0.01;
    var vt = 0.0;
    var wt = 0.0;

    function render(gl, numPoints)
    {
        beta += 0.05;
        gl.uniform1f(betaloc,beta)
        
        // vt = vt + wt;
        // wt = Math.sign(1-r-Math.abs(vt))*wt;
        tx += 0.000;
        // ty =Math.sin(ty-0.01);
        ty = (0.5*Math.abs(Math.cos(beta)))-0.5; 
        gl.uniform1f(tx_h,tx)
        gl.uniform1f(ty_h,ty)
        // gl.uniform4f(translation,tx,ty,tz,tpadding);

        // gl.uniform1f(betaLoc, beta);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, numPoints);
    }
    function tick() { render(gl, vertices.length); requestAnimationFrame(tick);
     }
    tick();   



}