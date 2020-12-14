export function setUniforms(gl, program) {
    if (!gl || !program || !performance) return;
    gl.uniform1f(program.u_time, performance.now() / 1000);
}