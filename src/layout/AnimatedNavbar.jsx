import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, stagger } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, OrbitControls } from '@react-three/drei';

// 3D Cube Component (unchanged)
const Cube = ({ isHovered }) => {
    const meshRef = useRef();

    useFrame(() => {
        if (isHovered) {
            meshRef.current.rotation.x += 0.02;
            meshRef.current.rotation.y += 0.03;
        } else {
            meshRef.current.rotation.x += 0.005;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[3, 3, 3]} />
            <MeshWobbleMaterial
                color="#4f46e5"
                factor={isHovered ? 1 : 0.5}
                speed={isHovered ? 2 : 1}
                wireframe={isHovered}
            />
        </mesh>
    );
};

const AnimatedNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    const underlineRef = useRef(null);
    const menuItemsRef = useRef([]);

    const navItems = [
        { name: 'Home', path: '/', color: '#4f46e5' },
        { name: 'Shop', path: '/shop', color: '#10b981' },
        { name: 'Services', path: '/services', color: '#f59e0b' },
        { name: 'About', path: '/about', color: '#ef4444' },
        { name: 'Contact', path: '/contact', color: '#8b5cf6' }
    ];

    const activeIndex = navItems.findIndex(item => item.path === location.pathname);
    const logoText = "MISFIT.";

    // Update underline position
    useEffect(() => {
        if (window.innerWidth > 1024 && underlineRef.current && menuItemsRef.current[activeIndex]) {
            const activeItem = menuItemsRef.current[activeIndex];
            underlineRef.current.style.left = `${activeItem.offsetLeft}px`;
            underlineRef.current.style.width = `${activeItem.offsetWidth}px`;
            underlineRef.current.style.backgroundColor = navItems[activeIndex].color;
        }
    }, [activeIndex, location.pathname]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm"
        >
            <div className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo with 3D Cube and animated text */}
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
                            to="/"
                            className="text-2xl font-bold tracking-tight text-gray-900 hover:text-indigo-600 transition-colors"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1,
                                            delayChildren: 0.3
                                        }
                                    }
                                }}
                                className="flex"
                            >
                                {logoText.split("").map((char, i) => (
                                    <motion.span
                                        key={i}
                                        variants={{
                                            hidden: {
                                                y: -20,
                                                opacity: 0,
                                                rotate: -10
                                            },
                                            visible: {
                                                y: 0,
                                                opacity: 1,
                                                rotate: 0,
                                                transition: {
                                                    type: "spring",
                                                    damping: 12,
                                                    stiffness: 200
                                                }
                                            }
                                        }}
                                        whileHover={{
                                            y: -5,
                                            rotate: [0, 10, -10, 0],
                                            transition: { duration: 0.5 }
                                        }}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </motion.div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex relative">
                        <div className="flex space-x-6">
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.path}
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{
                                        duration: 1,
                                        delay: 0.4 + index * 0.2,
                                        ease: [0.34, 1.56, 0.64, 1]
                                    }}
                                >
                                    <Link
                                        ref={el => menuItemsRef.current[index] = el}
                                        to={item.path}
                                        className={`relative px-3 py-2 text-gray-700 hover:text-[${item.color}] transition-colors font-medium
                      ${location.pathname === item.path ? `text-[${item.color}]` : ''}`}
                                        onMouseEnter={() => {
                                            if (underlineRef.current) {
                                                underlineRef.current.style.left = `${menuItemsRef.current[index].offsetLeft}px`;
                                                underlineRef.current.style.width = `${menuItemsRef.current[index].offsetWidth}px`;
                                                underlineRef.current.style.backgroundColor = item.color;
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (underlineRef.current && activeIndex >= 0) {
                                                const activeItem = menuItemsRef.current[activeIndex];
                                                underlineRef.current.style.left = `${activeItem.offsetLeft}px`;
                                                underlineRef.current.style.width = `${activeItem.offsetWidth}px`;
                                                underlineRef.current.style.backgroundColor = navItems[activeIndex].color;
                                            }
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            ref={underlineRef}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                                duration: 1,
                                delay: 0.8,
                                ease: [0.12, 0, 0.39, 0]
                            }}
                            className="absolute bottom-0 h-0.5 rounded-full"
                            style={{ backgroundColor: navItems[activeIndex]?.color || '#4f46e5' }}
                        />
                    </nav>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="lg:hidden focus:outline-none p-2 group"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <motion.span
                                className="absolute block w-6 h-0.5 bg-gray-900"
                                animate={isMenuOpen ? {
                                    rotate: 45,
                                    y: 0,
                                    opacity: 1
                                } : {
                                    rotate: 0,
                                    y: -8,
                                    opacity: 1
                                }}
                            />
                            <motion.span
                                className="absolute block w-6 h-0.5 bg-gray-900"
                                animate={isMenuOpen ? {
                                    opacity: 0
                                } : {
                                    opacity: 1
                                }}
                            />
                            <motion.span
                                className="absolute block w-6 h-0.5 bg-gray-900"
                                animate={isMenuOpen ? {
                                    rotate: -45,
                                    y: 0,
                                    opacity: 1
                                } : {
                                    rotate: 0,
                                    y: 8,
                                    opacity: 1
                                }}
                            />
                        </div>
                    </motion.button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:hidden fixed top-0 left-0 w-full h-screen bg-white/95 backdrop-blur-sm z-40 pt-20 px-6"
                        >
                            <div className="h-full flex flex-col justify-center space-y-6">
                                {navItems.map((item, index) => (
                                    <motion.div
                                        key={item.path}
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.1 + index * 0.1,
                                            ease: [0.34, 1.56, 0.64, 1]
                                        }}
                                    >
                                        <Link
                                            to={item.path}
                                            className={`text-4xl md:text-5xl font-bold py-4 block transition-all duration-300 hover:pl-6
                        ${location.pathname === item.path ? `text-[${item.color}]` : 'text-gray-800'}`}
                                            onClick={() => setIsMenuOpen(false)}
                                            style={{ color: location.pathname === item.path ? item.color : '' }}
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default AnimatedNavbar;