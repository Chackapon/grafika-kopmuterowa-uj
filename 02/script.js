let r=0.346243;
let g=0.235234;
let b=0.245134;

function Draw(){
	const canvas = document.getElementById('canvas');
	const gl = canvas.getContext('experimental-webgl');

	//checkGl(gl);

	const vertexData = [
		0, 0.25*Math.sqrt(3), 0,
		-0.5, -0.5, 0,
		0.5, -0.5, 0,

	];
	colors = [r, g ,b];

	console.log(1);
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, "\
	precision mediump float;\
	attribute vec3 position;\
	\
	void main() {\
		gl_Position = vec4(position, 1);\
	}\
	");
	gl.compileShader(vertexShader);


	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, '\
	precision mediump float;\
	uniform float shapeColor[3];\
	\
	void main(){\
		gl_FragColor = vec4(shapeColor[0], shapeColor[1], shapeColor[2], 1);\
	}\
	');
	gl.compileShader(fragmentShader);


	//checkShaderCompile(gl, vertexShader);


	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.validateProgram(program);


	const positionLocation = gl.getAttribLocation(program, 'position');
	let colorLocation = gl.getUniformLocation(program, 'shapeColor');

	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

	gl.enableVertexAttribArray(colorLocation);
	gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);


	gl.useProgram(program);


	r=(r*5)%1;
	g=(g*3)%1;
	b=(b*2)%1;
	//colors = [r, g ,b];
	gl.uniform1fv(colorLocation, colors);


	gl.drawArrays(gl.TRIANGLES, 0, 3);

}



