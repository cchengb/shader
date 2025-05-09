#version 120

varying vec3 vNormal;      // To pass the normal to fragment shader
varying vec3 vEyeDir;      // To pass eye direction
varying vec3 vMC;          // To pass model coordinates

void main() {
	vMC = gl_Vertex.xyz;
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vEyeDir = ECposition.xyz - vec3( 0., 0., 0. ) ; 
	       		// vector from the eye position to the point
	vNormal = normalize( gl_Normal );
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
