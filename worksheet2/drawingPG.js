window.onload = function init()
{
    var canvas = document.getElementById("webgl");
    var gl = canvas.getContext("webgl");
    gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);


    // var p = [ vec2(0.0, 0.5), vec2(-0.5, -0.5), vec2(0.5, -0.5) ];
    // var vBuffer = gl.createBuffer();
    

    
    var max_verts = 1000;
    var index = 0; var numPoints = 0;
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, max_verts*sizeof['vec3'], gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "a_Position");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    // var rgba = [vec4(0.,1.,0,1.),vec4(0.,0.0,1.,1.),vec4(1.0,0.,0.,0.5),vec4(1.0,0.,0.,0.5)] 
    var cbuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuff);
    gl.bufferData(gl.ARRAY_BUFFER, max_verts*sizeof['vec4'], gl.STATIC_DRAW);

    // var aBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, aBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, max_verts*sizeof['vec2'], gl.STATIC_DRAW);
    // var acolor = gl.getAttribLocation(program, "a_Color");

    var acolor = gl.getAttribLocation(program,"a_Color")
    gl.vertexAttribPointer(acolor, 4, gl.FLOAT, true, 0, 0);
    gl.enableVertexAttribArray(acolor);
    

    
    var color = vec4(0,0,0,1);
    // gl.drawArrays(gl.POINTS, 0, vertices.length);
    var DRAW_MODE = gl.points;
    var offset = 0;
    var points = [];
    var triangle = [];
    var circle = [];
    var center = [];
    var cnt = 0;
    var pointtype = 0;
    var cirCnt = 0;
    var n = 100;
    var r = 0.5;
    var circleTemp = [];
    canvas.addEventListener("click", function (ev) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        // vertices.push(vec2(ev.target. ,ev.clientY))
        // var p  =vec2(2*ev.clientX/canvas.width - 1, 2*(canvas.height - ev.clientY - 1)/canvas.height - 1);
        var bound = canvas.getBoundingClientRect();
        var p  =vec3(2*(ev.clientX - bound.left)/canvas.width - 1, 2*(canvas.height - (ev.clientY-bound.top) - 1)/canvas.height - 1,1-2*((index+1)/(max_verts)));
        
        gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec2'], flatten(p));

        gl.bindBuffer(gl.ARRAY_BUFFER,cbuff);
        gl.bufferSubData(gl.ARRAY_BUFFER,index*sizeof['vec4'],flatten(color));
        if (pointtype == 0) {
            points.push(index);
        } else if (pointtype == 1 && cnt == 2) {
            triangle.push(index);
            triangle.push(points.pop());
            triangle.push(points.pop());
        } else if (pointtype ==1 && cnt != 2) {
            points.push(index);
            
        } else if (pointtype ==2 && cirCnt ==1) {
            
            var x = 2*(ev.clientX - bound.left)/canvas.width - 1
            var y = 2*(canvas.height - (ev.clientY-bound.top) - 1)/canvas.height - 1
            var centrum = center.pop()
            console.log("centrum =",centrum)
            r = Math.hypot(centrum[0]-x, centrum[1]-y)
            console.log("r = ",r)
            // r = Math.sqrt(  )
            circle.push(points.pop());
            circleTemp = []
            
            for (let i = 0; i <= n; i++) {
                circleTemp.push(vec2(r*Math.cos(2*Math.PI*i/n)+centrum[0],r*Math.sin(2*Math.PI*i/n)+centrum[1]));
                // if (index % 2 == 0) {
                    // circle.push(index) 
                // }
            }
            console.log("circle draws")
            console.log(circleTemp)
            index = index +n
        } else if (pointtype ==2 && cirCnt !=1) {
            points.push(index)
            center.push(vec2(2*(ev.clientX - bound.left)/canvas.width - 1, 2*(canvas.height - (ev.clientY-bound.top) - 1)/canvas.height - 1))
            console.log("center cords are : ", center)
            console.log("circle center added")
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, index*sizeof['vec2'], flatten(circleTemp));

        cnt++;
        cirCnt++;
        index++;
        if (cnt == 3) {
            cnt = 0
        }
        if (cirCnt == 2) {
            cirCnt = 0
        }
    });
  

    var clearer = document.getElementById("ClearCanvas");
    clearer.addEventListener("click", function (ev) {
        console.log("Clearing Canvas");
        index = 0;
    });
    var menu = document.getElementById("colorMenu");
    menu.addEventListener("click", function(ev) {
        console.log("we are here")
        switch (menu.selectedIndex) {
            case 0:
                color = vec4(0.0,0.0,0.0,1.0);
                console.log("black");
                break;
            case 1:
                color = vec4(1.0,1.0,0.0,1.0);

                console.log("corn");
                break;
            case 2:
                color = vec4(0.3921, 0.5843, 0.9294, 1.0);

                console.log("cornflower");
                break;
           
            default:
                break;
        }
        
    });
    var poi = document.getElementById("Points");
    poi.addEventListener("click", function (ev) {
        console.log("point");
        pointtype = 0;
        cnt = 0;
    });
    var tri = document.getElementById("Triangles");
    tri.addEventListener("click", function (ev) {
        console.log("triangle");
        pointtype = 1;
        console.log(pointtype);
        offset = 200;
    });
    var cir = document.getElementById("Circles");
    cir.addEventListener("click", function (ev) {
        pointtype = 2
        console.log("circle");
        console.log(pointtype);
        cnt = 0;
        cirCnt = 0;

    });
    



    function render(gl, index)
    {
        // console.log(circle)
        // console.log(cirCnt)
       
        gl.clear(gl.COLOR_BUFFER_BIT);
        for (let i = 0; i <= index; i++) {
            if (points.includes(i)) {
                gl.drawArrays(gl.points, i, 1);
                
            } else if (triangle.includes(i)) {
                gl.drawArrays(gl.TRIANGLES, i, 3);
                i = i+2
            } else if (circle.includes(i)) {
                console.log("AHHHH")
                gl.drawArrays(gl.TRIANGLE_FAN, i, n);
                i = i+n+1
            }
        }

    }
    
    function tick() { render(gl, index); requestAnimationFrame(tick);
     }
    tick();   



   


}