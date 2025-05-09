#version 330 compatibility

in vec3 vN;          // Normal from vertex
in vec3 vL;          // Vector from point to light (eye space)
in vec3 vE;          // Vector from point to eye (eye space)
in vec3 vDifference; // Displacement
in vec3 vPosES;      // Eye-space position (for bump mapping)
in float vFade;      // Smooth transition factor for head region
in vec2  vST;        // Texture coordinates

uniform float uKa;           // Ambient coefficient
uniform float uKd;           // Diffuse coefficient
uniform float uKs;           // Specular coefficient
uniform float uShininess;    // Spec exponent
uniform float blendFactor;   // Blend texture with color
uniform float uShowTexOnly;  // 0.0 => normal lighting, 1.0 => texture only

uniform float uNoiseAmp;     // Noise amplitude
uniform float uNoiseFreq;    // Noise frequency

uniform sampler2D SnakeTex;

void main()
{
    // If we want just the texture, skip all lighting / color logic:
    if (uShowTexOnly > 0.5)
    {
        vec4 texColor = texture(SnakeTex, vST);
        gl_FragColor = vec4(texColor.rgb, 1.0);
        return;
    }

    // Base Normal
    vec3 normal = normalize(vN);

    if (vFade > 0.1)  // Small threshold to prevent artifacts
    {
        float nx = sin(vPosES.x * uNoiseFreq) * sin(vPosES.y * uNoiseFreq);
        float ny = sin(vPosES.y * uNoiseFreq) * sin(vPosES.z * uNoiseFreq);
        float nz = sin(vPosES.z * uNoiseFreq) * sin(vPosES.x * uNoiseFreq);

        vec3 offset = vFade * uNoiseAmp * vec3(nx, ny, nz);  // Apply fade factor
        normal = normalize(normal + offset);
    }


    vec3 baseColor = vec3(0.5, 1.0, 0.9) - vDifference * vFade;

    // fragment-level color modulation:
    float fragNoise = sin(uNoiseFreq * vDifference.x) * 
                      sin(uNoiseFreq * vDifference.y) * 
                      uNoiseAmp;
    baseColor *= (1.0 - 0.5 * fragNoise);

    vec4 texColor = texture(SnakeTex, vST);
    vec3 combinedColor = mix(baseColor, baseColor * texColor.rgb, blendFactor);
    combinedColor *= 1.2;
    baseColor = combinedColor;

    vec3 L = normalize(vL);
    vec3 E = normalize(vE);

    // Ambient:
    vec3 ambient = uKa * baseColor;

    // Diffuse:
    float d = max(dot(normal, L), 0.0);
    vec3 diffuse = uKd * d * baseColor;

    // Specular:
    float spec = 0.0;
    if (d > 0.0) {
        vec3 ref = reflect(-L, normal);
        spec = pow(max(dot(E, ref), 0.0), uShininess);
    }
    vec3 specular = uKs * spec * vec3(1.0, 1.0, 1.0);

    // Final Color Output
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
