window.onload = function init()
{
 // My JavaScript code which runs when the webpage is loaded by the browser

 var canvas = document.getElementById("canvas");
 var gl = canvas.getContext("webgl");
 gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);
 gl.clear(gl.COLOR_BUFFER_BIT);
}