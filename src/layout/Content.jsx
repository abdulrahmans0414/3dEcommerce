import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const Content = ({ activeData }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

    // Text animation variants
    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.03,
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        })
    };

    const wordVariants = {
        hidden: {},
        visible: {}
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                when: "beforeChildren"
            }
        }
    };

    const buttonVariants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        },
        hover: {
            scale: 1.05,
            boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
        },
        tap: {
            scale: 0.95
        }
    };

    // Handle scroll animations
    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        } else {
            controls.start("hidden");
        }
    }, [isInView, controls]);

    // Split text into words and letters for animation
    const splitText = (text) => {
        return text.split(" ").map((word, wordIndex) => (
            <motion.span
                key={`word-${wordIndex}`}
                className="inline-block mr-2"
                variants={wordVariants}
                initial="hidden"
                animate={controls}
            >
                {word.split("").map((letter, letterIndex) => (
                    <motion.span
                        key={`letter-${wordIndex}-${letterIndex}`}
                        className="inline-block"
                        variants={letterVariants}
                        custom={letterIndex}
                        whileHover={{ y: -5 }}
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.span>
        ));
    };

    return (
        <motion.div
            ref={ref}
            className="select-none w-full h-2/5 flex justify-center items-center lg:w-1/2 lg:h-full lg:justify-end"
            initial="hidden"
            animate={controls}
            variants={containerVariants}
        >
            <div className="flex justify-start flex-col items-start w-2/3">
                {/* Animated Heading */}
                <motion.h1
                    className="text-left text-5xl font-bold mb-1 w-full p-1 overflow-hidden md:text-[7vw] md:mb-2"
                    style={{ color: activeData.headingColor }}
                    variants={containerVariants}
                >
                    {splitText(activeData.heading)}
                </motion.h1>

                {/* Animated Subheading */}
                <motion.h6
                    className="text-left text-2xl font-regular mb-6 w-full p-1 overflow-hidden md:text-4xl"
                    style={{ color: activeData.headingColor }}
                    variants={containerVariants}
                >
                    {splitText(activeData.subHeading)}
                </motion.h6>

                {/* Animated Paragraph */}
                <motion.div
                    className="w-full text-xs font-medium text-left mb-8 p-1 overflow-hidden md:text-base md:mb-12"
                    style={{ color: activeData.headingColor }}
                    variants={containerVariants}
                >
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            visible: {
                                opacity: 1,
                                x: 0,
                                transition: {
                                    staggerChildren: 0.02,
                                    delayChildren: 0.2
                                }
                            }
                        }}
                    >
                        {activeData.text.split("").map((char, index) => (
                            <motion.span
                                key={`char-${index}`}
                                className="inline-block"
                                variants={letterVariants}
                                custom={index}
                                whileHover={{
                                    y: -3,
                                    color: activeData.buttonColor.background
                                }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.p>
                </motion.div>

                {/* Animated Button */}
                <motion.div
                    className="relative overflow-hidden p-4"
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                delay: 0.5,
                                type: "spring"
                            }
                        }
                    }}
                >
                    <motion.button
                        className="cursor-pointer rounded-2xl outline-none px-8 py-2 font-medium md:px-10 md:py-4 relative overflow-hidden"
                        style={{
                            color: activeData.buttonColor.text,
                            backgroundColor: activeData.buttonColor.background
                        }}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={activeData.buttonColor.background}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="relative z-10"
                            >
                                Shop Now
                            </motion.span>
                        </AnimatePresence>
                        <motion.span
                            className="absolute inset-0 bg-black/10 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Content;