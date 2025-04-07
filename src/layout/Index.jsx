import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

import { data } from "../data";
import Content from "./Content";
import Canvas from "./Canvas";



function Banner() {

    const banner = useRef(null);
    const logoRef = useRef(null);
    const [activeData, setActiveData] = useState(data[0])

    // Memoize the click handler to prevent unnecessary re-renders
    const handleSwatchClick = useCallback((item) => {
        if (activeData.id !== item.id) {
            setActiveData(item);
        }
    }, [activeData.id]);


    useEffect(() => {
        // Create a GSAP timeline for coordinated animations
        const tl = gsap.timeline();

        tl.to(banner.current, {
            backgroundColor: activeData.background,
            ease: 'power3.inOut',
            duration: 0.8,
        })
            .to(logoRef.current, {
                color: activeData.headingColor,
                ease: 'power3.inOut',
                duration: 0.8,
            }, 0); // Start at same time as background animation

        // Cleanup function
        return () => {
            tl.kill(); // Kill the timeline on unmount
        };
    }, [activeData]);

    return (
        // banner contains
        <div
            ref={banner}
            className="w-screen h-screen relative "
        >

            {/* logo */}
            {/* <div
                ref={logoRef}
                className="absolute my-2 ml-6 text-left text-2xl font-bold tracking-widest md:ml-28 lg:ml-[12vw] lg:my-8">
                LOGO.
            </div> */}


            {/* content */}
            <div className="w-full h-full flex justify-between items-center flex-col lg:flex-row-reverse">

                <Canvas
                    activeData={activeData}
                    swatchData={data}
                    handleSwatchClick={handleSwatchClick}
                />

                <Content
                    activeData={activeData}
                />

            </div>

        </div>
    )
}

export default Banner;
