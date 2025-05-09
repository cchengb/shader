#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles )  in;
layout( line_strip, max_vertices=78 )  out;

uniform int	    uLevel;
uniform float	uQuantize;
uniform float	uSize;
uniform float	uLightX, uLightY, uLightZ;

// Optional for ChromaDepth
uniform bool  uUseChromaDepth;
uniform float uRedDepth;
uniform float uBlueDepth;

in vec3 vN[3];

// Outputs to the Fragment Shader:
out vec3 gN;  // normal vector at this vertex
out vec3 gL;  // vector from vertex to light
out vec3 gE;  // vector from vertex to eye

// For optional ChromaDepth:
out float gZ; // eye-coordinate Z (negated), used for ChromaDepth coloring

// We'll store the triangle data from the pipeline in these global vars
vec3 V0, V1, V2;   // the 3 vertex positions in *object* coordinates
vec3 V01, V02;     // (V1 - V0), (V2 - V0)
vec3 N0, N1, N2;   // the 3 vertex normals
vec3 N01, N02;     // (N1 - N0), (N2 - N0)

vec3 LIGHTPOSITION;

// Forward declarations
vec3 QuantizeVec3(vec3 v);
float QuantizeFloat(float f);
void ProduceCrosses(float s, float t);


void main()
{
    // Retrieve the original triangle's vertex positions (from gl_PositionIn)
    // and store them in V0, V1, V2.  These are the "object coordinates"
    // because in the vertex shader we did "gl_Position = gl_Vertex" with no transformations.
    V0 = gl_PositionIn[0].xyz;
    V1 = gl_PositionIn[1].xyz;
    V2 = gl_PositionIn[2].xyz;

    // Compute edge vectors in objec space    
    V01 = V1 - V0;
    V02 = V2 - V0;

    // Retrieve the normals from the array vN[], compute normal edge vectors
    N0  =   vN[0].xyz;
	N1  =   vN[1].xyz;
	N2  =   vN[2].xyz;
	N01 = N1 - N0;
	N02 = N2 - N0;

    LIGHTPOSITION = vec3(uLightX, uLightY, uLightZ);

    int numLayers = 1 << uLevel;

    float dt = 1.0 / float(numLayers);
    float t = 1.0;

    for( int it = 0; it <= numLayers; it++ )
    {
        float smax = 1. - t;

        int nums = it + 1;
        float ds = smax / float( nums - 1 );

        float s = 0.;

        for( int is = 0; is < nums; is++ )
        {
            ProduceCrosses( s, t );
            s += ds;
        }

        t -= dt;
    }

}

// Quantize a float
float QuantizeFloat(float f)
{
    // Multiply by uQuantize, truncate to integer, then divide
    f *= uQuantize;
    int fi = int(f);
    f = float(fi) / uQuantize;
    return f;
}

// Quantize a vec3 (overloaded function)
vec3 QuantizeVec3(vec3 v)
{
    v.x = QuantizeFloat(v.x);
    v.y = QuantizeFloat(v.y);
    v.z = QuantizeFloat(v.z);
    return v;
}

// The core function to draw 3D crosses for each subdivided vertex
void ProduceCrosses(float s, float t)
{
    // Interpolate the position using (s,t):
    vec3 v = V0 + s*V01 + t*V02;
    v = QuantizeVec3(v);

    // Interpolate the normal in a corresponding way
    vec3 n = N0 + s*N01 + t*N02;
    n = normalize(n);

    // Transform position & normal to Eye Coordinates for lighting.
    vec4 eyePos = gl_ModelViewMatrix * vec4(v, 1.0);

    gN = normalize(gl_NormalMatrix * n);


    vec4 lightEye = gl_ModelViewMatrix * vec4(LIGHTPOSITION, 1.0);
    gL = normalize(lightEye.xyz - eyePos.xyz);
    gE = normalize(-eyePos.xyz);
    gZ = -eyePos.z;

    float halfSize = uSize * 0.5;
    // Draw the "3D Cross" (three line segments) using
    // line strips. Each line = 2 vertices => then EndPrimitive()
    // X cross
    {
        vec3 left  = v;         // left end
        vec3 right = v;         // right end
        left.x  -= halfSize;
        right.x += halfSize;

        // 1st vertex
        gl_Position = gl_ProjectionMatrix * (gl_ModelViewMatrix * vec4(left, 1.0));
        EmitVertex();

        // 2nd vertex
        gl_Position = gl_ProjectionMatrix * (gl_ModelViewMatrix * vec4(right, 1.0));
        EmitVertex();

        EndPrimitive();
    }
    // Y cross
    {
        vec3 down = v;
        vec3 up   = v;
        down.y -= halfSize;
        up.y   += halfSize;

        // 1st vertex
        gl_Position = gl_ProjectionMatrix * (gl_ModelViewMatrix * vec4(down, 1.0));
        EmitVertex();

        // 2nd vertex
        gl_Position = gl_ProjectionMatrix * (gl_ModelViewMatrix * vec4(up, 1.0));
        EmitVertex();

        EndPrimitive();
    }

    // Z cross
    {
        vec3 back = v;
        vec3 front= v;
        back.z  -= halfSize;
        front.z += halfSize;

        // 1st vertex
        gl_Position = gl_ProjectionMatrix * (gl_ModelViewMatrix * vec4(back, 1.0));
        EmitVertex();

        // 2nd vertex
        gl_Position = gl_ProjectionMatrix * (gl_ModelViewMatrix * vec4(front, 1.0));
        EmitVertex();

        EndPrimitive();
    }

}