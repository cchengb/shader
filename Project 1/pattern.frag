#version 120

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform float   uShininess;	 // specular exponent
uniform float uAd, uBd, uTol; // Ellipse parameters

// in variables from the vertex shader and interpolated in the rasterizer:

varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates
varying  vec3  vMC;		   // model coordinates

const vec3 OBJECTCOLOR = vec3(0.9, 0.9, 0.9); // Base object color
const vec3 ELLIPSECOLOR = vec3(0.4, 0.7, 0.6); // Ellipse color
const vec3 SPECULARCOLOR = vec3(1.0, 1.0, 1.0); // Specular highlight color

void main()
{
    // Initialize the base color
    vec3 myColor = OBJECTCOLOR;

    // Extract texture coordinates
    float s = vST.s;
    float t = vST.t;

    // Calculate ellipse tiling parameters
    float halfAd = uAd / 2.0; // Semi-major axis
    float halfBd = uBd / 2.0; // Semi-minor axis
    int tileX = int(s / uAd); // Tile index along s
    int tileY = int(t / uBd); // Tile index along t

    // Determine the center of the current tile
    float centerS = tileX * uAd + halfAd;
    float centerT = tileY * uBd + halfBd;

    // Calculate the normalized distance from the tile center
    float normS = (s - centerS) / halfAd;
    float normT = (t - centerT) / halfBd;
    float distance = normS * normS + normT * normT;

    // Blend colors based on the ellipse equation
    float blendFactor = smoothstep(1.0 - uTol, 1.0 + uTol, distance);
    myColor = mix(ELLIPSECOLOR, OBJECTCOLOR, blendFactor);

    // Apply per-fragment lighting to myColor
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);
	
	// ambient lighting
    vec3 ambient = uKa * myColor;

	// Diffuse lighting
    float dDiffuse = max(dot(Normal, Light), 0.0); // Diffuse lighting
    vec3 diffuse = uKd * dDiffuse * myColor;

	//Specular lighting
    float specularStrength = 0.0;
    if (dDiffuse > 0.0) // Only calculate specular if the light can see the point
    {
        vec3 reflection = normalize(reflect(-Light, Normal));
        float cosPhi = max(dot(Eye, reflection), 0.0);
        specularStrength = pow(cosPhi, uShininess);
    }
    vec3 specular = uKs * specularStrength * SPECULARCOLOR;

    // Final color, combine lighting components
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
