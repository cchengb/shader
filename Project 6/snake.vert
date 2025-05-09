#version 330 compatibility

// Uniforms
uniform float XAmp;
uniform float YAmp;
uniform float ZAmp;
uniform float Period;

// Noise-based displacement
uniform float uNoiseAmp;
uniform float uNoiseFreq;

// Smooth transition for head region
uniform vec3 HeadCenter=vec3(6.2, 0.0, 0.0);  // Center of the snake's head
uniform float HeadRadius;  // Radius for smooth transition

// Outputs to the fragment shader
out vec3 vN;           // Normal (in eye space)
out vec3 vL;           // Vector from point to light (eye space)
out vec3 vE;           // Vector from point to eye (eye space)
out vec3 vDifference;  // Total displacement used
out vec3 vPosES;       // Eye-space position for bump mapping
out float vFade;       // Smooth transition factor for head region
out vec2 vST;          // Texture coordinates

const vec3 LightPosition = vec3(0.0, 5.0, 5.0);

void main()
{
    // Compute distance from the head center
    float distToHead = distance(gl_Vertex.xyz, HeadCenter);

    // Smooth transition: 
    // - 0 (no displacement) at HeadRadius
    // - 1 (full displacement) at HeadRadius + 1.0
    float fade = smoothstep(HeadRadius, HeadRadius + 1.0, distToHead);

    // Compute displacement (with fade factor applied)
    float add_X = fade * ( XAmp * sin( Period * gl_Vertex.y ) 
                         + 0.1 * sin( 3.0 * Period * gl_Vertex.y ));
    float add_Y = fade * ( YAmp * cos( Period * gl_Vertex.x ));
    float add_Z = fade * ( ZAmp * sin( Period * length(gl_Vertex) ));

    float noiseVal = sin(uNoiseFreq * gl_Vertex.x) *
                     sin(uNoiseFreq * gl_Vertex.y) *
                     uNoiseAmp;

    add_X += fade * noiseVal * 0.5;
    add_Y += fade * noiseVal * 0.3;
    add_Z += fade * noiseVal * 0.2;

    vec4 displacedPos = gl_Vertex + vec4(add_X, add_Y, add_Z, 0.0);
    gl_Position = gl_ModelViewProjectionMatrix * displacedPos;

    vDifference = vec3(add_X, add_Y, add_Z);

    // Transform the original (non-displaced) position to eye space
    vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
    vPosES = ECposition.xyz;

    // Normal, Light, Eye in eye space
    vN = normalize(gl_NormalMatrix * gl_Normal);
    vL = LightPosition - ECposition.xyz;
    vE = -ECposition.xyz;  // Vector to the eye (0,0,0 in eye space)

    // Pass fade info to the fragment shader
    vFade = fade;

    // Pass texture coordinates
    vST = gl_MultiTexCoord0.st;
}
