#version 120

// out variables to be interpolated in the rasterizer and sent to each fragment shader:

varying  vec3  vN;	  // normal vector
varying  vec3  vL;	  // vector from point to light
varying  vec3  vE;	  // vector from point to eye
varying  vec2  vST;	  // (s,t) texture coordinates
varying  vec3  vMC;   // model coordinates

// where the light is:
const vec3 LightPosition = vec3(  5., 5., 0. );

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	vMC = gl_Vertex.xyz;
	vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
	vN = normalize( gl_NormalMatrix * gl_Normal );  // normal vector
	vL = LightPosition - ECposition.xyz;	    	// vector from the point to the light position
	vE = vec3( 0., 0., 0. ) - ECposition.xyz;       // vector from the point to the eye position

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
