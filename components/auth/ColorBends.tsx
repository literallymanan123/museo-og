"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ColorBends.css";

type ColorBendsProps = {
  className?: string;
  style?: React.CSSProperties;
  rotation?: number;
  speed?: number;
  colors?: string[];
  autoRotate?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
  iterations?: number;
  intensity?: number;
  bandWidth?: number;
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;

    gl_Position = vec4(
      position,
      1.0
    );
  }
`;

const fragmentShader = `
  uniform vec2 uCanvas;
  uniform float uTime;
  uniform float uSpeed;
  uniform vec2 uPointer;

  varying vec2 vUv;

  /*
    Random function
  */
  float random(vec2 st) {
    return fract(
      sin(
        dot(
          st.xy,
          vec2(
            12.9898,
            78.233
          )
        )
      )
      *
      43758.5453123
    );
  }

  /*
    Smooth noise
  */
  float noise(vec2 st) {

    vec2 i =
      floor(
        st
      );

    vec2 f =
      fract(
        st
      );

    f =
      f *
      f *
      (
        3.0 -
        2.0 *
        f
      );

    float a =
      random(
        i
      );

    float b =
      random(
        i +
        vec2(
          1.0,
          0.0
        )
      );

    float c =
      random(
        i +
        vec2(
          0.0,
          1.0
        )
      );

    float d =
      random(
        i +
        vec2(
          1.0,
          1.0
        )
      );

    return mix(
      mix(
        a,
        b,
        f.x
      ),

      mix(
        c,
        d,
        f.x
      ),

      f.y
    );
  }

  void main() {

    /*
      Animation time
    */
    float time =
      uTime *
      uSpeed;

    /*
      Coordinates
    */
    vec2 uv =
      vUv *
      2.0 -
      1.0;

    /*
      Maintain aspect ratio
    */
    float aspect =
      uCanvas.x /
      uCanvas.y;

    uv.x *=
      aspect;

    /*
      Very subtle mouse movement
    */
    uv +=
      uPointer *
      0.08;

    /*
      Working coordinates
    */
    vec2 p =
      uv;

    /*
      Large organic movement
    */
    p.x +=
      sin(
        p.y *
        1.6 +
        time *
        0.28
      )
      *
      0.22;

    p.y +=
      cos(
        p.x *
        1.3 -
        time *
        0.22
      )
      *
      0.16;

    /*
      Additional soft distortion
    */
    float noiseOne =
      noise(
        p *
        1.25 +
        time *
        0.08
      );

    float noiseTwo =
      noise(
        p *
        2.4 -
        time *
        0.06
      );

    /*
      Broad purple field
    */
    float purpleField =
      smoothstep(
        0.9,
        -0.15,

        p.x
        +
        sin(
          p.y *
          1.8 +
          time *
          0.35
        )
        *
        0.45
      );

    /*
      Soft flowing violet movement
    */
    float violetFlow =
      sin(
        p.x *
        1.8
        +
        p.y *
        2.0
        +
        time *
        0.45
      );

    violetFlow =
      smoothstep(
        0.15,
        0.85,
        violetFlow
      );

    /*
      First soft glow
    */
    float glowOne =
      exp(
        -(
          pow(
            p.x
            +
            0.55
            +
            sin(
              time *
              0.25
            )
            *
            0.15,

            2.0
          )

          +

          pow(
            p.y -
            0.35,

            2.0
          )
        )
        *
        1.8
      );

    /*
      Second soft glow
    */
    float glowTwo =
      exp(
        -(
          pow(
            p.x -
            0.55,

            2.0
          )

          +

          pow(
            p.y
            +
            0.45
            +
            sin(
              time *
              0.22
            )
            *
            0.15,

            2.0
          )
        )
        *
        2.4
      );

    /*
      Almost black base
    */
    vec3 color =
      vec3(
        0.004,
        0.003,
        0.008
      );

    /*
      Deep purple atmosphere
    */
    color +=
      vec3(
        0.075,
        0.015,
        0.16
      )
      *
      purpleField
      *
      0.75;

    /*
      Soft violet movement
    */
    color +=
      vec3(
        0.18,
        0.025,
        0.42
      )
      *
      violetFlow
      *
      0.42;

    /*
      Blended purple light
    */
    color +=
      vec3(
        0.28,
        0.035,
        0.62
      )
      *
      glowOne
      *
      0.45;

    color +=
      vec3(
        0.18,
        0.02,
        0.42
      )
      *
      glowTwo
      *
      0.42;

    /*
      Very subtle texture
    */
    color +=
      (
        noiseOne -
        0.5
      )
      *
      0.025;

    color +=
      (
        noiseTwo -
        0.5
      )
      *
      0.015;

    /*
      Dark vignette
    */
    float vignette =
      smoothstep(
        1.5,
        0.35,

        length(
          uv
        )
      );

    color *=
      mix(
        0.7,
        1.0,
        vignette
      );

    /*
      Final color
    */
    color =
      clamp(
        color,
        0.0,
        1.0
      );

    gl_FragColor =
      vec4(
        color,
        1.0
      );
  }
`;

export default function ColorBends({
  className = "",
  style,
  rotation = 0,
  speed = 0.18,
  mouseInfluence = 0.35,
  parallax = 0.15,
}: ColorBendsProps) {
  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const materialRef =
    useRef<THREE.ShaderMaterial | null>(
      null
    );

  const animationFrameRef =
    useRef<number | null>(
      null
    );

  const pointerTargetRef =
    useRef(
      new THREE.Vector2(
        0,
        0
      )
    );

  const pointerCurrentRef =
    useRef(
      new THREE.Vector2(
        0,
        0
      )
    );

  useEffect(() => {

    const container =
      containerRef.current;

    if (
      !container
    ) {
      return;
    }

    /*
      Scene
    */
    const scene =
      new THREE.Scene();

    /*
      Camera
    */
    const camera =
      new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        0,
        1
      );

    /*
      Geometry
    */
    const geometry =
      new THREE.PlaneGeometry(
        2,
        2
      );

    /*
      Material
    */
    const material =
      new THREE.ShaderMaterial({

        vertexShader,

        fragmentShader,

        uniforms: {

          uCanvas: {
            value:
              new THREE.Vector2(
                1,
                1
              ),
          },

          uTime: {
            value:
              0,
          },

          uSpeed: {
            value:
              speed,
          },

          uPointer: {
            value:
              new THREE.Vector2(
                0,
                0
              ),
          },

        },

      });

    materialRef.current =
      material;

    /*
      Mesh
    */
    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    scene.add(
      mesh
    );

    /*
      Renderer
    */
    const renderer =
      new THREE.WebGLRenderer({
        antialias:
          true,

        alpha:
          false,

        powerPreference:
          "high-performance",
      });

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio ||
          1,

        2
      )
    );

    renderer.domElement.style.width =
      "100%";

    renderer.domElement.style.height =
      "100%";

    renderer.domElement.style.display =
      "block";

    container.appendChild(
      renderer.domElement
    );

    /*
      Resize
    */
    const resize =
      () => {

        const width =
          container.clientWidth ||
          1;

        const height =
          container.clientHeight ||
          1;

        renderer.setSize(
          width,
          height,
          false
        );

        (
          material
            .uniforms
            .uCanvas
            .value as THREE.Vector2
        ).set(
          width,
          height
        );
      };

    resize();

    /*
      Resize observer
    */
    const resizeObserver =
      new ResizeObserver(
        resize
      );

    resizeObserver.observe(
      container
    );

    /*
      Pointer movement
    */
    const handlePointerMove =
      (
        event: PointerEvent
      ) => {

        const rect =
          container.getBoundingClientRect();

        const x =
          (
            (
              event.clientX -
              rect.left
            )
            /
            (
              rect.width ||
              1
            )
          )
          *
          2
          -
          1;

        const y =
          -(
            (
              (
                event.clientY -
                rect.top
              )
              /
              (
                rect.height ||
                1
              )
            )
            *
            2
            -
            1
          );

        pointerTargetRef.current.set(
          x,
          y
        );
      };

    container.addEventListener(
      "pointermove",
      handlePointerMove
    );

    /*
      Animation
    */
    const clock =
      new THREE.Clock();

    const animate =
      () => {

        const elapsed =
          clock.getElapsedTime();

        material.uniforms.uTime.value =
          elapsed;

        pointerCurrentRef.current.lerp(
          pointerTargetRef.current,
          0.035
        );

        (
          material
            .uniforms
            .uPointer
            .value as THREE.Vector2
        ).copy(
          pointerCurrentRef.current
        );

        renderer.render(
          scene,
          camera
        );

        animationFrameRef.current =
          requestAnimationFrame(
            animate
          );
      };

    animationFrameRef.current =
      requestAnimationFrame(
        animate
      );

    /*
      Cleanup
    */
    return () => {

      if (
        animationFrameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      resizeObserver.disconnect();

      container.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      geometry.dispose();

      material.dispose();

      renderer.dispose();

      if (
        renderer.domElement.parentElement ===
        container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };

  }, [
    speed,
  ]);

  return (
    <div
      ref={
        containerRef
      }
      className={
        `color-bends-container ${className}`
      }
      style={
        style
      }
    />
  );
}