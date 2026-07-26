let THREE;

async function loadThreeRuntime() {
  const {
    ACESFilmicToneMapping,
    AdditiveBlending,
    AmbientLight,
    BoxGeometry,
    BufferAttribute,
    BufferGeometry,
    Clock,
    Color,
    CylinderGeometry,
    FogExp2,
    Group,
    Line,
    LineBasicMaterial,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    Points,
    PointsMaterial,
    QuadraticBezierCurve3,
    Scene,
    ShaderMaterial,
    SphereGeometry,
    SRGBColorSpace,
    TetrahedronGeometry,
    TorusGeometry,
    TorusKnotGeometry,
    Vector2,
    Vector3,
    WebGLRenderer
  } = await import("three");

  return {
    ACESFilmicToneMapping,
    AdditiveBlending,
    AmbientLight,
    BoxGeometry,
    BufferAttribute,
    BufferGeometry,
    Clock,
    Color,
    CylinderGeometry,
    FogExp2,
    Group,
    Line,
    LineBasicMaterial,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    Points,
    PointsMaterial,
    QuadraticBezierCurve3,
    Scene,
    ShaderMaterial,
    SphereGeometry,
    SRGBColorSpace,
    TetrahedronGeometry,
    TorusGeometry,
    TorusKnotGeometry,
    Vector2,
    Vector3,
    WebGLRenderer
  };
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)");
const stage = document.querySelector("#webgl-stage");
const loader = document.querySelector("#loader");
const loaderValue = document.querySelector("#loader-value");
const statusLabel = document.querySelector("#webgl-status");
const progressBar = document.querySelector("#scroll-progress");
const header = document.querySelector("#site-header");

let loaderProgress = 0;
const loaderTimer = window.setInterval(() => {
  loaderProgress = Math.min(loaderProgress + Math.ceil(Math.random() * 7), 88);
  loaderValue.textContent = `${loaderProgress}%`;
}, 90);

const projectDetails = {
  iris: {
    category: "Estudo conceitual · Identidade visual · Direção de arte IA",
    title: "Íris",
    description:
      "Um sistema visual construído a partir de luz orgânica, macrotexturas e pulsos neurais. A identidade nasce para hipnotizar sem perder clareza ou função."
  },
  fragmento: {
    category: "Estudo conceitual · Vídeo · Motion · Inteligência artificial",
    title: "Fragmento",
    description:
      "Cerâmica, ruptura e energia interna traduzem uma marca em transformação. O conceito combina geração por IA, composição e acabamento de motion."
  },
  orbita: {
    category: "Estudo conceitual · Web design · Experiência 3D",
    title: "Órbita",
    description:
      "Uma jornada digital guiada por profundidade, escala e descoberta. O usuário deixa de apenas navegar e passa a atravessar a narrativa."
  },
  pulso: {
    category: "Estudo conceitual · Meta Ads · Estratégia criativa",
    title: "Pulso",
    description:
      "Campanhas construídas como sistemas vivos: criativos, dados e iteração rápida trabalhando juntos para ampliar atenção e conversão."
  },
  sinal: {
    category: "Estudo conceitual · Podcast · Produção e pós-produção",
    title: "Sinal",
    description:
      "Um podcast tratado como produto visual: captação, edição, identidade e cortes verticais nascem juntos, para que cada episódio alimente as redes durante toda a semana."
  },
  vazio: {
    category: "Estudo conceitual · Filme de marca · IA generativa",
    title: "Vazio",
    description:
      "Um filme sobre o instante antes da ideia ganhar forma. Direção minimalista, contraste brutal e pequenos sinais de luz sustentam toda a atmosfera."
  }
};

function initializeInterface() {
  const menuButton = document.querySelector("#menu-toggle");
  const navigation = document.querySelector("#main-nav");
  const dialog = document.querySelector("#project-dialog");
  const dialogClose = document.querySelector("#dialog-close");
  const dialogCategory = document.querySelector("#dialog-category");
  const dialogTitle = document.querySelector("#dialog-title");
  const dialogDescription = document.querySelector("#dialog-description");
  const filterButtons = [...document.querySelectorAll(".filter-chip")];
  const projectCards = [...document.querySelectorAll(".project-card")];
  const projectsGrid = document.querySelector("#projects-grid");
  const worksEmpty = document.querySelector("#works-empty");
  const headerBrand = header.querySelector(".brand");
  const backgroundAreas = [document.querySelector("main"), document.querySelector("footer")];

  function setMenuBackgroundInert(isInert) {
    headerBrand.inert = isInert;
    backgroundAreas.forEach((area) => {
      area.inert = isInert;
    });
  }

  function closeMenu({ restoreFocus = false } = {}) {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    setMenuBackgroundInert(false);
    if (restoreFocus) menuButton.focus();
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
    setMenuBackgroundInert(!isOpen);
    if (!isOpen) navigation.querySelector("a").focus();
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu({ restoreFocus: true });
    }
  });

  function applyProjectFilter(filter) {
    let visibleCount = 0;

    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    projectCards.forEach((card) => {
      const isVisible = filter === "all" || card.dataset.category === filter;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    projectsGrid.classList.toggle("is-filtered", filter !== "all");
    projectsGrid.dataset.visibleCount = String(visibleCount);
    worksEmpty.hidden = visibleCount > 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyProjectFilter(button.dataset.filter);
    });
  });

  applyProjectFilter("all");

  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const project = projectDetails[card.dataset.project];
      if (!project) return;

      dialogCategory.textContent = project.category;
      dialogTitle.textContent = project.title;
      dialogDescription.textContent = project.description;
      dialog.showModal();
    });

    if (!coarsePointer.matches && !reducedMotion.matches) {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    }
  });

  dialogClose.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  function updateInterfaceOnScroll() {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollRange > 0 ? window.scrollY / scrollRange : 0;
    progressBar.style.transform = `scaleX(${progress})`;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", updateInterfaceOnScroll, { passive: true });
  updateInterfaceOnScroll();
}

function createIris() {
  const group = new THREE.Group();

  const pupil = new THREE.Mesh(
    new THREE.SphereGeometry(1.34, 64, 64),
    new THREE.MeshPhysicalMaterial({
      color: 0x010102,
      roughness: 0.08,
      metalness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.05
    })
  );
  pupil.scale.z = 0.58;
  group.add(pupil);

  const irisMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uViolet: { value: new THREE.Color(0x7a1018) },
      uMagenta: { value: new THREE.Color(0xd52b3f) },
      uPink: { value: new THREE.Color(0xff6b78) }
    },
    vertexShader: `
      uniform float uTime;
      varying vec2 vUv;
      varying float vPulse;

      void main() {
        vUv = uv;
        vec3 transformed = position;
        float wave = sin(position.x * 7.0 + uTime * 0.7)
          * cos(position.y * 8.0 - uTime * 0.45) * 0.035;
        transformed += normal * wave;
        vPulse = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uViolet;
      uniform vec3 uMagenta;
      uniform vec3 uPink;
      varying vec2 vUv;
      varying float vPulse;

      void main() {
        float fibers = sin(vUv.x * 175.0 + sin(vUv.y * 20.0 + uTime) * 3.5);
        fibers = smoothstep(0.15, 0.95, fibers);
        float slowBand = sin(vUv.x * 17.0 - uTime * 0.35) * 0.5 + 0.5;
        vec3 color = mix(uViolet, uMagenta, slowBand);
        color = mix(color, uPink, fibers * 0.52 + vPulse * 1.5);
        float glow = 0.72 + fibers * 0.55;
        gl_FragColor = vec4(color * glow, 0.92);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const iris = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.64, 72, 260),
    irisMaterial
  );
  group.add(iris);

  const outerRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.58, 0.026, 16, 220),
    new THREE.MeshBasicMaterial({
      color: 0xff6b78,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending
    })
  );
  group.add(outerRing);

  const filamentMaterials = [
    new THREE.LineBasicMaterial({
      color: 0xd52b3f,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    }),
    new THREE.LineBasicMaterial({
      color: 0x7a1018,
      transparent: true,
      opacity: 0.54,
      blending: THREE.AdditiveBlending
    })
  ];

  for (let index = 0; index < 64; index += 1) {
    const angle = (index / 64) * Math.PI * 2 + Math.random() * 0.025;
    const inner = 1.15 + Math.random() * 0.12;
    const outer = 2.42 + Math.random() * 0.16;
    const bend = (Math.random() - 0.5) * 0.24;
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(Math.cos(angle) * inner, Math.sin(angle) * inner, 0.18),
      new THREE.Vector3(
        Math.cos(angle + bend) * ((inner + outer) * 0.5),
        Math.sin(angle + bend) * ((inner + outer) * 0.5),
        0.3 + Math.random() * 0.18
      ),
      new THREE.Vector3(Math.cos(angle) * outer, Math.sin(angle) * outer, 0.08)
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(10));
    group.add(new THREE.Line(geometry, filamentMaterials[index % 2]));
  }

  const coreLight = new THREE.PointLight(0xd52b3f, 12, 12, 2);
  coreLight.position.set(0, 0, 2.2);
  group.add(coreLight);

  group.userData.irisMaterial = irisMaterial;
  return group;
}

function createParticles(isCompact) {
  const count = isCompact ? 650 : 1500;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const violet = new THREE.Color(0x7a1018);
  const magenta = new THREE.Color(0xd52b3f);
  const cyan = new THREE.Color(0xffb36b);

  for (let index = 0; index < count; index += 1) {
    const positionIndex = index * 3;
    positions[positionIndex] = (Math.random() - 0.5) * 28;
    positions[positionIndex + 1] = (Math.random() - 0.5) * 18;
    positions[positionIndex + 2] = (Math.random() - 0.5) * 18 - 2;

    const color = Math.random() > 0.97 ? cyan : Math.random() > 0.55 ? magenta : violet;
    colors[positionIndex] = color.r;
    colors[positionIndex + 1] = color.g;
    colors[positionIndex + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: isCompact ? 0.045 : 0.032,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })
  );
}

function createShards() {
  const group = new THREE.Group();
  const geometry = new THREE.TetrahedronGeometry(0.18, 0);
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0xded6e4,
      roughness: 0.78,
      metalness: 0.05
    }),
    new THREE.MeshStandardMaterial({
      color: 0x2d1014,
      emissive: 0x741520,
      emissiveIntensity: 0.45,
      roughness: 0.5
    })
  ];

  for (let index = 0; index < 30; index += 1) {
    const shard = new THREE.Mesh(geometry, materials[index % 4 === 0 ? 1 : 0]);
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.8 + Math.random() * 3.6;
    shard.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.72,
      (Math.random() - 0.5) * 4
    );
    shard.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    const scale = 0.35 + Math.random() * 1.8;
    shard.scale.set(scale * 0.7, scale, scale * 0.35);
    shard.userData.base = shard.position.clone();
    shard.userData.phase = Math.random() * Math.PI * 2;
    group.add(shard);
  }

  return group;
}

function createAstronaut() {
  const group = new THREE.Group();
  const suitMaterial = new THREE.MeshStandardMaterial({
    color: 0xe4dfe8,
    roughness: 0.72,
    metalness: 0.08
  });
  const darkMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x080203,
    metalness: 0.65,
    roughness: 0.12,
    clearcoat: 1
  });

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.34, 0.72, 14),
    suitMaterial
  );
  group.add(torso);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.31, 24, 24), suitMaterial);
  helmet.position.y = 0.62;
  group.add(helmet);

  const visor = new THREE.Mesh(
    new THREE.SphereGeometry(0.245, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.62),
    darkMaterial
  );
  visor.position.set(0, 0.64, 0.15);
  visor.rotation.x = -0.18;
  group.add(visor);

  const backpack = new THREE.Mesh(
    new THREE.BoxGeometry(0.48, 0.55, 0.2),
    suitMaterial
  );
  backpack.position.set(0, 0.08, -0.28);
  group.add(backpack);

  const limbGeometry = new THREE.CylinderGeometry(0.065, 0.075, 0.5, 10);
  const leftArm = new THREE.Mesh(limbGeometry, suitMaterial);
  leftArm.position.set(-0.35, 0.12, 0.08);
  leftArm.rotation.z = -0.9;
  group.add(leftArm);

  const rightArm = leftArm.clone();
  rightArm.position.x = 0.35;
  rightArm.rotation.z = 0.9;
  group.add(rightArm);

  const leftLeg = new THREE.Mesh(limbGeometry, suitMaterial);
  leftLeg.position.set(-0.16, -0.58, 0);
  leftLeg.rotation.z = 0.08;
  group.add(leftLeg);

  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.16;
  rightLeg.rotation.z = -0.08;
  group.add(rightLeg);

  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.13, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0xffd4d8,
      emissive: 0xd52b3f,
      emissiveIntensity: 5,
      roughness: 0.1
    })
  );
  orb.position.set(0, 0.05, 0.43);
  group.add(orb);

  const orbLight = new THREE.PointLight(0xd52b3f, 7, 4, 2);
  orbLight.position.copy(orb.position);
  group.add(orbLight);

  group.scale.setScalar(0.95);
  return group;
}

function createSignalKnot() {
  const geometry = new THREE.TorusKnotGeometry(1.1, 0.28, 180, 20, 2, 5);
  const material = new THREE.MeshBasicMaterial({
    color: 0x7a1018,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending
  });
  return new THREE.Mesh(geometry, material);
}

function getScenePosition(sections) {
  const center = window.scrollY + window.innerHeight * 0.5;

  for (let index = 0; index < sections.length - 1; index += 1) {
    const currentCenter = sections[index].offsetTop + sections[index].offsetHeight * 0.5;
    const nextCenter = sections[index + 1].offsetTop + sections[index + 1].offsetHeight * 0.5;

    if (center <= nextCenter) {
      const local = THREE.MathUtils.clamp(
        (center - currentCenter) / Math.max(1, nextCenter - currentCenter),
        0,
        1
      );
      return { index, local };
    }
  }

  return { index: sections.length - 2, local: 1 };
}

function interpolateState(states, position) {
  const from = states[position.index];
  const to = states[Math.min(position.index + 1, states.length - 1)];
  const t = THREE.MathUtils.smootherstep(position.local, 0, 1);

  return {
    eyePosition: from.eyePosition.clone().lerp(to.eyePosition, t),
    eyeScale: THREE.MathUtils.lerp(from.eyeScale, to.eyeScale, t),
    eyeRotation: THREE.MathUtils.lerp(from.eyeRotation, to.eyeRotation, t),
    shardSpread: THREE.MathUtils.lerp(from.shardSpread, to.shardSpread, t),
    astronautPosition: from.astronautPosition.clone().lerp(to.astronautPosition, t),
    astronautScale: THREE.MathUtils.lerp(from.astronautScale, to.astronautScale, t),
    knotPosition: from.knotPosition.clone().lerp(to.knotPosition, t),
    knotOpacity: THREE.MathUtils.lerp(from.knotOpacity, to.knotOpacity, t)
  };
}

function initializeThreeScene() {
  const compact = window.innerWidth < 700 || coarsePointer.matches;
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !compact,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.2 : 1.65));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080203, 0.045);

  const camera = new THREE.PerspectiveCamera(
    compact ? 55 : 48,
    window.innerWidth / window.innerHeight,
    0.1,
    80
  );
  camera.position.set(0, 0, 8.5);

  scene.add(new THREE.AmbientLight(0x641d24, 0.72));

  const violetLight = new THREE.PointLight(0x7a1018, 12, 24, 2);
  violetLight.position.set(-5, 4, 5);
  scene.add(violetLight);

  const magentaLight = new THREE.PointLight(0xd52b3f, 9, 20, 2);
  magentaLight.position.set(5, -2, 4);
  scene.add(magentaLight);

  const cyanLight = new THREE.PointLight(0xffb36b, 2, 12, 2);
  cyanLight.position.set(2, 4, -2);
  scene.add(cyanLight);

  const eye = createIris();
  const particles = createParticles(compact);
  const shards = createShards();
  const astronaut = createAstronaut();
  const knot = createSignalKnot();

  scene.add(eye, particles, shards, astronaut, knot);

  const sections = [...document.querySelectorAll(".scene-section")];
  const states = [
    {
      eyePosition: new THREE.Vector3(compact ? 0.5 : 2.5, 0.7, 0),
      eyeScale: compact ? 0.8 : 1.12,
      eyeRotation: 0,
      shardSpread: 0.18,
      astronautPosition: new THREE.Vector3(7, -4, -6),
      astronautScale: 0.4,
      knotPosition: new THREE.Vector3(-8, 0, -6),
      knotOpacity: 0
    },
    {
      eyePosition: new THREE.Vector3(-3.6, 1.1, -2.8),
      eyeScale: 0.58,
      eyeRotation: -0.42,
      shardSpread: 1.15,
      astronautPosition: new THREE.Vector3(6, -3, -5),
      astronautScale: 0.55,
      knotPosition: new THREE.Vector3(6, -1, -5),
      knotOpacity: 0.05
    },
    {
      eyePosition: new THREE.Vector3(4.3, -1.3, -4),
      eyeScale: 0.35,
      eyeRotation: 0.55,
      shardSpread: 0.52,
      astronautPosition: new THREE.Vector3(5, -2.5, -4),
      astronautScale: 0.6,
      knotPosition: new THREE.Vector3(-3.3, 0.4, -1.4),
      knotOpacity: 0.58
    },
    {
      eyePosition: new THREE.Vector3(-4.5, 1.2, -5),
      eyeScale: 0.42,
      eyeRotation: -0.65,
      shardSpread: 0.2,
      astronautPosition: new THREE.Vector3(compact ? 0 : -2.4, 0, -0.4),
      astronautScale: compact ? 0.85 : 1.25,
      knotPosition: new THREE.Vector3(5, 0, -5),
      knotOpacity: 0.08
    },
    {
      eyePosition: new THREE.Vector3(0, 0, -1),
      eyeScale: compact ? 1.15 : 1.5,
      eyeRotation: 0.2,
      shardSpread: 0.08,
      astronautPosition: new THREE.Vector3(6, -3, -6),
      astronautScale: 0.4,
      knotPosition: new THREE.Vector3(-6, 0, -6),
      knotOpacity: 0
    }
  ];

  const pointer = new THREE.Vector2(0, 0);
  const smoothedPointer = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  let isPageVisible = true;
  let reducedFrameRequested = false;

  function updatePointer(event) {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    if (reducedMotion.matches) requestReducedFrame();
  }

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = window.innerWidth < 700 ? 55 : 48;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.2 : 1.65)
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (reducedMotion.matches) requestReducedFrame();
  }

  function renderScene(delta = 0) {
    const elapsed = clock.elapsedTime;
    const position = getScenePosition(sections);
    const target = interpolateState(states, position);

    eye.position.lerp(target.eyePosition, reducedMotion.matches ? 1 : 0.055);
    const currentScale = THREE.MathUtils.lerp(
      eye.scale.x,
      target.eyeScale,
      reducedMotion.matches ? 1 : 0.055
    );
    eye.scale.setScalar(currentScale);
    eye.rotation.z = THREE.MathUtils.lerp(
      eye.rotation.z,
      target.eyeRotation + (reducedMotion.matches ? 0 : elapsed * 0.015),
      reducedMotion.matches ? 1 : 0.04
    );
    eye.userData.irisMaterial.uniforms.uTime.value = reducedMotion.matches ? 0 : elapsed;

    shards.children.forEach((shard, index) => {
      const base = shard.userData.base;
      const spread = target.shardSpread;
      const float = reducedMotion.matches
        ? 0
        : Math.sin(elapsed * 0.42 + shard.userData.phase) * 0.13;
      shard.position.x = THREE.MathUtils.lerp(shard.position.x, base.x * spread, 0.045);
      shard.position.y = THREE.MathUtils.lerp(shard.position.y, base.y * spread + float, 0.045);
      shard.position.z = THREE.MathUtils.lerp(shard.position.z, base.z * spread, 0.045);
      if (!reducedMotion.matches) {
        shard.rotation.x += delta * (0.05 + (index % 4) * 0.012);
        shard.rotation.y += delta * 0.06;
      }
    });

    astronaut.position.lerp(target.astronautPosition, reducedMotion.matches ? 1 : 0.04);
    const astronautScale = THREE.MathUtils.lerp(
      astronaut.scale.x,
      target.astronautScale,
      reducedMotion.matches ? 1 : 0.045
    );
    astronaut.scale.setScalar(astronautScale);
    if (!reducedMotion.matches) {
      astronaut.position.y += Math.sin(elapsed * 0.65) * 0.0018;
      astronaut.rotation.y = Math.sin(elapsed * 0.32) * 0.18;
    }

    knot.position.lerp(target.knotPosition, reducedMotion.matches ? 1 : 0.05);
    knot.material.opacity = THREE.MathUtils.lerp(
      knot.material.opacity,
      target.knotOpacity,
      reducedMotion.matches ? 1 : 0.05
    );
    if (!reducedMotion.matches) {
      knot.rotation.x += delta * 0.08;
      knot.rotation.y += delta * 0.11;
      particles.rotation.y += delta * 0.006;
      particles.position.y = Math.sin(elapsed * 0.08) * 0.4;
    }

    smoothedPointer.lerp(pointer, reducedMotion.matches ? 1 : 0.035);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      smoothedPointer.x * (compact ? 0.16 : 0.32),
      reducedMotion.matches ? 1 : 0.05
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      smoothedPointer.y * (compact ? 0.1 : 0.22),
      reducedMotion.matches ? 1 : 0.05
    );
    camera.lookAt(0, 0, -0.5);

    renderer.render(scene, camera);
  }

  function animate() {
    if (!isPageVisible || reducedMotion.matches) return;
    const delta = Math.min(clock.getDelta(), 0.05);
    renderScene(delta);
    window.requestAnimationFrame(animate);
  }

  function requestReducedFrame() {
    if (!reducedMotion.matches || reducedFrameRequested) return;
    reducedFrameRequested = true;
    window.requestAnimationFrame(() => {
      reducedFrameRequested = false;
      renderScene(0);
    });
  }

  function handleMotionPreference() {
    if (reducedMotion.matches) {
      requestReducedFrame();
    } else {
      clock.getDelta();
      window.requestAnimationFrame(animate);
    }
  }

  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", requestReducedFrame, { passive: true });
  reducedMotion.addEventListener("change", handleMotionPreference);
  document.addEventListener("visibilitychange", () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) handleMotionPreference();
  });

  renderScene(0);
  if (!reducedMotion.matches) window.requestAnimationFrame(animate);
}

function completeLoader() {
  window.clearInterval(loaderTimer);
  loaderProgress = 100;
  loaderValue.textContent = "100%";
  window.setTimeout(() => {
    document.body.classList.add("loaded");
    loader.setAttribute("aria-hidden", "true");
  }, 220);
}

async function startThreeExperience() {
  try {
    THREE = await loadThreeRuntime();
    initializeThreeScene();
    document.documentElement.classList.add("webgl-ready");
  } catch (error) {
    console.warn("WebGL scene unavailable; using the visual fallback.", error);
    document.documentElement.classList.add("no-webgl", "webgl-ready");
    statusLabel.lastChild.textContent = " Modo visual compatível";
  }
}

function startExperience() {
  initializeInterface();

  const revealInterface = () => {
    completeLoader();

    // Let the loader finish fading before the heavier 3D import and scene
    // construction begin. The portfolio remains fully usable without WebGL.
    window.setTimeout(() => {
      void startThreeExperience();
    }, 700);
  };

  if (document.readyState === "complete") {
    revealInterface();
  } else {
    window.addEventListener("load", revealInterface, { once: true });
  }
}

startExperience();
