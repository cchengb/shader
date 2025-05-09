#version 330 compatibility

// Uniforms for Magic Lens properties
uniform sampler2D uImageUnit; // The texture sampler

uniform float      uSc;       // Lens center (s)
uniform float      uTc;       // Lens center (t)
uniform float      uRad;      // Lens radius
uniform float      uMag;      // Magnification factor
uniform float      uWhirl;    // Whirl amount
uniform float      uMosaic;   // Mosaic tiling factor

in vec2 vST;

void main() {
    vec2 st = vST - vec2(uSc, uTc);

    float r = length(st);

    if(r > uRad) {
        // --- Outside the lens: No special effect, just do a normal lookup ---
        vec3 rgb = texture(uImageUnit, vST).rgb;
        gl_FragColor = vec4(rgb, 1.0);
    } else {
        // Inside the Magic Lens: Apply effects

        // Magnifying
        float rPrime = r / uMag;
        
        // Whirling
        float theta = atan(st.t, st.s);
        float thetaPrime = theta - uWhirl * rPrime;

        // Restore (s,t) using the transformed radius and angle
        st = rPrime * vec2(cos(thetaPrime), sin(thetaPrime));
        st += vec2(uSc, uTc);

        // Mosaic Effect
        int blockIndexS = int(st.s / uMosaic);
        int blockIndexT = int(st.t / uMosaic);

        // Center of that block
        float sc = (float(blockIndexS) + 0.5) *uMosaic;
        float tc = (float(blockIndexT) + 0.5) *uMosaic;

        //Replace st with the center of that block
        st.s = sc;
        st.t = tc;

        // Sample the texture using the adjusted coordinates
        vec3 rgb = texture(uImageUnit, st).rgb;
        gl_FragColor = vec4(rgb, 1.);
    }
}
