#version 330 compatibility

in vec2 vST;
out vec4 fragColor;

#define M_PI 3.14159265359

uniform float Timer;
uniform float uAlphaCutoff = 0.5;
uniform sampler2D fishTexture;

void main()
{
    // Get the texture color
    vec4 texColor = texture(fishTexture, vST);

    // Animate color intensity effect
    float intensity = sin(Timer * M_PI * 2.0) * 0.5 + 0.5;
    
    // Apply animated effect to texture color
    vec3 modifiedColor = texColor.rgb * mix(vec3(1.0, 0.8, 0.2), vec3(0.0, 0.4, 1.0), intensity);

    // Adjust transparency
    float alpha = max(0.4, texColor.a * (1.0 - (intensity * uAlphaCutoff)));

    fragColor = vec4(modifiedColor, alpha);
}
