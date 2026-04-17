import * as THREE from "three";

export function createBasicMaterial(color: THREE.ColorRepresentation = 0xffffff) {
  return new THREE.MeshBasicMaterial({ color });
}

export function createStandardMaterial(
  params: THREE.MeshStandardMaterialParameters = {},
) {
  return new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1, ...params });
}

export function createShaderMaterial(
  vertexShader: string,
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform> = {},
) {
  return new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms });
}
