#version 330 compatibility

// Inputs from vertex shader
in vec2 vST;
in vec3 vNormal;
in vec3 vEyeDir;
in vec3 vMC;

// Uniforms
uniform sampler2D squidTexture;
uniform sampler3D Noise3;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uEta;
uniform float uMix;
uniform float uWhiteMix;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;

const vec3 WHITE = vec3(1.0, 1.0, 1.0);

vec3 PerturbNormal3(float angx, float angy, float angz, vec3 n)
{
    float cx = cos(angx);
    float sx = sin(angx);
    float cy = cos(angy);
    float sy = sin(angy);
    float cz = cos(angz);
    float sz = sin(angz);

    float yp = n.y * cx - n.z * sx;
    n.z = n.y * sx + n.z * cx;
    n.y = yp;

    float xp = n.x * cy + n.z * sy;
    n.z = -n.x * sy + n.z * cy;
    n.x = xp;

    xp = n.x * cz - n.y * sz;
    n.y = n.x * sz + n.y * cz;
    n.x = xp;

    return normalize(n);
}

void main()
{
    vec3 Normal = normalize(vNormal);
    vec3 Eye = normalize(vEyeDir);

    vec4 nvx = texture(Noise3, uNoiseFreq * vMC);
    vec4 nvy = texture(Noise3, uNoiseFreq * vec3(vMC.xy, vMC.z + 0.33));
    vec4 nvz = texture(Noise3, uNoiseFreq * vec3(vMC.xy, vMC.z + 0.67));

    float angx = (nvx.r + nvx.g + nvx.b + nvx.a) - 2.0;
    angx *= uNoiseAmp;
    float angy = (nvy.r + nvy.g + nvy.b + nvy.a) - 2.0;
    angy *= uNoiseAmp;
    float angz = (nvz.r + nvz.g + nvz.b + nvz.a) - 2.0;
    angz *= uNoiseAmp;

    Normal = PerturbNormal3(angx, angy, angz, Normal);
    Normal = normalize(gl_NormalMatrix * Normal);

    vec3 reflectVector = reflect(Eye, Normal);
    vec3 reflectColor = texture(uReflectUnit, reflectVector).rgb;

    vec3 refractVector = refract(Eye, Normal, uEta);

	vec3 refractColor;
	if( all( equal( refractVector, vec3(0.,0.,0.) ) ) )
	{
		refractColor = reflectColor;
	}
	else
	{
		refractColor = texture( uRefractUnit, refractVector ).rgb;
		refractColor = mix( refractColor, WHITE, uWhiteMix );
	}
    // Sample squid texture
    vec4 squidTexColor = texture(squidTexture, vST);

    // Blend texture
    vec4 finalColor = mix(vec4(refractColor, 1.0), vec4(reflectColor, 1.0), uMix);
    gl_FragColor = mix(finalColor, squidTexColor, 0.5);
}
