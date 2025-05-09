#version 120

// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	       // coefficients of each type of lighting -- make sum to 1.0
uniform float   uShininess;	           // specular exponent
uniform float uAd, uBd, uTol;         // Ellipse parameters
uniform float uNoiseAmp, uNoiseFreq;  // Noise parameters
uniform sampler3D Noise3;             // 3D Noise texture

// in variables from the vertex shader and interpolated in the rasterizer:

varying  vec3  vN;		   // normal vector
varying  vec3  vL;		   // vector from point to light
varying  vec3  vE;		   // vector from point to eye
varying  vec2  vST;		   // (s,t) texture coordinates
varying  vec3  vMC;		   // model coordinates

const vec3 OBJECTCOLOR = vec3(0.7, 1.0, 0.8); // Base object color, smuag color: 0.8,0.4, 0.3
const vec3 ELLIPSECOLOR = vec3(0.6, 0.2, 0.8); // Ellipse color cyan: 0.4 0.7 0.6
const vec3 SPECULARCOLOR = vec3(1.0, 1.0, 1.0); // Specular highlight color

void main()
{
    // Initialize the base color
    vec3 myColor = OBJECTCOLOR;

    // Extract texture coordinates
    float s = vST.s;
    float t = vST.t;

    // Calculate noise
    vec4 nv = texture3D(Noise3, uNoiseFreq * vec3(vST, 0.));
    float n = nv.r * 2.0 - 1.0; // Convert to range [-1, 1]
    n *= uNoiseAmp;             // Scale by noise amplitude

    // Perturb s and t with noise
    float perturbedS = s + n;
    float perturbedT = t + n;

    // Ellipse calculation
    float normS = (perturbedS - floor(perturbedS / uAd) * uAd - uAd / 2.0) / (uAd / 2.0);
    float normT = (perturbedT - floor(perturbedT / uBd) * uBd - uBd / 2.0) / (uBd / 2.0);
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
