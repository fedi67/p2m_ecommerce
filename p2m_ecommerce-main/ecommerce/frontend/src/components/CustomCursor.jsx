import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [trailingPosition, setTrailingPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                window.getComputedStyle(target).cursor === 'pointer';

            setIsHovering(isClickable);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, [isVisible]);

    useEffect(() => {
        let requestRef;
        const updateTrailing = () => {
            setTrailingPosition(prev => ({
                x: prev.x + (position.x - prev.x) * 0.30,
                y: prev.y + (position.y - prev.y) * 0.30,
            }));
            requestRef = requestAnimationFrame(updateTrailing);
        };
        requestRef = requestAnimationFrame(updateTrailing);
        return () => cancelAnimationFrame(requestRef);
    }, [position]);

    if (!isVisible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: isHovering ? '60px' : '20px',
                height: isHovering ? '60px' : '20px',
                backgroundColor: isHovering ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                border: '1.5px solid #c5a059',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 2147483647,
                transform: `translate(${trailingPosition.x - (isHovering ? 30 : 10)}px, ${trailingPosition.y - (isHovering ? 30 : 10)}px)`,
                transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div style={{
                width: '4px',
                height: '4px',
                backgroundColor: '#c5a059',
                borderRadius: '50%',
                opacity: isHovering ? 0 : 1,
                transition: 'opacity 0.2s ease'
            }} />
        </div>
    );
};

export default CustomCursor;
