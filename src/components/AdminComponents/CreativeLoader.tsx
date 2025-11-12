import React from 'react';

// Define the 8 specific colors shown in the image (or a professional rainbow gradient)
const ORBITAL_COLORS = [
    '#9B59B6', // Violet
    '#3498DB', // Blue
    '#1ABC9C', // Teal
    '#2ECC71', // Green
    '#F1C40F', // Yellow
    '#E67E22', // Orange
    '#E74C3C', // Red
    '#D970A1', // Pink/Magenta
];

const CreativeOrbLoader: React.FC = () => {
    // Generate 8 ball divs, each with a different color and animation delay
    const orbs = Array.from({ length: 8 }, (_, i) => {
        // Calculate the rotation delay for staggering the animation
        const delay = (i * 0.1) - 0.8; // 8 orbs, staggered delay
        const color = ORBITAL_COLORS[i % ORBITAL_COLORS.length];

        return (
            <div
                key={i}
                className="orb absolute w-20 h-20 rounded-full"
                style={{
                    backgroundColor: color,
                    animationDelay: `${delay}s`,
                    // We need to apply the position/animation class here to link the CSS
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            />
        );
    });

    return (
        // Outer container uses Tailwind for dark background
        <div className="flex flex-col items-center justify-center h-screen overflow-hidden text-white">
            {/* Real Estate Themed Message */}
            <div className="text-center mb-2 z-10 p-6">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-wider animate-pulse">
                    Loading ....
                </h1>
            </div>

            {/* Animation Container - Centered */}
            <div className="orb-container relative w-64 h-64 flex justify-center items-center">
                {orbs}
            </div>

            {/* --- Style Block for Custom CSS and Keyframes --- */}
            <style>{`
                /* Keyframe for the rotational movement and orbital position */
                @keyframes rotate-orb {
                    0% {
                        transform: translate(-50%, -50%) rotate(0deg) translate(50px) rotate(0deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) rotate(360deg) translate(50px) rotate(-360deg);
                    }
                }

                .orb {
                    /* Initial position is centered, then moved out by the keyframe translation */
                    opacity: 0.5;
                    filter: blur(2px); /* Adding a slight blur to enhance the translucent, glowing effect */
                    
                    /* Apply the animation */
                    animation: rotate-orb 4s linear infinite; 
                    
                    /* To prevent the colors from blending with the black background, 
                       we use isolation to ensure the blending mode only applies to overlapping orbs. */
                    mix-blend-mode: screen; 
                    
                    /* The key is the translate(50px) inside the keyframe which pushes the orb out from the center. */
                }

                /* Container for overall animation */
                .orb-container {
                    /* Optional: Rotate the entire container to add an extra layer of motion */
                    animation: spin-container 8s linear infinite;
                }

                @keyframes spin-container {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

            `}</style>
        </div>
    );
};

export default CreativeOrbLoader;
