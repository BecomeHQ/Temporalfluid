#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture0;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

varying vec2 vTexCoord;


#define PI 3.14159265359
#define TWO_PI 6.28318530718

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }


float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 6.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.2 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float drawSidedShape(vec2 st, vec2 pos, float size, int sides, vec2 indices) {
	float d = 0.0;
  // st = st *2.-1.;
  st -= pos;

  // Number of sides of your shape
  int N = sides;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  d = cos(floor(sin(u_time+snoise(st + indices)*2.096)*1.0+a/r)*r-a)*length(st);
    
  d = smoothstep( 0.734 ,1.0-size, 1.0-d);
    
	return d;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float rgb_to_luma( vec3 color ){
    return 0.2126*color.r + 0.7152*color.g + 0.0722*color.b;
}


void main() {
    

  vec2 uv = vec2(vTexCoord.x, 1.0-vTexCoord.y);
    float luma = rgb_to_luma(texture2D(uTexture0,uv).rgb);
    vec2 offset = vec2(sin(snoise( vTexCoord + u_time * 0.021)) * (0.1 * (1.0-luma)) + 1.0);
    uv = uv * offset;
  
    vec3 imgColor = texture2D(uTexture0,uv).rgb;


    gl_FragColor = vec4(imgColor,1.0);
}