"use client";

import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";

import { useEffect, useRef } from "react";

import "./CircularGallery.css";

type GL = Renderer["gl"];

type GalleryItem = {
  image: string;
};

type ScreenSize = {
  width: number;
  height: number;
};

type Viewport = {
  width: number;
  height: number;
};

function lerp(
  p1: number,
  p2: number,
  t: number
): number {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any): void {
  const proto = Object.getPrototypeOf(instance);

  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (
      key !== "constructor" &&
      typeof instance[key] === "function"
    ) {
      instance[key] = instance[key].bind(instance);
    }
  });
}

interface MediaProps {
  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  scene: Transform;
  screen: ScreenSize;
  viewport: Viewport;
  bend: number;
  gap: number;
}

class Media {
  extra = 0;

  geometry: Plane;
  gl: GL;
  image: string;
  index: number;
  length: number;
  scene: Transform;
  screen: ScreenSize;
  viewport: Viewport;
  bend: number;
  gap: number;

  program!: Program;
  plane!: Mesh;

  scale!: number;
  width!: number;
  widthTotal!: number;
  x!: number;

  speed = 0;

  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    scene,
    screen,
    viewport,
    bend,
    gap,
  }: MediaProps) {
    autoBind(this);

    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.gap = gap;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true,
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,

      vertex: `
        precision highp float;

        attribute vec3 position;
        attribute vec2 uv;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;

        varying vec2 vUv;

        void main() {
          vUv = uv;

          vec3 p = position;

          p.z =
            (
              sin(p.x * 4.0 + uTime) * 1.5 +
              cos(p.y * 2.0 + uTime) * 1.5
            )
            *
            (0.1 + uSpeed * 0.5);

          gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(p, 1.0);
        }
      `,

      fragment: `
        precision highp float;

        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;

        varying vec2 vUv;

        float roundedBoxSDF(
          vec2 p,
          vec2 b,
          float r
        ) {
          vec2 d = abs(p) - b;

          return length(max(d, vec2(0.0)))
            + min(max(d.x, d.y), 0.0)
            - r;
        }

        void main() {
          vec2 ratio = vec2(
            min(
              (uPlaneSizes.x / uPlaneSizes.y) /
              (uImageSizes.x / uImageSizes.y),
              1.0
            ),

            min(
              (uPlaneSizes.y / uPlaneSizes.x) /
              (uImageSizes.y / uImageSizes.x),
              1.0
            )
          );

          vec2 uv = vec2(
            vUv.x * ratio.x +
            (1.0 - ratio.x) * 0.5,

            vUv.y * ratio.y +
            (1.0 - ratio.y) * 0.5
          );

          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(
            vUv - 0.5,
            vec2(0.5 - uBorderRadius),
            uBorderRadius
          );

          float edgeSmooth = 0.002;

          float alpha =
            1.0 -
            smoothstep(
              -edgeSmooth,
              edgeSmooth,
              d
            );

          gl_FragColor =
            vec4(color.rgb, alpha);
        }
      `,

      uniforms: {
        tMap: {
          value: texture,
        },

        uPlaneSizes: {
          value: [0, 0],
        },

        uImageSizes: {
          value: [0, 0],
        },

        uSpeed: {
          value: 0,
        },

        uTime: {
          value: Math.random() * 100,
        },

        uBorderRadius: {
          value: 0.08,
        },
      },

      transparent: true,
    });

    const img = new Image();

    img.crossOrigin = "anonymous";

    img.src = this.image;

    img.onload = () => {
      texture.image = img;

      this.program.uniforms.uImageSizes.value = [
        img.naturalWidth,
        img.naturalHeight,
      ];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.plane.setParent(this.scene);
  }

  update(
    scroll: {
      current: number;
      last: number;
    },
    direction: "right" | "left"
  ) {
    this.plane.position.x =
      this.x -
      scroll.current -
      this.extra;

    const x = this.plane.position.x;

    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;

      this.plane.rotation.z = 0;
    } else {
      const BAbs = Math.abs(this.bend);

      const R =
        (H * H + BAbs * BAbs) /
        (2 * BAbs);

      const effectiveX = Math.min(
        Math.abs(x),
        H
      );

      const arc =
        R -
        Math.sqrt(
          R * R -
          effectiveX * effectiveX
        );

      if (this.bend > 0) {
        this.plane.position.y = -arc;

        this.plane.rotation.z =
          -Math.sign(x) *
          Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;

        this.plane.rotation.z =
          Math.sign(x) *
          Math.asin(effectiveX / R);
      }
    }

    this.speed =
      scroll.current -
      scroll.last;

    this.program.uniforms.uTime.value +=
      0.035;

    this.program.uniforms.uSpeed.value =
      this.speed;

    const planeOffset =
      this.plane.scale.x / 2;

    const viewportOffset =
      this.viewport.width / 2;

    const isBefore =
      this.plane.position.x +
        planeOffset <
      -viewportOffset;

    const isAfter =
      this.plane.position.x -
        planeOffset >
      viewportOffset;

    if (
      direction === "right" &&
      isBefore
    ) {
      this.extra -= this.widthTotal;
    }

    if (
      direction === "left" &&
      isAfter
    ) {
      this.extra += this.widthTotal;
    }
  }

  onResize({
    screen,
    viewport,
  }: {
    screen?: ScreenSize;
    viewport?: Viewport;
  } = {}) {
    if (screen) {
      this.screen = screen;
    }

    if (viewport) {
      this.viewport = viewport;
    }

    this.scale =
      this.screen.height /
      1500;

    this.plane.scale.y =
      (
        this.viewport.height *
        (900 * this.scale)
      ) /
      this.screen.height;

    this.plane.scale.x =
      (
        this.viewport.width *
        (700 * this.scale)
      ) /
      this.screen.width;

    this.plane.program.uniforms.uPlaneSizes.value =
      [
        this.plane.scale.x,
        this.plane.scale.y,
      ];

    this.width =
      this.plane.scale.x +
      this.gap;

    this.widthTotal =
      this.width *
      this.length;

    this.x =
      this.width *
      this.index;
  }
}

interface CircularGalleryProps {
  items?: GalleryItem[];
  bend?: number;
  autoSpeed?: number;
}

export default function CircularGallery({
  items,
  bend = 1.8,
  autoSpeed = 0.012,
}: CircularGalleryProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    let app: App | undefined;

    app = new App(
      containerRef.current,
      {
        items,
        bend,
        autoSpeed,
      }
    );

    return () => {
      app?.destroy();
    };
  }, [items, bend, autoSpeed]);

  return (
    <div
      ref={containerRef}
      className="circular-gallery"
      aria-hidden="true"
    />
  );
}

interface AppConfig {
  items?: GalleryItem[];
  bend: number;
  autoSpeed: number;
}

class App {
  container: HTMLElement;

  autoSpeed: number;

  scroll = {
    current: 0,
    target: 0,
    last: 0,
    ease: 0.035,
  };

  renderer!: Renderer;
  gl!: GL;
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;

  medias: Media[] = [];

  screen!: ScreenSize;
  viewport!: Viewport;

  raf = 0;

  boundOnResize!: () => void;

  constructor(
    container: HTMLElement,
    {
      items,
      bend,
      autoSpeed,
    }: AppConfig
  ) {
    this.container =
      container;

    this.autoSpeed =
      autoSpeed;

    this.createRenderer();

    this.createCamera();

    this.createScene();

    this.onResize();

    this.createGeometry();

    this.createMedias(
      items,
      bend
    );

    this.update();

    this.addEventListeners();
  }

  createRenderer() {
    this.renderer =
      new Renderer({
        alpha: true,
        antialias: true,
        dpr: Math.min(
          window.devicePixelRatio || 1,
          2
        ),
      });

    this.gl =
      this.renderer.gl;

    this.gl.clearColor(
      0,
      0,
      0,
      0
    );

    this.container.appendChild(
      this.gl.canvas
    );
  }

  createCamera() {
    this.camera =
      new Camera(this.gl);

    this.camera.fov = 45;

    this.camera.position.z = 20;
  }

  createScene() {
    this.scene =
      new Transform();
  }

  createGeometry() {
    this.planeGeometry =
      new Plane(this.gl, {
        heightSegments: 50,
        widthSegments: 100,
      });
  }

  createMedias(
    items: GalleryItem[] | undefined,
    bend: number
  ) {
    const defaultItems: GalleryItem[] = [
      {
        image:
          "https://picsum.photos/seed/1/800/600",
      },
      {
        image:
          "https://picsum.photos/seed/2/800/600",
      },
      {
        image:
          "https://picsum.photos/seed/3/800/600",
      },
      {
        image:
          "https://picsum.photos/seed/4/800/600",
      },
      {
        image:
          "https://picsum.photos/seed/5/800/600",
      },
      {
        image:
          "https://picsum.photos/seed/6/800/600",
      },
    ];

    const galleryItems =
      items &&
      items.length > 0
        ? items
        : defaultItems;

    const repeatedItems =
      galleryItems.concat(
        galleryItems
      );

    this.medias =
      repeatedItems.map(
        (
          item,
          index
        ) => {
          return new Media({
            geometry:
              this.planeGeometry,

            gl: this.gl,

            image:
              item.image,

            index,

            length:
              repeatedItems.length,

            scene:
              this.scene,

            screen:
              this.screen,

            viewport:
              this.viewport,

            bend,

            gap: 1.5,
          });
        }
      );
  }

  onResize() {
    this.screen = {
      width:
        this.container.clientWidth,

      height:
        this.container.clientHeight,
    };

    this.renderer.setSize(
      this.screen.width,
      this.screen.height
    );

    this.camera.perspective({
      aspect:
        this.screen.width /
        this.screen.height,
    });

    const fov =
      (this.camera.fov *
        Math.PI) /
      180;

    const height =
      2 *
      Math.tan(fov / 2) *
      this.camera.position.z;

    const width =
      height *
      this.camera.aspect;

    this.viewport = {
      width,
      height,
    };

    this.medias.forEach(
      (media) => {
        media.onResize({
          screen:
            this.screen,

          viewport:
            this.viewport,
        });
      }
    );
  }

  update() {
    this.scroll.target +=
      this.autoSpeed;

    this.scroll.current =
      lerp(
        this.scroll.current,
        this.scroll.target,
        this.scroll.ease
      );

    const direction =
      this.scroll.current >
      this.scroll.last
        ? "right"
        : "left";

    this.medias.forEach(
      (media) => {
        media.update(
          this.scroll,
          direction
        );
      }
    );

    this.renderer.render({
      scene:
        this.scene,

      camera:
        this.camera,
    });

    this.scroll.last =
      this.scroll.current;

    this.raf =
      window.requestAnimationFrame(
        this.update.bind(this)
      );
  }

  addEventListeners() {
    this.boundOnResize =
      this.onResize.bind(this);

    window.addEventListener(
      "resize",
      this.boundOnResize
    );
  }

  destroy() {
    window.cancelAnimationFrame(
      this.raf
    );

    window.removeEventListener(
      "resize",
      this.boundOnResize
    );

    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas.parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(
        this.renderer.gl.canvas
      );
    }
  }
}