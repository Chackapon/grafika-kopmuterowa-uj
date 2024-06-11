const vertexShaderTxt = `
    precision mediump float;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProjection;
    
    attribute vec3 vertPosition;
    attribute vec2 textureCoord;
	attribute vec3 vertNormal;

    varying vec2 fragTextureCoord;
	varying vec3 fragNormal;

    void main() {
        fragTextureCoord = textureCoord;
		fragNormal = (mWorld * vec4(vertNormal, 0.0)).xyz;
        gl_Position = mProjection * mView * mWorld * vec4(vertPosition, 1.0);
    }
`
const fragmentShaderTxt = `
    precision mediump float;

    varying vec2 fragTextureCoord;
	varying vec3 fragNormal;
	
	uniform vec3 ambient;	
	uniform vec3 lightDirection;
	uniform vec3 lightColor;
	
	uniform sampler2D sampler;

    void main() {
		vec3 normfragNormal = normalize(fragNormal);
		vec3 normlightDirection = normalize(lightDirection);
		
		vec3 light = ambient + lightColor * max(dot(normfragNormal,normlightDirection), 0.0);
		vec4 tex = texture2D(sampler, fragTextureCoord);
        gl_FragColor = vec4(tex.rgb * light, tex.a);
    }
`
const mat4 = glMatrix.mat4;

function startDraw(){
	OBJ.downloadMeshes({
		'abstract': 'gosc.obj'
	}, Triangle);
}

let x=-2, y=0, z=0;
window.addEventListener(
  "keydown",
  (event) => {
    //const p = document.createElement("p");
    //p//.textContent = `KeyboardEvent: key='${event.key}' | code='${event.code}'`;
    //document.getElementById("output").appendChild(p);
    //window.scrollTo(0, document.body.scrollHeight);
	if(event.key=='ArrowLeft'){
		z-=(0.2+y);
		console.log('Moved left');
	}else if(event.key=='ArrowRight'){
		z+=(0.2+y);
		console.log('Moved right');
	}else if(event.key=='ArrowUp'){
		x-=(0.2+y);
		console.log('Moved forward');
	}else if(event.key=='ArrowDown'){
		x+=(0.2+y);
	}else if(event.key=='j' && y!=0){
		y=0;
		console.log('Jetpack off');
	}else if(event.key=='j'){
		y+=1;
	}
	console.log(x,y,z, event.key);
  },
  true,
);



const Triangle = function (meshes) {
	
    const canvas = document.getElementById('main-canvas');
    const gl = canvas.getContext('webgl');
    let canvasColor = [0.2, 0.5, 0.8]

    checkGl(gl);

    gl.clearColor(...canvasColor, 1.0);   // R, G, B,  A 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);



    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    checkShaderCompile(gl, vertexShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);
	
	OBJ.initMeshBuffers(gl, meshes.abstract);
	console.log(meshes.abstract);
	gl.bindBuffer(gl.ARRAY_BUFFER, meshes.abstract.vertexBuffer);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshes.abstract.indexBuffer);

    const boxVertices = 
	[ // X, Y, Z         
		// Top
		-1.0, 1.0, -1.0,    
		-1.0, 1.0, 1.0,     
		1.0, 1.0, 1.0,      
		1.0, 1.0, -1.0,     

		// Left
		-1.0, 1.0, 1.0,     
		-1.0, -1.0, 1.0,    
		-1.0, -1.0, -1.0,   
		-1.0, 1.0, -1.0,    

		// Right
		1.0, 1.0, 1.0,      
		1.0, -1.0, 1.0,     
		1.0, -1.0, -1.0,    
		1.0, 1.0, -1.0,     

		// Front
		1.0, 1.0, 1.0,      
		1.0, -1.0, 1.0,     
		-1.0, -1.0, 1.0,    
		-1.0, 1.0, 1.0,     

		// Back
		1.0, 1.0, -1.0,     
		1.0, -1.0, -1.0,    
		-1.0, -1.0, -1.0,   
		-1.0, 1.0, -1.0,    

		// Bottom
		-1.0, -1.0, -1.0,   
		-1.0, -1.0, 1.0,    
		1.0, -1.0, 1.0,     
		1.0, -1.0, -1.0,    
	];

	const boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23,
	];

    /*let colors = [
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.2, 1.0,
        0.5, 1.0, 0.0,

        0.8, 0.0, 0.2,
        0.0, 1.0, 1.0,
        0.0, 0.2, 1.0,
        0.5, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.2, 1.0,
        0.5, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.2, 1.0,
        0.5, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.2, 1.0,
        0.5, 1.0, 0.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.2, 1.0,
        0.5, 1.0, 0.0,
    ]*/
	 boxTexCoords = [
        0, 0,
        0, 1,
        1, 1,
        1, 0,


        0, 0,
        1, 0,
        1, 1,
        0, 1,


        1, 1,
        0, 1,
        0, 0,
        1, 0,


        1, 1,
        1, 0,
        0, 0,
        0, 1,


        0, 0,
        0, 1,
        1, 1,
        1, 0,


        1, 1,
        1, 0,
        0, 0,
        0, 1
	];
	

    //const boxVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, meshes.abstract.vertexBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    //const boxIndicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshes.abstract.indexBuffer);
    //gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
    
    const posAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        posAttribLocation,
        meshes.abstract.vertexBuffer.itemSize,
        gl.FLOAT,
        gl.FALSE,
        0,
        0
    );
    gl.enableVertexAttribArray(posAttribLocation);

    //const boxTextureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, meshes.abstract.textureBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxTexCoords), gl.STATIC_DRAW);
    
    const textureLocation = gl.getAttribLocation(program, 'textureCoord');
    gl.vertexAttribPointer(
        textureLocation,
        meshes.abstract.textureBuffer.itemSize,
        gl.FLOAT,
        gl.FALSE,
        0,
        0,
    );
    gl.enableVertexAttribArray(textureLocation);
	
	const normalLocation = gl.getAttribLocation(program, 'vertNormal');
    gl.vertexAttribPointer(
        normalLocation,
        meshes.abstract.normalBuffer.itemSize,
        gl.FLOAT,
        gl.TRUE,
        0,
        0,
    );
    gl.enableVertexAttribArray(normalLocation);
    
	const img = document.getElementById('boxTextureImg');
	const boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		img
	);
    // render time

    gl.useProgram(program);

    const worldMatLoc = gl.getUniformLocation(program, 'mWorld');
    const viewMatLoc = gl.getUniformLocation(program, 'mView');
    const projectionMatLoc = gl.getUniformLocation(program, 'mProjection');

    const worldMatrix = mat4.create();
	const worldMatrix2 = mat4.create();
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [0,0,-8], [0,0,0], [0,1,0]);
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, glMatrix.glMatrix.toRadian(60), 
                    canvas.width/canvas.height, 1, 60)

    gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(viewMatLoc, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(projectionMatLoc, gl.FALSE, projectionMatrix);
	
	
	let ambientLightLocation = gl.getUniformLocation(program, 'ambient');
	let lightDirLocation = gl.getUniformLocation(program, 'lightDirection');
	let lightColorLocation = gl.getUniformLocation(program, 'lightColor');
	
	let ambientColor = [0.2, 0.2, 0.2];
	gl.uniform3f(ambientLightLocation, ...ambientColor);
	gl.uniform3f(lightDirLocation, ...[5.0, 5.0, 5.0]);
	gl.uniform3f(lightColorLocation, ...[0.4, 0.3, 0.2]);

    const identityMat = mat4.create();
	let rotationMatrix = new Float32Array(16);
	let translationMatrix = new Float32Array(16);
    let angle = 0;

	let a=0;
    const loop = function () {
		//console.log(x,y,z);
		a+=20*y;
		mat4.lookAt(viewMatrix, [x, x, x-8], [z,0,0], [a,a+1,a]);
		gl.uniformMatrix4fv(viewMatLoc, gl.FALSE, viewMatrix);
		
        angle = performance.now() / 1000 / 60 * 23 * Math.PI;
        mat4.rotate(worldMatrix, identityMat, angle, [1,1,-0.5]);
        gl.uniformMatrix4fv(worldMatLoc, gl.FALSE, worldMatrix);
        
        gl.clearColor(...canvasColor, 1.0);   // R, G, B,  A 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.activeTexture(gl.TEXTURE0);
        // gl.drawArrays(gl.TRIANGLES, 0, 24);
        gl.drawElements(gl.TRIANGLES, meshes.abstract.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
		
		let rotationMatrix = new Float32Array(16);
		let translationMatrix = new Float32Array(16);

		mat4.fromRotation(rotationMatrix, angle/2, [1,2,0]);
		mat4.fromTranslation(translationMatrix, [2,0,0]);
		mat4.mul(worldMatrix2, translationMatrix, rotationMatrix);
		gl.uniformMatrix4fv(worldMatLoc, gl.FLASE, worldMatrix2);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

} 


function checkGl(gl) {
    if (!gl) {console.log('WebGL not suppoerted, use another browser');}
}

function checkShaderCompile(gl, shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('shader not compiled', gl.getShaderInfoLog(shader));
    }
}

function checkLink(gl, program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('linking error', gl.getProgramInfoLog(program));
    }
}