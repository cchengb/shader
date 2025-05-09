#version 120

varying vec2 vST; // Varying variable to pass texture coordinates

void main() {
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
