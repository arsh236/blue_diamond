// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initLoader();
    initThreeJS();
    initAnimations();
    initCursor();
});

// --- Smooth Scrolling (Lenis) ---
function initLenis() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
}

// --- Loader ---
function initLoader() {
    const tl = gsap.timeline();

    tl.to('.progress-bar', {
        width: '100%',
        duration: 2,
        ease: 'power4.inOut'
    });

    tl.to('.loader', {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut',
        delay: 0.5,
        onComplete: () => {
            document.body.classList.remove('loading');
            document.getElementById('loader').style.display = 'none';
            playHeroEntrance();
        }
    });
}

// --- Three.js Background Background ---
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Geometry - A stylized diamond shape using Icosahedron
    const geometry = new THREE.IcosahedronGeometry(10, 0);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00D4FF,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        shininess: 100
    });
    const crystal = new THREE.Mesh(geometry, material);
    scene.add(crystal);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00D4FF,
        transparent: true,
        opacity: 0.5
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00D4FF, 1);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);

    camera.position.z = 50;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        crystal.rotation.y += 0.005;
        crystal.rotation.z += 0.002;
        particlesMesh.rotation.y -= 0.0005;
        
        // Float effect
        crystal.position.y = Math.sin(Date.now() * 0.001) * 2;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Interaction Move
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth) - 0.5;
        const mouseY = (e.clientY / window.innerHeight) - 0.5;
        gsap.to(camera.position, {
            x: mouseX * 20,
            y: -mouseY * 20,
            duration: 2,
            ease: 'power2.out'
        });
    });
}

// --- GSAP Animations ---
function playHeroEntrance() {
    gsap.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.line', {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.3
    });

    gsap.from('.hero-description', {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.8
    });

    gsap.from('.nav', {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 1
    });
}

function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Nav Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Scrollytelling Step Updates
    const steps = document.querySelectorAll('.step');
    const visuals = document.querySelectorAll('.visual-item');

    steps.forEach((step, index) => {
        ScrollTrigger.create({
            trigger: step,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => updateStep(index),
            onEnterBack: () => updateStep(index)
        });
    });

    function updateStep(index) {
        steps.forEach(s => s.classList.remove('active'));
        visuals.forEach(v => v.classList.remove('active'));

        steps[index].classList.add('active');
        visuals[index].classList.add('active');
    }

    // Reveal Text on Scroll
    gsap.utils.toArray('.section-title h2, .sport-card').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
}

// --- Custom Cursor ---
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(follower, {
            x: e.clientX - 16,
            y: e.clientY - 16,
            duration: 0.3
        });
    });

    // Hover scales
    document.querySelectorAll('a, button, .sport-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.transform = 'scale(0.5)';
            follower.style.backgroundColor = 'var(--accent)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.backgroundColor = 'transparent';
        });
    });
}
