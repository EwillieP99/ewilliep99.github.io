/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Object3DNode, BufferGeometryNode, MaterialNode } from "@react-three/fiber";
import type {
  Points,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  IcosahedronGeometry,
  TorusGeometry,
  AmbientLight,
  PointLight,
  DirectionalLight,
  Group,
} from "three";

declare module "@react-three/fiber" {
  interface ThreeElements {
    points: Object3DNode<Points, typeof Points>;
    bufferGeometry: BufferGeometryNode<BufferGeometry, typeof BufferGeometry>;
    bufferAttribute: any;
    pointsMaterial: MaterialNode<PointsMaterial, typeof PointsMaterial>;
    mesh: Object3DNode<Mesh, typeof Mesh>;
    meshBasicMaterial: MaterialNode<MeshBasicMaterial, typeof MeshBasicMaterial>;
    meshStandardMaterial: MaterialNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
    octahedronGeometry: BufferGeometryNode<OctahedronGeometry, typeof OctahedronGeometry>;
    icosahedronGeometry: BufferGeometryNode<IcosahedronGeometry, typeof IcosahedronGeometry>;
    torusGeometry: BufferGeometryNode<TorusGeometry, typeof TorusGeometry>;
    ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
    pointLight: Object3DNode<PointLight, typeof PointLight>;
    directionalLight: Object3DNode<DirectionalLight, typeof DirectionalLight>;
    group: Object3DNode<Group, typeof Group>;
  }
}
