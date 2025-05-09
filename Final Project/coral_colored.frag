#version 330 compatibility

in vec3 vN;          // Normal from vertex
in vec3 vL;          // Vector from point to light (eye space)
in vec3 vE;          // Vector from point to eye (eye space)
in vec3 vDifference; // Wave displacement from vertex
in vec3 vPosES;      // Eye-space position (for optional bumping)
in float vFade;      // "CoralFade" from vertex
in vec2  vST;        // Texture coordinates

// Lighting & color control uniforms
uniform float uKa;           // Ambient coefficient
uniform float uKd;           // Diffuse coefficient
uniform float uKs;           // Specular coefficient
uniform float uShininess;    // Spec exponent
uniform float blendFactor;   // Blend texture with color
uniform float uShowTexOnly;  // 0.0 => normal lighting, 1.0 => texture only

// Optional noise-based normal offset in the fragment:
uniform float uNoiseAmp;
uniform float uNoiseFreq;

// The coral texture
uniform sampler2D coralTexture;

void main()
{
    //  skip all lighting / color logic:
    if (uShowTexOnly > 0.5)
    {
        vec4 justTex = texture(coralTexture, vST);
        gl_FragColor = vec4(justTex.rgb, 1.0);
        return;
    }

    // Base Normal
    vec3 normal = normalize(vN);

    // Apply additional noise-based normal offset
    if (vFade > 0.1 && uNoiseAmp > 0.001)
    {
        float nx = sin(vPosES.x * uNoiseFreq) * sin(vPosES.y * uNoiseFreq);
        float ny = sin(vPosES.y * uNoiseFreq) * sin(vPosES.z * uNoiseFreq);
        float nz = sin(vPosES.z * uNoiseFreq) * sin(vPosES.x * uNoiseFreq);

        vec3 offset = vFade * uNoiseAmp * vec3(nx, ny, nz);
        normal = normalize(normal + offset);
    }

    //  Start with some base coral color
    vec3 baseColor = vec3(0.8, 0.6, 0.2) - vDifference * vFade;

    // Fragment-level noise for further color modulation
    float fragNoise = sin(uNoiseFreq * vDifference.x) *
                      sin(uNoiseFreq * vDifference.y) *
                      uNoiseAmp;
    baseColor *= (1.0 - 0.5 * fragNoise);

    // Sample the coral texture, then blend with baseColor:
    vec4 texColor = texture(coralTexture, vST);
    vec3 combinedColor = mix(baseColor, baseColor * texColor.rgb, blendFactor);

    // Optional extra multiplier to intensify
    combinedColor *= 1.2;

    // Reassign baseColor to use in lighting
    baseColor = combinedColor;

    // Compute standard Phong lighting
    vec3 L = normalize(vL);
    vec3 E = normalize(vE);

    // Ambient
    vec3 ambient = uKa * baseColor;

    // Diffuse
    float d = max(dot(normal, L), 0.0);
    vec3 diffuse = uKd * d * baseColor;

    // Specular
    float spec = 0.0;
    if (d > 0.0)
    {
        vec3 ref = reflect(-L, normal);
        float specAngle = max(dot(E, ref), 0.0);
        spec = pow(specAngle, uShininess);
    }
    vec3 specular = uKs * spec * vec3(1.0, 1.0, 1.0);

    // Final color output
    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
