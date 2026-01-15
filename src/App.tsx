import { useEffect, useRef, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 1
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

export default function App() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [videoEnded, setVideoEnded] = useState(false);
    const [showAraliaModal, setShowAraliaModal] = useState(false); // AGREGAR AQUÍ
    const [showMirelModal, setShowMirelModal] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const scrollRAF = useRef<number | null>(null);
    const lastUpdateTime = useRef<number>(0);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Detect system theme preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Set initial theme based on system preference
        setTheme(mediaQuery.matches ? 'dark' : 'light');

        // Listen for changes in system preference
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Load video immediately for hero section
    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        // Load video immediately since it's the hero section
        video.load();
        setVideoLoaded(true);
    }, []);

    // Optimized scroll handler with requestAnimationFrame throttling
    useEffect(() => {
        const video = videoRef.current;
        const container = containerRef.current;

        if (!video || !container) return;

        let ticking = false;

        const updateVideoTime = () => {
            const containerRect = container.getBoundingClientRect();
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;
            const windowHeight = window.innerHeight;

            const scrollProgress = Math.max(0, Math.min(1, -containerTop / (containerHeight - windowHeight)));

            if (video.duration && video.readyState >= 2) {
                // Start video at 1 second and end at duration
                const videoStartTime = 0;
                const videoPlayDuration = video.duration - videoStartTime;
                const targetTime = videoStartTime + (scrollProgress * videoPlayDuration);
                const currentTime = video.currentTime;

                // Reduce precision - only update if difference is > 0.2s
                if (Math.abs(currentTime - targetTime) > 0.2) {
                    const now = performance.now();
                    // Throttle updates to max 30fps (every ~33ms)
                    if (now - lastUpdateTime.current > 33) {
                        video.currentTime = targetTime;
                        lastUpdateTime.current = now;
                    }
                }

                if (scrollProgress >= 0.99) {
                    setVideoEnded(true);
                } else {
                    setVideoEnded(false);
                }
            }

            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                scrollRAF.current = requestAnimationFrame(updateVideoTime);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial call
        updateVideoTime();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollRAF.current) {
                cancelAnimationFrame(scrollRAF.current);
            }
        };
    }, [videoLoaded]);

    return (
        <>
            <div className="flex min-h-screen flex-col bg-[#FDFDFC] text-[#1b1b18] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]">
                {/* Navbar */}
                <header className="fixed top-0 z-50 w-full border-b border-[#19140035] bg-white/80 backdrop-blur-sm dark:border-[#3E3E3A] dark:bg-[#0a0a0a]/80">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                        <div className="flex items-center">
                            <img src="/images/logo-empresa.jpeg" alt="" className="mx-auto h-8 pr-1" />
                        </div>
                        {/*<div className="flex items-center gap-4">*/}
                        {/*    {auth.user ? (*/}
                        {/*        <Link*/}
                        {/*            href="/dashboard"*/}
                        {/*            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"*/}
                        {/*        >*/}
                        {/*            Dashboard*/}
                        {/*        </Link>*/}
                        {/*    ) : (*/}
                        {/*        <>*/}
                        {/*            <Link*/}
                        {/*                href="/login"*/}
                        {/*                className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"*/}
                        {/*            >*/}
                        {/*                Iniciar sesión*/}
                        {/*            </Link>*/}
                        {/*            <Link*/}
                        {/*                href="/register"*/}
                        {/*                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"*/}
                        {/*            >*/}
                        {/*                Registrarse*/}
                        {/*            </Link>*/}
                        {/*        </>*/}
                        {/*    )}*/}
                        {/*</div>*/}
                    </nav>
                </header>

                {/* Barra de Redes Sociales Fija */}
                <div className="fixed top-1/2 right-6 z-50 flex -translate-y-1/2 flex-col gap-3">
                    <a
                        href="https://www.instagram.com/psidex_sport/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 shadow-lg transition-all hover:scale-110 hover:shadow-xl"
                        aria-label="Instagram"
                    >
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>

                    <a
                        href="https://www.facebook.com/share/173CendMXs/?mibextid=wwXIfr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] shadow-lg transition-all hover:scale-110 hover:shadow-xl"
                        aria-label="Facebook"
                    >
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                    </a>

                    <a
                        href="https://wa.me/5219511899817?text=Hola,%20me%20gustaría%20información%20sobre%20sus%20servicios"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all hover:scale-110 hover:shadow-xl"
                        aria-label="WhatsApp"
                    >
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    </a>

                    <a
                        href="https://www.tiktok.com/@psidex_sport?_r=1&_t=ZS-92wNVt2wcum"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex h-12 w-12 items-center justify-center rounded-full bg-black shadow-lg transition-all hover:scale-110 hover:shadow-xl"
                        aria-label="TikTok"
                    >
                        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                    </a>
                </div>

                {/* Hero Section con Video Scroll */}
                <section ref={containerRef} className="relative h-[300vh]">
                    <div className="sticky top-0 h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a]">
                        <video
                            ref={videoRef}
                            className="absolute inset-0 h-full w-full object-cover"
                            playsInline
                            muted
                            preload="auto"
                            style={{ backgroundColor: theme === 'dark' ? '#0a0a0a' : 'white' }}
                        >
                            <source src="/videos/hero-video.mp4" type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                        </video>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full px-8 md:px-16 lg:px-24 xl:px-32">
                                <h1 className="text-6xl leading-none font-bold text-[#055c9d] sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem]">
                                    <span className="drop-shadow-2xl">PSIDEX</span>
                                </h1>
                                <h2 className="mt-2 text-lg font-semibold text-[#055c9d] drop-shadow-lg sm:mt-3 sm:text-base md:mt-4 md:text-xl lg:text-2xl xl:text-3xl">
                                    Mente imbatible, redimiento inigualable.
                                </h2>
                            </div>
                        </div>

                        {!videoEnded && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                                <svg className="h-8 w-8 text-[#055c9d] dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                            </div>
                        )}
                    </div>
                </section>

                {/* Sección de transición con descripción */}
                <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FDFDFC] px-6 py-20 lg:px-8 lg:py-32 dark:from-[#0a0a0a] dark:to-[#161615]">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-6 p-5">
                                <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                    Potencía el rendimiento de los deportistas a través del desarrollo de habilidades mentales y emocionales,
                                    ofreciendo servicios de entrenamiento mental personalizados y en grupo que promuevan la salud mental como base
                                    fundamental del éxito deportivo.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="order-1 lg:order-2">
                                    <img
                                        src="/images/doodle.png"
                                        alt="About our platform"
                                        className="aspect-square w-full overflow-hidden rounded-lg object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section with Images */}
                <section className="px-6 py-20 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">¿Por qué entrenar tu mente con nosotros?</h2>
                            <p className="text-lg text-[#706f6c] dark:text-[#A1A09A]">
                                Buscamos que la salud mental sea una pieza clave en el camino hacia el rendimiento exitoso.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {[
                                {
                                    title: 'Fortaleza mental que marca la diferencia',
                                    description:
                                        'Te ayudamos a desarrollar resiliencia, enfoque y control emocional, para que puedas rendir al máximo incluso bajo presión. Entrena tu mente igual que entrenas tu cuerpo.',
                                    image: '/images/ceni.jpeg',
                                },
                                {
                                    title: 'Experiencia en múltiples deportes',
                                    description:
                                        'Cada deporte tiene su propio ritmo, dinámica y desafíos. Hemos acompañado a atletas de diversas disciplinas que significa contar con estrategias adaptadas a tu entorno competitivo y una visión integral que potencia tu desempeño dentro y fuera del campo.',
                                    image: '/images/filial.jpeg',
                                },
                                {
                                    title: 'Bienestar integral y equilibrio personal',
                                    description:
                                        'El éxito deportivo no debe costarte tu salud mental. Sabemos detectar signos de estrés, agotamiento o frustración, y te guíamos hacia un equilibrio entre tu vida personal y tus metas competitivas.',
                                    image: '/images/panteras.jpeg',
                                },
                            ].map((feature, index) => (
                                <div
                                    key={index}
                                    className="group overflow-hidden rounded-lg border border-[#e3e3e0] bg-white p-6 shadow-sm transition-all hover:shadow-lg dark:border-[#3E3E3A] dark:bg-[#161615]"
                                >
                                    <img src={feature.image} alt={feature.title} className="mb-4 aspect-video w-full rounded-lg object-cover" />
                                    <h3 className="mb-2 text-xl font-medium">{feature.title}</h3>
                                    <p className="text-[#706f6c] dark:text-[#A1A09A]">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section id="about" className="bg-white px-6 py-20 lg:px-8 dark:bg-[#161615]">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 p-5 lg:grid-cols-2">
                            <div className="order-2 lg:order-1">
                                <h2 className="mb-6 text-3xl font-semibold lg:text-5xl">Sobre nosotros</h2>
                                <div className="space-y-4 text-[#706f6c] dark:text-[#A1A09A]">
                                    <p>
                                        Buscamos promover un espacio propicio para la comunión consciente de mente y cuerpo. Donde los sentidos,
                                        contrario a todas las creencias, en lugar de estar dormidos están más despiertos que nunca.
                                    </p>
                                    <p>
                                        Trabajamos de forma individual o grupal utilizando herramientas de hipnosis y programación neurolingüística
                                        para el manejo del estrés, autoestima y clarificación de metas. Brindamos ejercicios de visualización creativa
                                        y relajación para generar y enaltecer emociones de seguridad y confianza.
                                    </p>
                                    <p>
                                        A través de ejercicios de relajación se les ayudará a visualizar paso a paso su competencia y retos físicos y
                                        mentales para así desempeñarse con mayor confianza y enfoque al momento de su evento. Promovemos el desempeño
                                        físico y mental para optimizar desempeño y resultados.
                                    </p>
                                    <p>Conoce nuestra trayectoria:</p>
                                </div>

                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={() => setShowAraliaModal(true)}
                                        className="inline-block rounded-sm border border-[#055c9d] bg-[#055c9d] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#044a7d]"
                                    >
                                        Psic. Aralia
                                    </button>
                                    <button
                                        onClick={() => setShowMirelModal(true)}
                                        className="inline-block rounded-sm border border-[#055c9d] bg-[#055c9d] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#044a7d]"
                                    >
                                        Psic. Mirel
                                    </button>
                                </div>
                                <div className="mt-8 grid grid-cols-3 gap-6">
                                    <div>
                                        <div className="text-3xl font-semibold text-[#055c9d] dark:text-[#055c9d]">10+</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Equipos Activos</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-semibold text-[#055c9d] dark:text-[#055c9d]">20+</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Proyectos</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-semibold text-[#055c9d] dark:text-[#055c9d]">99.9%</div>
                                        <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Satisfacción</div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-1 lg:order-2">
                                <img
                                    src="/images/psics.jpeg"
                                    alt="About our platform"
                                    className="aspect-square w-full overflow-hidden rounded-lg object-cover shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="bg-white px-6 py-20 lg:px-8 dark:bg-[#161615]">
                    <div className="mx-auto max-w-7xl grid items-center gap-12 p-5 lg:grid-cols-2">
                        <div className="order-2 lg:order-1 w-full min-w-0">
                            <div className="w-full min-w-0">
                                <Carousel
                                    swipeable={true}
                                    draggable={true}
                                    showDots={true}
                                    infinite={true}
                                    autoPlay={true}
                                    autoPlaySpeed={2000}
                                    containerClass="carousel-container"
                                    itemClass="carousel-item-padding"
                                    responsive={responsive}>
                                    <div>
                                        <img
                                            src="/images/equipo_foto1_150126.jpeg"
                                            alt="Carrera del dia del psicologo"
                                            className="aspect-square h-auto w-full rounded-lg object-cover shadow-2xl"
                                        />
                                    </div>
                                    <div>
                                        <img
                                            src="/images/equipo_foto2_150126.jpeg"
                                            alt="Carrera del dia del psicologo"
                                            className="aspect-square h-auto w-full rounded-lg object-cover shadow-2xl"
                                        />
                                    </div>
                                </Carousel>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="mb-6 text-3xl font-semibold lg:text-5xl wrap-break-word">Carrera del día del psicólogo</h2>
                            <div className="space-y-4 text-[#706f6c] dark:text-[#A1A09A] max-w-full">
                                <p className="wrap-break-word">
                                    Los sueños se construyen cuando los padres creen, apoyan y caminan junto a sus hijos. En PSIDEX fortalecemos el deporte desde el entrenamiento mental y el respaldo familiar,
                                    formando atletas con carácter, confianza y visión.
                                </p>
                                <p className="wrap-break-word">PSIDEX presente en el programa Entretiempo: llevando el entrenamiento mental al centro del deporte y presentando la Carrera del Día del Psicólogo, un evento que impulsó el rendimiento, la conciencia y la fuerza mental dentro y fuera de la cancha.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="bg-[#FDFDFC] px-6 py-20 lg:px-8 dark:bg-[#0a0a0a]">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">¿Qué Ofrecemos?</h2>
                        </div>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Para Atletas */}
                            <div className="overflow-hidden rounded-lg border border-[#e3e3e0] bg-white shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="bg-[#055c9d] px-6 py-4">
                                    <h3 className="text-xl font-semibold text-white">Para Atletas</h3>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3 text-[#706f6c] dark:text-[#A1A09A]">
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Control de ansiedad y estrés competitivo</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Fortalecimiento de la autoestima y confianza</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Técnicas de concentración y visualización</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Rutinas mentales para la competencia y el entrenamiento</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Para Familias */}
                            <div className="overflow-hidden rounded-lg border border-[#e3e3e0] bg-white shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="bg-[#055c9d] px-6 py-4">
                                    <h3 className="text-xl font-semibold text-white">Para Familias</h3>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3 text-[#706f6c] dark:text-[#A1A09A]">
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Acompañamiento emocional durante la formación deportiva</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Estrategias para apoyar sin presionar</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Comunicación efectiva con hijos deportistas</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Para Entrenadores */}
                            <div className="overflow-hidden rounded-lg border border-[#e3e3e0] bg-white shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="bg-[#055c9d] px-6 py-4">
                                    <h3 className="text-xl font-semibold text-white">Para Entrenadores</h3>
                                </div>
                                <div className="p-6">
                                    <ul className="space-y-3 text-[#706f6c] dark:text-[#A1A09A]">
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Liderazgo emocionalmente inteligente</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Manejo de conflictos y motivación grupal</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="mt-1 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#055c9d]"></span>
                                            <span>Técnicas de retroalimentación positiva</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Modalidades Section */}
                        <div className="mt-16">
                            <div className="mb-8 text-center">
                                <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">Modalidades</h2>
                            </div>

                            <div className="overflow-hidden rounded-lg border border-[#e3e3e0] bg-white shadow-sm dark:border-[#3E3E3A] dark:bg-[#161615]">
                                <div className="grid gap-6 p-8 md:grid-cols-2">
                                    <div className="flex items-start">
                                        <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#055c9d]">
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-semibold">Sesiones individuales o grupales</h4>
                                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Adaptadas a tus necesidades específicas</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#055c9d]">
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-semibold">Talleres para clubes y academias</h4>
                                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Programas especializados para equipos</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#055c9d]">
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-semibold">Charlas educativas</h4>
                                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Para padres y entrenadores</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#055c9d]">
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="mb-1 font-semibold">Evaluación psicológica deportiva</h4>
                                            <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Personalizada y profesional</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-gradient-to-r from-[#055c9d] to-[#0577d4] px-6 py-20 lg:px-8 dark:from-[#044a7d] dark:to-[#055c9d]">
                    <div className="mx-auto max-w-4xl text-center text-white">
                        <h2 className="mb-4 text-3xl font-semibold lg:text-5xl">¿Listo para comenzar?</h2>
                        <p className="mb-8 text-lg opacity-90">Únete a este gran equipo de atletas, entrenadores y familias ganadoras</p>
                        <a
                            href="https://wa.me/5219511899817?text=Hola,%20me%20gustaría%20información%20sobre%20sus%20servicios"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block rounded-sm border-2 border-white bg-white px-8 py-3 text-sm leading-normal font-medium text-[#055c9d] hover:bg-transparent hover:text-white dark:border-white dark:bg-white dark:text-[#055c9d] dark:hover:bg-transparent dark:hover:text-white"
                        >
                            Comenzar
                        </a>
                    </div>

                    <div className="mt-12 pt-8 text-center text-sm text-white opacity-90 dark:text-white dark:opacity-90">
                        © 2025 Psidex. Todos los derechos reservados.
                    </div>
                </section>
            </div>

            {/* Modal Psic. Aralia */}
            {showAraliaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowAraliaModal(false)}>
                    <div
                        className="relative max-h-[90vh] w-auto max-w-4xl overflow-auto rounded-lg bg-white shadow-2xl dark:bg-[#161615]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowAraliaModal(false)}
                            className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white dark:bg-[#1b1b18]/90 dark:hover:bg-[#1b1b18]"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="p-6">
                            <img src="/images/aralia.png" alt="Psic. Aralia" className="h-auto w-full rounded-lg object-contain" />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Psic. Mirel */}
            {showMirelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setShowMirelModal(false)}>
                    <div
                        className="relative max-h-[90vh] w-auto max-w-4xl overflow-auto rounded-lg bg-white shadow-2xl dark:bg-[#161615]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowMirelModal(false)}
                            className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white dark:bg-[#1b1b18]/90 dark:hover:bg-[#1b1b18]"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="p-6">
                            <img src="/images/mirel.png" alt="Psic. Mirel" className="h-auto w-full rounded-lg object-contain" />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
