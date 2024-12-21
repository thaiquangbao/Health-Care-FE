import { useState, useEffect } from 'react';

const useWindowWidth = () => {
    const [width, setWidth] = useState(globalThis.window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Gọi để cập nhật lần đầu tiên

        return () => window.removeEventListener('resize', handleResize); // Dọn dẹp sự kiện
    }, []);

    return width;
};

export default useWindowWidth;