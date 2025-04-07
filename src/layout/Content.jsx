import React, { useEffect, useRef } from "react";
import gsap from "gsap";

function Content({ activeData }) {
    const buttonRef = useRef(null);
    const headingRef = useRef(null);
    const subHeadingRef = useRef(null);
    const textRef = useRef(null);
    const textElements = useRef([]);

    useEffect(() => {
        // Button animation
        if (buttonRef.current) {
            gsap.to(buttonRef.current, {
                color: activeData.buttonColor.text,
                backgroundColor: activeData.buttonColor.background,
                duration: 0.5,
                ease: "power3.inOut",
            });
        }

        // Text color animations
        const textNodes = [headingRef.current, subHeadingRef.current, textRef.current];
        textNodes.forEach(el => {
            if (el) {
                gsap.to(el, {
                    color: activeData.headingColor,
                    duration: 0.5,
                    ease: "power3.inOut",
                });
            }
        });

        // Entrance animation
        gsap.from(textElements.current, {
            y: 100,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15
        });

    }, [activeData]);

    // Store all animatable elements
    useEffect(() => {
        textElements.current = [
            headingRef.current,
            subHeadingRef.current,
            textRef.current,
            buttonRef.current
        ].filter(Boolean);
    }, []);

    return (
        <div className="select-none w-full h-2/5 flex justify-center items-center lg:w-1/2 lg:h-full lg:justify-end">
            <div className="flex justify-start flex-col items-start w-2/3">
                {/* heading */}
                <h1 className="text-left text-5xl font-bold mb-1 w-full relative p-1 overflow-hidden md:text-[7vw] md:mb-2">
                    <span ref={headingRef} className=" block">{activeData.heading}</span>
                </h1>

                {/* sub heading */}
                <h6 className="text-left text-2xl font-regular mb-6 w-full p-1 overflow-hidden md:text-4xl">
                    <span ref={subHeadingRef} className="block">{activeData.subHeading}</span>
                </h6>

                {/* text */}
                <div ref={textRef} className="w-full text-xs font-medium text-left mb-8 p-1 overflow-hidden md:text-base md:mb-12">
                    {activeData.text}
                </div>

                {/* button */}
                <div className="relative overflow-hidden p-4">
                    <button
                        ref={buttonRef}
                        className="cursor-pointer rounded-2xl outline-none px-8 py-2 font-medium bg-[#4A6E6A] md:px-10 md:py-4"
                    >
                        Shop Now
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Content;