import React from "react";
import SwatchWrapper from './swatchWrapper';

function Canvas({ activeData, swatchData, handleSwatchClick }) {
    return (
        <div
            id="container"
            className="w-full h-3/5 relative z-10 lg:w-1/2 lg:h-full"
        >
            <SwatchWrapper
                activeData={activeData}
                swatchData={swatchData}
                handleSwatchClick={handleSwatchClick}
            />
        </div>
    )
}

export default Canvas;
