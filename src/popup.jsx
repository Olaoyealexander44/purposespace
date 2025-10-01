import React, { useEffect, useRef, useState } from "react";

export default function PopupMedia({
    type = "image",
    title,
    meta,
    description,
    imageUrl = "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=1600&auto=format&fit=crop&q=80",
    videoUrl = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    onClose,
}) {
    const [open, setOpen] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        if (open) {
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "";
        }
    }, [open]);

    const closePopup = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        if (onClose) {
            onClose();
        } else {
            setOpen(false);
        }
    };

    const defaultTitle = (type === "image" || type === "picture") ? "There is a space for you" : "Inspiring clip";
    const defaultMeta =
        (type === "image" || type === "picture") ? "Photographer • Sep 29, 2025" : "Creator • Sep 30, 2025";
    const defaultDesc =
        (type === "image" || type === "picture")
            ? "This image invites you — a visual caption sits beside it to explain or tell a short story."
            : "A short looped clip that illustrates motion. Good for hero or header content.";

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-emerald-900/80 
                               backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 z-50"
                    onClick={(e) => e.target === e.currentTarget && closePopup()}
                >
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-green-100
                                    w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 
                                    grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px] 
                                    max-h-[95vh] sm:max-h-[90vh] overflow-hidden
                                    mx-auto my-auto transform transition-all duration-300 scale-100">
                        
                        {/* Media Section */}
                        <div className="relative flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50
                                        min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] xl:min-h-[400px]
                                        max-h-[50vh] sm:max-h-[60vh] lg:max-h-none
                                        border-b lg:border-b-0 lg:border-r border-green-100">
                            
                            {/* Media Content */}
                            <div className="relative w-full h-full rounded-t-2xl sm:rounded-t-3xl lg:rounded-tr-none lg:rounded-l-2xl lg:rounded-bl-3xl overflow-hidden">
                                {(type === "image" || type === "picture") ? (
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <video
                                        ref={videoRef}
                                        src={videoUrl}
                                        controls
                                        playsInline
                                        muted
                                        autoPlay
                                        className="w-full h-full object-cover"
                                    />
                                )}
                                
                                {/* Media Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent"></div>
                            </div>
                            
                            {/* Close Button */}
                            <button
                                onClick={closePopup}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 
                                         bg-white/90 hover:bg-white text-green-700 hover:text-green-800
                                         w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11
                                         rounded-full flex items-center justify-center 
                                         text-lg sm:text-xl lg:text-2xl font-medium
                                         shadow-lg hover:shadow-xl border border-green-100
                                         transition-all duration-200 transform hover:scale-105
                                         touch-manipulation backdrop-blur-sm"
                                aria-label="Close popup"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className="bg-gradient-to-br from-white to-green-50/30 
                                        flex flex-col p-6 sm:p-7 lg:p-8 overflow-auto
                                        min-h-[200px] sm:min-h-[250px]">
                            
                            {/* Header Section */}
                            <div className="border-b border-green-100 pb-4 mb-6">
                                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 leading-tight mb-2">
                                    {title || defaultTitle}
                                </h2>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-green-600">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    {meta || defaultMeta}
                                </div>
                            </div>
                            
                            {/* Description Section */}
                            <div className="flex-grow mb-6">
                                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                                    {description || defaultDesc}
                                </p>
                            </div>
                            
                            {/* Action Section */}
                            <div className="border-t border-green-100 pt-6">
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                    <button className="flex-1 px-6 py-3 sm:py-2.5 rounded-xl 
                                                     bg-gradient-to-r from-green-600 to-emerald-600 
                                                     hover:from-green-700 hover:to-emerald-700
                                                     text-white font-semibold shadow-lg hover:shadow-xl
                                                     transition-all duration-200 text-sm sm:text-base
                                                     touch-manipulation active:scale-95 transform
                                                     border border-green-500">
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            Take Action
                                        </span>
                                    </button>
                                    <button className="flex-1 px-6 py-3 sm:py-2.5 rounded-xl 
                                                     bg-white hover:bg-green-50 
                                                     border-2 border-green-200 hover:border-green-300
                                                     text-green-700 hover:text-green-800 font-medium
                                                     transition-all duration-200 text-sm sm:text-base
                                                     touch-manipulation active:scale-95 transform
                                                     shadow-sm hover:shadow-md">
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                            Share Story
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
