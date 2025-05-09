#version 330 compatibility

in vec3 gN;  // normal in Eye coords
in vec3 gL;  // light vector in Eye coords
in vec3 gE;  // eye vector in Eye coords

in float gZ;

uniform float uKa;              // ambient coefficient
uniform float uKd;              // diffuse coefficient
uniform float uKs;              // specular coefficient
uniform float uShininess;       // shininess exponent
uniform vec4  uSpecularColor;	// light color
uniform float LightX, uLightY, uLightZ;
uniform vec4  uColor;

// For optional ChromaDepth:
uniform bool  uUseChromaDepth;
uniform float uRedDepth;
uniform float uBlueDepth;

out vec4 fragColor;

vec3 Rainbow(float t)
{
    // clamp t:
    t = clamp(t, 0.0, 1.0);  // 0.00 is red, 0.33 is green, 0.67 is blue

    float r = 1.0;
    float g = 0.0;
    float b = 1.  -  6. * ( t - (5./6.) );
    if( t <= (5./6.) )
    {
            r = 6. * ( t - (4./6.) );
            g = 0.;
            b = 1.;
    }

    if( t <= (4./6.) )
    {
            r = 0.;
            g = 1.  -  6. * ( t - (3./6.) );
            b = 1.;
    }

    if( t <= (3./6.) )
    {
            r = 0.;
            g = 1.;
            b = 6. * ( t - (2./6.) );
    }

    if( t <= (2./6.) )
    {
            r = 1.  -  6. * ( t - (1./6.) );
            g = 1.;
            b = 0.;
    }

    if( t <= (1./6.) )
    {
            r = 1.;
            g = 6. * t;
    }

    return vec3( r, g, b );
}

void
main( )
{
	vec3 Normal = normalize(gN);
	vec3 Light = normalize(gL);
	vec3 Eye = normalize(gE);

	vec3 myColor = uColor.rgb;
	
	if( uUseChromaDepth )
	{
		float t = (2./3.) * ( abs(gZ) - uRedDepth ) / ( uBlueDepth - uRedDepth );
                t = clamp( t, 0., 2./3. );
                myColor = Rainbow( t );
	} 
	// per-fragment lighting
	vec3 ambient = uKa * myColor;

	float d = max( dot(Normal,Light), 0. );  // only do diffuse if the light can see the point
	vec3 diffuse = uKd * d * myColor;

	float s = 0.;
	if( dot(Normal,Light) > 0. )	        // only do specular if the light can see the point
	{
		vec3 ref = normalize(  reflect( -Light, Normal )  );
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 specular = uKs * s * uSpecularColor.rgb;

	gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}
