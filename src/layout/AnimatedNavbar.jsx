import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { useLocation, Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, OrbitControls } from '@react-three/drei';

// 3D Cube Component for R3F
const Cube = ({ isHovered }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (isHovered) {
            meshRef.current.rotation.x += 0.02;
            meshRef.current.rotation.y += 0.03;
        } else {
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef} >
            <boxGeometry args={[3, 3, 3]} />
            <MeshWobbleMaterial
                color="#4f46e5"
                factor={isHovered ? 1 : 0.5}
                speed={isHovered ? 2 : 1}
                //  wireframe={true}
                wireframe={isHovered}
            />
        </mesh>
    );
};

const AnimatedNavbar = () => {
    const navRef = useRef(null);
    const logoRef = useRef(null);
    const menuItemsRef = useRef([]);
    const underlineRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const mobileItemsRef = useRef([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    // Nav items with improved color scheme
    const navItems = [
        { name: 'Home', path: '/', color: '#4f46e5' },
        { name: 'Shop', path: '/shop', color: '#10b981' },
        { name: 'Services', path: '/services', color: '#f59e0b' },
        { name: 'About', path: '/about', color: '#ef4444' },
        { name: 'Contact', path: '/contact', color: '#8b5cf6' }
    ];

    // Set active index based on current route
    useEffect(() => {
        const index = navItems.findIndex(item => item.path === location.pathname);
        if (index !== -1) setActiveIndex(index);
    }, [location]);

    // Initialize animations
    useEffect(() => {
        const tl = gsap.timeline();

        // Prevent animations on page refresh
        if (sessionStorage.getItem('navbarInitialized')) {
            positionUnderline();
            return;
        }
        sessionStorage.setItem('navbarInitialized', 'true');

        // Background animation
        tl.from(navRef.current, {
            y: -80,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        // Logo animation
        tl.from(logoRef.current, {
            y: -30,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: 0.2
        }, '<0.2');

        // Menu items animation (staggered)
        tl.from(menuItemsRef.current, {
            y: -20,
            opacity: 0,
            duration: 1,
            stagger: 0.20,
            ease: 'back.out(1.7)',
            delay: 0.4
        }, '<0.1');

        // Underline animation
        tl.from(underlineRef.current, {
            scaleX: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)',
            delay: 0.8
        });

        return () => tl.kill();
    }, []);

    // Position underline based on active item
    const positionUnderline = () => {
        if (window.innerWidth <= 1024 || !underlineRef.current) return;

        const activeItem = menuItemsRef.current[activeIndex];
        if (!activeItem) return;

        gsap.to(underlineRef.current, {
            x: activeItem.offsetLeft,
            width: activeItem.offsetWidth,
            backgroundColor: navItems[activeIndex].color,
            duration: 0.6,
            ease: 'elastic.out(1, 0.5)'
        });
    };

    // Mobile menu toggle animation
    useEffect(() => {
        const mm = gsap.matchMedia();

        mm.add("(max-width: 1024px)", () => {
            // Create timelines but don't play them yet
            const openTl = gsap.timeline({ paused: true });
            const closeTl = gsap.timeline({ paused: true });

            // Open animation setup
            openTl
                .to(mobileMenuRef.current, {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power3.out',
                    onStart: () => {
                        document.body.style.overflow = 'hidden';
                        // Make sure items are visible before animating
                        gsap.set(mobileItemsRef.current, {
                            y: 30,
                            opacity: 0,
                            display: 'block'
                        });
                    }
                })
                .fromTo(mobileItemsRef.current,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'back.out(1.7)',
                        onStart: () => {
                            mobileItemsRef.current.forEach((item, idx) => {
                                if (item) {
                                    gsap.set(item, { color: navItems[idx].color });
                                }
                            });
                        }
                    },
                    0.2
                );

            // Close animation setup
            closeTl
                .to(mobileItemsRef.current, {
                    y: -30,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'power3.in'
                })
                .to(mobileMenuRef.current, {
                    x: '100%',
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power3.in',
                    onComplete: () => {
                        document.body.style.overflow = '';
                    }
                }, 0.1);

            // Play the appropriate timeline based on menu state
            if (isMenuOpen) {
                closeTl.progress(0).kill();
                openTl.play();
            } else {
                openTl.progress(0).kill();
                closeTl.play();
            }

            return () => {
                openTl.kill();
                closeTl.kill();
                mm.revert();
            };
        });
    }, [isMenuOpen, location.pathname]); // Added location.pathname to dependency array

    // Close menu on route change
    useEffect(() => {
        const handleRouteChange = () => {
            if (isMenuOpen) {
                const mm = gsap.matchMedia();

                mm.add("(max-width: 1024px)", () => {
                    gsap.to(mobileItemsRef.current, {
                        y: -30,
                        opacity: 0,
                        duration: 0.3,
                        stagger: 0.05,
                        ease: 'power3.in'
                    });

                    gsap.to(mobileMenuRef.current, {
                        x: '100%',
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power3.in',
                        onComplete: () => {
                            document.body.style.overflow = '';
                            setIsMenuOpen(false);
                        }
                    });

                    return () => mm.revert();
                });
            }
        };

        handleRouteChange();
    }, [location.pathname]);

    // Update underline position on route change
    useEffect(() => {
        const handleResize = () => positionUnderline();

        positionUnderline();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [activeIndex, location.pathname]);


    return (
        <header
            ref={navRef}
            className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm"
        >
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo with R3F 3D Cube */}
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-8 h-8"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <Canvas>
                                <ambientLight intensity={0.5} />
                                <pointLight position={[10, 10, 10]} />
                                <Cube isHovered={isHovered} />
                                <OrbitControls enableZoom={false} enablePan={false} />
                            </Canvas>
                        </div>
                        <Link
                            ref={logoRef}
                            to="/"
                            className="text-2xl font-bold tracking-tight text-gray-900 hover:text-indigo-600 transition-colors"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            MISFIT.
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex relative">
                        <div className="flex space-x-6">
                            {navItems.map((item, index) => (
                                <Link
                                    key={item.path}
                                    ref={el => menuItemsRef.current[index] = el}
                                    to={item.path}
                                    className={`relative px-3 py-2 text-gray-700 hover:text-[${item.color}] transition-colors font-medium
                                        ${location.pathname === item.path ? `text-[${item.color}]` : ''}`}
                                    onMouseEnter={() => setActiveIndex(index)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div
                            ref={underlineRef}
                            className="absolute bottom-0 left-0 h-0.5 rounded-full"
                            style={{ backgroundColor: navItems[activeIndex].color, width: '50px' }}
                        />
                    </nav>

                    {/* Mobile Menu Button - Improved */}
                    <button
                        className="lg:hidden focus:outline-none p-2 group"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <span className={`absolute block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-1/2 -translate-y-1/2' : 'top-1/3 -translate-y-1/2'}`}></span>
                            <span className={`absolute block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-1/2 -translate-y-1/2'}`}></span>
                            <span className={`absolute block w-6 h-0.5 bg-gray-900 transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-1/2 -translate-y-1/2' : 'top-2/3 -translate-y-1/2'}`}></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    ref={mobileMenuRef}
                    className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-sm z-40 transform translate-x-full opacity-0 pt-20 px-6"
                >
                    <div className="h-full flex flex-col justify-center space-y-6">
                        {navItems.map((item, index) => (
                            <Link
                                key={item.path}
                                ref={el => mobileItemsRef.current[index] = el}
                                to={item.path}
                                className={`text-4xl md:text-5xl font-bold py-4 transition-all duration-300 hover:pl-6
            ${location.pathname === item.path ? `text-[${item.color}]` : 'text-gray-800'}`}
                                onClick={() => setIsMenuOpen(false)}
                                style={{ color: location.pathname === item.path ? item.color : '' }}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>


            </div>
        </header>
    );
};

export default AnimatedNavbar;