function Draw(){
	const canvas = document.getElementById('canvas');
	const gl = canvas.getContext('webgl');

	//checkGl(gl);
	const a = 0.4;
	const h = a*Math.sqrt(3)/2;

	const vertexData = [
		0, 0, 0,
		-a, 0, 0,
		-a/2, h, 0,

		0, 0, 0,
		-a/2, h, 0,
		a/2, h, 0,

		0, 0, 0,
		a, 0, 0,
		a/2, h, 0,


		0, 0, 0,
		-a, 0, 0,
		-a/2, -h, 0,

		0, 0, 0,
		-a/2, -h, 0,
		a/2, -h, 0,

		0, 0, 0,
		a, 0, 0,
		a/2, -h, 0,
	];

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
	void main(){\
		gl_FragColor = vec4(1, 0, 0, 1);\
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
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);


	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 18);
}



