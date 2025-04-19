import React from 'react';

type SpinnerProps = {
    size?: number; // size in pixels
    color?: string; // Tailwind color classes
};

const Spinner: React.FC<SpinnerProps> = ({ size = 24, color = 'border-red-600' }) => {
    return (
        <div
            className={`animate-spin rounded-full border-4 border-t-transparent ${color}`}
            style={{ width: size, height: size }}
        />
    );
};

export default Spinner;
