uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
varying vec2 vUv;

void main()
{
    vec4 displacement=texture2D(uDisplacement,vUv);
    float theta=displacement.r*2.*3.1415926535897932384626433832795;
    vec2 dir = vec2(sin(theta),cos(theta));

    vec2 uv = vUv + dir*displacement.r;
    vec4 color=texture2D(uTexture,uv);
    gl_FragColor=color;
}