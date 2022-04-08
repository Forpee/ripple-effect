uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
varying vec2 vUv;


void main()
{
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = color;
}