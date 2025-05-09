#version 120

uniform sampler2D uTexture; // 2D texture sampler
varying vec2 vST;     // Interpolated texture coordinates from vertex shader

void main() {
    vec3 texColor = texture2D(uTexture, vST).rgb; // Sample the texture
    gl_FragColor = vec4(texColor, 1.0); // Set the fragment color
}
