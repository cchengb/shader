#version 330 compatibility

#define M_PI 3.14159265359

// Outputs to fragment shader
out vec2 vST;
out vec3 vNormal;
out vec3 vEyeDir;
out vec3 vMC;

// GLman Timer
uniform float Timer;

// Movement parameters
uniform float uWaveSpeed;
uniform float uWaveHeight;
uniform float uWaveFrequency;
uniform float uCircleRadius;
uniform float uCircleSpeed;

// Texture samplers
uniform sampler2D squidTexture;
uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;

void main()
{
    vec4 pos = gl_Vertex;
    vMC = pos.xyz;
    
    // Convert Timer into a smooth oscillation with frequency
    float timeWave = sin(Timer * uWaveSpeed * 2.0 * M_PI * uWaveFrequency);  

    // Up/down motion
    pos.y += timeWave * uWaveHeight;

    // Circular movement in XZ plane
    float angle = Timer * 2.0 * M_PI * uCircleSpeed;
    pos.x += cos(angle) * uCircleRadius;
    pos.z += sin(angle) * uCircleRadius;

    // Compute normal and eye direction
    vNormal = normalize(gl_NormalMatrix * gl_Normal);
    vec3 ECposition = (gl_ModelViewMatrix * pos).xyz;
    vEyeDir = normalize(-ECposition); // Ensure correct direction

    // Pass texture coordinates
    vST = gl_MultiTexCoord0.xy;

    gl_Position = gl_ModelViewProjectionMatrix * pos;
}
