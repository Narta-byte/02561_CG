window.onload = function init() {

    var canvas = document.getElementById("c");
    var gl = canvas.getContext("webgl");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
    gl.vBuffer = null;
    gl.nBuffer = null;
    var numSubdivs = 5;
    var pointsArray = [];
    var normalsArray = [];

    var theta = 0;
    var isSpinning = false;

    //For sphere
    var va = vec4(0.0, 0.0, 1.0, 1);
    var vb = vec4(0.0, 0.942809, -0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, -0.333333, 1);
    var vd = vec4(0.816497, -0.471405, -0.333333, 1);

    tetrahedron(va, vb, vc, vd, numSubdivs);

    //increse subdivition
    var inc = document.getElementById("sub_up");
    inc.addEventListener("click", function () {
        numSubdivs++;
        pointsArray = [];
        normalsArray = [];
        changeSphere(gl, numSubdivs);
    });

    //Decrese subdivition
    var dec = document.getElementById("sub_down");
    dec.addEventListener("click", function () {
        if(numSubdivs > 0){
            numSubdivs--;
            console.log(numSubdivs);
            pointsArray = [];
            normalsArray = [];
            changeSphere(gl, numSubdivs);
        }
    });

    var spin = document.getElementById("spin");
    spin.addEventListener("click", function () {
        isSpinning = !isSpinning;
    });

    //Change sphere size
    function changeSphere(gl, numSubdivs) {
        tetrahedron(va, vb, vc, vd, numSubdivs);
    }

    function tetrahedron(a, b, c, d, n) {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
    }

    function divideTriangle(a, b, c, count) {
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

    function triangle(a, b, c) {
        pointsArray.push(a);
        pointsArray.push(b);
        pointsArray.push(c);

        normalsArray.push(vec4(a[0], a[1], a[2], 0.0));
        normalsArray.push(vec4(b[0], b[1], b[2], 0.0));
        normalsArray.push(vec4(c[0], c[1], c[2], 0.0));
    }

    //sliders
    var le = 2;
    var ka = 0;
    var kd = 1;
    var ks = 1;
    var shine = 5;

    let lePos = gl.getUniformLocation(program, "uLe");
    let kaPos = gl.getUniformLocation(program, "uKa");
    let kdPos = gl.getUniformLocation(program, "uKd");
    let ksPos = gl.getUniformLocation(program, "uKs");
    let shinePos = gl.getUniformLocation(program, "uShine");

    var sliderLe = initSlider("Le");
    var sliderKa = initSlider("ka");
    var sliderKd = initSlider("kd");
    var sliderKs = initSlider("ks");
    var sliderShine = initSlider("shine");

    updateSpherevalues();

    function initSlider(id) {
        var slider = document.getElementById(id);
        slider.oninput = function () {
            updateSpherevalues();
        };
        return slider;
    }
    
    function updateSpherevalues(){
    le = parseFloat(sliderLe.value);
    gl.uniform3fv(lePos, vec3(le,le,le));
    
    ka = parseFloat(sliderKa.value);
    gl.uniform3fv(kaPos, vec3(ka,ka,ka));

    kd = parseFloat(sliderKd.value);
    gl.uniform3fv(kdPos, vec3(kd,0,0));

    ks = parseFloat(sliderKs.value);
    gl.uniform3fv(ksPos, vec3(ks,ks,ks));

    shine = parseFloat(sliderShine.value);
    gl.uniform1f(shinePos, shine);
    
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
  }

    //Lighting
    var lightPosL = gl.getUniformLocation(program, "LightPos");
    var lp = vec4(0.0, 0.0, -1.0, 0.0);
    gl.uniform4f(lightPosL, lp[0], lp[1], lp[2], lp[3]);

    var lightEmission = gl.getUniformLocation(program, "LightEmission");
    var le = vec4(1.0, 1.0, 1.0, 1.0);
    gl.uniform4f(lightEmission, le[0], le[1], le[2], le[3]);

    var modelViewMatrixLoc = gl.getUniformLocation(program, "mVm");
    var m = lookAt(vec3(0.0, 0.0, 3.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(m));

    var perspectiveLoc = gl.getUniformLocation(program, "pM");
    var p = perspective(45, (canvas.height / canvas.width), 1.0, 10.0);
    gl.uniformMatrix4fv(perspectiveLoc, false, flatten(p));

    //Display
    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);

        //buffers
        gl.nBuffer = null;
        gl.deleteBuffer(gl.nBuffer);
        gl.nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

        var vNormals = gl.getAttribLocation(program, "a_Normals");
        gl.vertexAttribPointer(vNormals, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormals);

        gl.vBuffer = null;
        gl.deleteBuffer(gl.vBuffer);
        gl.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

        var vPosition = gl.getAttribLocation(program, "a_Position");
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        if (isSpinning == true) {
            theta = (theta + 0.05) % 360;
            var modelViewMatrixLoc = gl.getUniformLocation(program, "mVm");
            var m = lookAt(vec3(3*Math.sin(theta), 0.0,3*Math.cos(theta)), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0));
            gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(m));
        }
        
        gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);
        window.requestAnimFrame(render);
    }

    

    render();
}