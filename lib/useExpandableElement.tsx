import { useState, useRef, useEffect, useLayoutEffect } from 'react';

interface UseExpandableElementProps {
    defaultVisible?: boolean;
    transitionDuration?: string;
    extraHeight?: number;
}

const useExpandableElement = ({
    defaultVisible = false,
    transitionDuration = '0.3s',
    extraHeight = 10, // Adjust the value as needed
}: UseExpandableElementProps = {}) => {
    const [visible, setVisible] = useState(defaultVisible);
    const elementRef = useRef<HTMLDivElement | null>(null);
    const [elementStyles, setElementStyles] = useState<React.CSSProperties>({
        maxHeight: defaultVisible ? 'none' : '0',
        overflow: 'hidden',
        transition: `max-height ${transitionDuration} ease, transform ${transitionDuration} ease`,
        transform: defaultVisible ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'top',
        visibility: defaultVisible ? 'visible' : 'hidden',
    });

    const toggleVisibility = () => {
        setVisible((prevVisible) => !prevVisible);
    };

    useEffect(() => {
        if (elementRef.current) {
            if (visible) {
                elementRef.current.style.visibility = 'hidden';
                elementRef.current.style.maxHeight = 'none';
                const actualHeight = elementRef.current.offsetHeight;
                elementRef.current.style.maxHeight = '';
                elementRef.current.style.visibility = '';

                setElementStyles({
                    ...elementStyles,
                    maxHeight: actualHeight + extraHeight + 'px', // Add extra height
                    transform: 'scaleY(1)',
                    visibility: 'visible',
                });
            } else {
                setElementStyles({
                    ...elementStyles,
                    maxHeight: '0',
                    transform: 'scaleY(0)',
                    visibility: 'hidden',
                });
            }
        }
    }, [visible]);

    return {
        visible,
        toggleVisibility,
        elementRef,
        elementStyles,
    };
};

export default useExpandableElement;
