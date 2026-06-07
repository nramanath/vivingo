---
description: Specific architectural and performance constraints for React Three Fiber (R3F), Drei, and Rapier Physics in Vivingo
---

# 3D Game Development Rules (R3F & Rapier)

Building upon the base `.agent/rules/coding-conventions.md` and `.agent/rules/game-development.md`, this file defines the rules and best practices for building or modifying 3D games using `@react-three/fiber`, `@react-three/drei`, and `@react-three/rapier`.

## 1. Performance & The R3F Render Loop

To prevent stuttering and frame drops on low-end devices (especially target tablets for kids), agents must follow these strict rules:

- **No State Updates in `useFrame`**: Never call React state setters (e.g., `setState`) or trigger react re-renders inside `useFrame`.
- **Direct Ref Mutation**: For high-frequency animations or movements (e.g. rotating objects, translating meshes, updating scale), mutate the Three.js objects directly using React refs:
  ```tsx
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta; // CORRECT
    }
  });
  ```
- **Unsubscribed Camera & Renderer Access**: When accessing camera, size, or viewport variables inside `useFrame`, retrieve them via `get().camera` or `get().size` from the R3F state object rather than destructured state variables to avoid reactive subscriptions.

## 2. Resource Management & Cleanup

WebGL memory leaks can crash browsers on mobile devices. Adhere to the following:

- **Memoize Dynamically Created Assets**: If generating custom textures, canvas textures, or materials at runtime, wrap them in `useMemo` to ensure they are created once and reused.
- **Dispose of Geometries & Materials**: Let Three.js clean up objects. Standard built-in geometries and materials nested in JSX are cleaned up automatically by R3F. However, if you load or construct custom objects or materials manually, ensure they are disposed in the component's `useEffect` cleanup return.

## 3. Physics with `@react-three/rapier`

Rapier handles collisions and movements in a separate WebAssembly physics world.

- **RigidBody Types**:
  - Use `type="fixed"` for walls, floor, and static obstacles.
  - Use `type="dynamic"` for balls, players, or falling objects that react to gravity and forces.
  - Use `type="kinematicPosition"` or `type="kinematicVelocity"` for moving platforms or obstacles controlled manually by code.
- **Applying Forces & Impulses**: Never mutate the position or rotation of a `dynamic` rigid body using standard React refs or direct mesh mutations. You MUST use the Rapier RigidBody API:
  ```tsx
  const rbRef = useRef<RapierRigidBody>(null);
  // Correct:
  rbRef.current?.applyImpulse({ x: fx, y: 0, z: fz }, true);
  rbRef.current?.setTranslation({ x: newX, y: newY, z: newZ }, true);
  ```
- **XZ Plane Constraint**: For 2.5D games (like ball mazes), clamp the Y-axis position or vertical velocity each frame using `setLinvel` or position locks to prevent objects from jumping or falling through the floor due to high speed.

## 4. Camera & Canvas Setup

- **Responsive Viewport Fitting**: Use an orthographic camera for 2D/isometric styles. Implement a wrapper component inside the `<Canvas>` that tracks window sizes (`useThree().size`) and adjusts `camera.zoom` dynamically to fit the game layout.
- **Suspense Wrappers**: Always wrap R3F components that load assets or perform asynchronous initialization in React `<Suspense fallback={null}>`.
- **Canvas Isolation**: The `<Canvas>` component should be defined at the top-level game file (`[GameName].tsx`), while the scene setup, lighting, physics world, and 3D objects should be isolated inside a `<[GameName]Scene />` sub-component.
