import * as THREE from "three";

export function createPlane(width = 1, height = 1, segments = 1) {
  return new THREE.PlaneGeometry(width, height, segments, segments);
}

export function createSphere(radius = 1, detail = 32) {
  return new THREE.SphereGeometry(radius, detail, detail);
}

export function createBox(w = 1, h = 1, d = 1) {
  return new THREE.BoxGeometry(w, h, d);
}
