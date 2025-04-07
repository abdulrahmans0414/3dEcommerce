import React, { useState, useRef } from "react";
import gsap from "gsap";

import { data } from "../data";
import Content from "./Content";
import Canvas from "./Canvas";

function Banner() {

    const banner = useRef(null);
    const [activeData, setActiveData] = useState(data[0])

    return (
        // banner contains
        <div
            ref={banner}
            className="w-screen h-screen relative"
        >

            {/* logo */}
            <div className="logo absolute my-2 ml-6 text-left text-2xl font-bold tracking-widest md:ml-28 lg:ml-[12vw] lg:my-8">
                LOGO.
            </div>

            {/* content */}
            <div className="w-full h-full flex justify-between items-center flex-col lg:flex-row-reverse">

                <Canvas
                    activeData={activeData}
                    swatchData={data}
                />

                <Content
                    activeData={activeData}
                />

            </div>

        </div>
    )
}

export default Banner;
