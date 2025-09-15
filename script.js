console.clear();

/* SETUP */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1,
    5000
);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* CONTROLS */
const controlsWebGL = new THREE.OrbitControls(camera, renderer.domElement);

/* PARTICLES */
const tl = gsap.timeline({
    repeat: -1,
    yoyo: true
});

// Aguarde o DOM estar completamente carregado antes de acessar o <path>
document.addEventListener("DOMContentLoaded", () => {
    const path = document.querySelector("path");
    if (!path) {
        console.error("Elemento <path> não encontrado no DOM.");
        return;
    }

    const length = path.getTotalLength();
    const vertices = [];
    for (let i = 0; i < length; i += 0.1) {
        const point = path.getPointAtLength(i);
        const vector = new THREE.Vector3(point.x, -point.y, 0);
        vector.x += (Math.random() - 0.5) * 30;
        vector.y += (Math.random() - 0.5) * 30;
        vector.z += (Math.random() - 0.5) * 70;
        vertices.push(vector);

        // Cria uma animação para cada vetor
        tl.from(
            vector,
            {
                x: 600 / 2, // Centro X do coração
                y: -552 / 2, // Centro Y do coração
                z: 0, // Centro da cena
                ease: "power2.inOut",
                duration: gsap.utils.random(2, 5), // Duração aleatória
            },
            i * 0.002 // Delay baseado na distância ao longo do path
        );
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
    const material = new THREE.PointsMaterial({
        color: 0xee5282,
        blending: THREE.AdditiveBlending,
        size: 3,
    });
    const particles = new THREE.Points(geometry, material);

    // Ajusta a posição das partículas com base no viewBox do SVG
    particles.position.x -= 600 / 2;
    particles.position.y += 552 / 2;
    scene.add(particles);

    gsap.fromTo(
        scene.rotation,
        { y: -0.2 },
        {
            y: 0.2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
            duration: 3,
        }
    );

    /* RENDERING */
    function render() {
        requestAnimationFrame(render);
        // Atualiza a geometria com os vértices animados
        geometry.setFromPoints(vertices);
        renderer.render(scene, camera);
    }

    render();
});

/* EVENTS */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);