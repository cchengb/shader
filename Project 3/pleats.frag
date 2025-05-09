#version 120

uniform vec3 uKa;             // Ambient coefficient
uniform vec3 uKd;             // Diffuse coefficient
uniform vec3 uKs;             // Specular coefficient
uniform float uShininess;     // Shininess exponent
uniform vec3 uBaseColor;      // Base color of the curtain

varying vec3 vNormal;         // Normal vector from vertex shader
varying vec3 vLightDirection; // Light direction
varying vec3 vViewDirection;  // View direction

void main() {
    // Normalize vectors
    vec3 N = normalize(vNormal);
    vec3 L = normalize(vLightDirection);
    vec3 V = normalize(vViewDirection);
    vec3 H = normalize(L + V); // Halfway vector

    N = normalize(  gl_NormalMatrix * N  );
    
    // Do per-fragment lighting (ambient + diffuse + specular)
    float ndotl = max(dot(N, L), 0.0);
    float ndoth = max(dot(N, H), 0.0);

    vec3 ambient  = uKa * uBaseColor;
    vec3 diffuse  = uKd * uBaseColor* ndotl;
    vec3 specular = uKs * pow(ndoth, uShininess);

    // Final color
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
    
}
