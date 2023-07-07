export const VERTEX_S = `
        uniform float u_time;
        varying vec3 pos;

        void main(){
          pos = position;
          vec3 p = vec3(position);

          float amplitud = 1.0;// how tall 
          float frequency = (p.z / 3.0);//how many waves at the same time
          float boxHeight = (p.y / 5.0); // third dimension effect
          float waveSubOptimal = amplitud * sin(frequency + u_time ) + boxHeight;

          vec4 result = vec4((p.x), waveSubOptimal, frequency , 0.9);
         
          gl_Position = projectionMatrix * modelViewMatrix * result;
        }
      `;

export const FRAGMENT_S = `
        uniform float u_time;
        varying vec3 pos;
        void main(){
          // pos = vec3(position);
		
        //   pos.x >= 0.0 ? 
        //     gl_FragColor = vec4( 0.0, 0.0, abs(cos(u_time)) / 2.0 , 1.0 ) // blue
        //    :
        //     gl_FragColor = vec4( (u_time) , 0.0 , 0.0 , 1.0);
			// vec3 mixed = mix();
			
	gl_FragColor = vec4( cos(0.6 * u_time), pos.x >= 0.0 ? 1.0 : 0.0, 0.0, 1.0);
}
`;
