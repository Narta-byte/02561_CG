float noise(vec3 p)
{
    float result = 0.0;
    result += sin(dot(p,vec3(1.0,0.0,0.0)));
    result += sin(dot(p,vec3(1.0,1.0,0.0)));
    result += sin(dot(p,vec3(0.0,0.0,1.0)));
    result += sin(dot(p,vec3(0.5,-0.5,-10.0)));
    return 0.1*result;
}

vec3 woodtex(vec3 p, vec3 a)
{
    vec3 wood = vec3(202.0,170.0,122.0)/255.0;
    vec3 pp = p-a*dot(p,a);
    float d = length(pp);
    return mix(wood, vec3(cos(d+0.25*noise(p))),0.1);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float beta = iTime;
    vec3 light = normalize(vec3(cos(beta),sin(beta),sqrt(0.010)*0.5));
    float alpha = 3.14+0.2;
    vec3 axis  = vec3(0.0,cos(alpha),sin(alpha));
    float r = 0.5;
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    float a = iResolution.x/iResolution.y;
    // Time varying pixel color
    //vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
    //vec3 wood = vec3((202.0,170.0,122.0)/255.0);
   ;
    vec2 v  = (uv-0.5)*vec2(a,1.0);
    float d = length(v);
    vec3 p = vec3(v,sqrt(r*r-d*d));
    float cos_theta = max(dot(light,p/r),0.3);
    p+=vec3(0.05,0.5,0.1);
    
    
    vec3 col = woodtex(p,axis)*cos_theta;
    // Output to screen
    vec3 test = vec3(noise(vec3(p.xy,1.0)));
    fragColor = d < r ? vec4(col,1.0) : vec4(test,1.0);
}