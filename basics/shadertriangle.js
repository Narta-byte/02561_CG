window.onload = function init()
{
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    var vertices = [ vec2(0.0, 1.0), vec2(0.0, -0.5), vec2(1, 0.) ];
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var rgba = [vec4(0.,1.,0,1.),vec4(0.,0.0,1.,1.),vec4(1.0,0.,0.,0.5)] 
    var aBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(rgba), gl.STATIC_DRAW);
    var acolor = gl.getAttribLocation(program, "a_Color");
    gl.vertexAttribPointer(acolor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(acolor);

    // gl.drawArrays(gl.POINTS, 0, vertices.length);

    // var u_FragColorLoc = gl.getUniformLocation(program, "u_FragColor");

    // gl.uniform4f(u_FragColorLoc, rgba[0], rgba[1], rgba[2], rgba[3]);
    
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}