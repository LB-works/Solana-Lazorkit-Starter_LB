"use client";

import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface ScrollIndicatorProps {
    direction: "horizontal" | "vertical";
    containerRef: React.RefObject<HTMLDivElement>;
}

export function ScrollIndicator({ direction, containerRef }: ScrollIndicatorProps) {
    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const checkScroll = () => {
            if (direction === "horizontal") {
                const { scrollLeft, scrollWidth, clientWidth } = container;
                setShowLeft(scrollLeft > 10);
                setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
            } else {
                const { scrollTop, scrollHeight, clientHeight } = container;
                setShowUp(scrollTop > 10);
                setShowDown(scrollTop < scrollHeight - clientHeight - 10);
            }
        };

        checkScroll();
        container.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);

        return () => {
            container.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, [direction, containerRef]);

    if (direction === "horizontal") {
        return (
            <>
                {showLeft && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="bg-gradient-to-r from-white via-white to-transparent w-12 h-full flex items-center">
                            <ChevronLeft size={16} className="text-gray-400 animate-pulse" />
                        </div>
                    </div>
                )}
                {showRight && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                        <div className="bg-gradient-to-l from-white via-white to-transparent w-12 h-full flex items-center justify-end">
                            <ChevronRight size={16} className="text-gray-400 animate-pulse" />
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <>
            {showUp && (
                <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
                    <div className="bg-gradient-to-b from-white via-white/80 to-transparent h-8 flex justify-center pt-1">
                        <ChevronUp size={14} className="text-gray-400 animate-pulse" />
                    </div>
                </div>
            )}
            {showDown && (
                <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
                    <div className="bg-gradient-to-t from-white via-white/80 to-transparent h-8 flex justify-center items-end pb-1">
                        <ChevronDown size={14} className="text-gray-400 animate-pulse" />
                    </div>
                </div>
            )}
        </>
    );
}
