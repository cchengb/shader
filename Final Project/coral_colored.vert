#version 330 compatibility

#define M_PI 3.14159

// Outputs to the fragment shader
out vec3 vN;           // Normal (in eye space)
out vec3 vL;           // Vector from point to light (eye space)
out vec3 vE;           // Vector from point to eye (eye space)
out vec3 vDifference;  // Wave displacement used
out vec3 vPosES;       // Eye-space position
out float vFade;       // Use a "fade"
out vec2 vST;          // Texture coordinates

// Wave uniform:
uniform float uX1, uY1, uAmp1, uFreq1, uDecay1;
uniform float uX2, uY2, uAmp2, uFreq2, uDecay2;
uniform float uX3, uY3, uAmp3, uFreq3, uDecay3;

uniform float Timer;        // Driving the wave phases
uniform float uNoiseAmp;    
uniform float uNoiseFreq;   

// A simple "fade" for demonstration 
uniform float CoralFade; 

const vec3 LightPosition = vec3(10.0, 23.0, 5.0);  

float calculateWave(
    float x, float y,
    float offsetX, float offsetY,
    float amp, float freq, float decay,
    float phase
)
{
    float dx = x + offsetX;
    float dy = y + offsetY;
    float r  = sqrt(dx * dx + dy * dy);

    // wave 
    return amp * cos(2.0 * M_PI * freq * r + phase) * exp(-decay * r);
}

void main()
{
    // Start with the original vertex
    vec4 vertex = gl_Vertex;

    // Combine the wave contributions
    float wave = calculateWave(vertex.x, vertex.y, uX1, uY1, uAmp1, uFreq1, uDecay1, -Timer * 25.0);
    wave      += calculateWave(vertex.x, vertex.y, uX2, uY2, uAmp2, uFreq2, uDecay2, -Timer * 30.0);
    wave      += calculateWave(vertex.x, vertex.y, uX3, uY3, uAmp3, uFreq3, uDecay3, -Timer * 35.0);

    // Add some noise:
    if (uNoiseAmp > 0.001) {
        float noiseVal = sin(uNoiseFreq * vertex.x) * sin(uNoiseFreq * vertex.y);
        wave += noiseVal * uNoiseAmp;
    }

    // Displace the vertex along its normal
    vec3 displacement = wave * gl_Normal.xyz;
    vertex.xyz += displacement;

    // Store the displacement so the fragment can do color logic
    vDifference = displacement;

    // Eye-space transform
    vec4 ECposition = gl_ModelViewMatrix * vertex;
    vPosES = ECposition.xyz;

    // Normal in eye space
    vN = normalize(gl_NormalMatrix * gl_Normal);

    // Vector to light (eye space)
    vL = LightPosition - ECposition.xyz;

    // Vector to eye (in eye space, eye is at (0,0,0))
    vE = -ECposition.xyz;

    //  fade in/out the effect, use CoralFade uniform:
    vFade = CoralFade;

    // Pass along the texture coordinates
    vST = gl_MultiTexCoord0.xy;
    
    gl_Position = gl_ModelViewProjectionMatrix * vertex;
}
