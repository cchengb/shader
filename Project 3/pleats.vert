#version 120

#define PI 3.14159265358979323846

uniform float uA;       // Amplitude of sine wave
uniform float uP;       // Period of sine wave
uniform float uY0;      // Top of curtain where displacement is 0
uniform float uLightX;  // Light position X
uniform float uLightY;  // Light position Y
uniform float uLightZ;  // Light position Z

attribute vec4 position;    // Vertex position (x, y, z, w)

varying vec3 vNormal;       // Normal vector for lighting
varying vec3 vLightDirection; // Direction to light
varying vec3 vViewDirection;  // Direction to the camera

void main() {
    // Extract vertex coordinates
    float x = position.x;
    float y = position.y;

    // Calculate displacement in Z direction
    float z = uA * (uY0 - y) * sin(2.0 * PI * x / uP);

    // Update vertex position
    vec4 displacedPosition = vec4(x, y, z, 1.0);

    // Derivatives for normal calculation
    float dzdx = uA * (uY0 - y) * (2.0 * PI / uP) * cos(2.0 * PI * x / uP);
    float dzdy = -uA * sin(2.0 * PI * x / uP);

    // Tangent vectors on the surface
    vec3 Tx = vec3(1.0, 0.0, dzdx);
    vec3 Ty = vec3(0.0, 1.0, dzdy);

    // Calculate normal vector using cross product
    vec3 normal = normalize(cross(Tx, Ty));
    vNormal = normal;

    // Transform the vertex position into eye space
    vec4 eyePosition = gl_ModelViewMatrix * displacedPosition;

    // Combine light components into a vec3
    vec3 lightPositionEye = vec3(uLightX, uLightY, uLightZ);
    lightPositionEye = vec3(gl_ModelViewMatrix * vec4(lightPositionEye, 1.0));

    // Calculate light and view directions
    vLightDirection = normalize(lightPositionEye - eyePosition.xyz);
    vViewDirection = normalize(-eyePosition.xyz);

    // Pass the transformed vertex position to the pipeline
    gl_Position = gl_ModelViewProjectionMatrix * displacedPosition;
}
