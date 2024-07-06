// src/TributePage.js
import React from 'react';
import './Tribute.css';

const Tribute = () => {
    const photos = [
        "https://res.cloudinary.com/dryylor5o/image/upload/v1720267756/Ashiyo/srkn21mgyizajbcy7e80.jpg",
        "https://res.cloudinary.com/dryylor5o/image/upload/v1720267749/Ashiyo/d1pdg06ww5ylwbrg2nkl.jpg",
        "https://res.cloudinary.com/dryylor5o/image/upload/v1720267747/Ashiyo/yoa29c4pc360m5vkhhuf.jpg",
        "https://res.cloudinary.com/dryylor5o/image/upload/v1720267744/Ashiyo/pybj1edi2sh4yjcdojgk.jpg",
        "https://res.cloudinary.com/dryylor5o/image/upload/v1720267740/Ashiyo/qgi6rxixc6u8ekgkaxss.jpg",
        "https://res.cloudinary.com/dryylor5o/image/upload/v1720267739/Ashiyo/pvdsm70esah6tdi9azh8.jpg",
        "https://res.cloudinary.com/dryylor5o/image/upload/v1720267757/Ashiyo/qtkebvgoli4pv1xugdr6.jpg",
        "https://res.cloudinary.com/dryylor5o/image/upload/v1720267760/Ashiyo/lciqj6twehn0diyb0jl2.jpg"
        // add paths to other photos here
    ];

    return (
        <div className="tribute-page">
            <div className="header">
                <h1>Tribute to Aashish</h1>
                <p>Aashish was/is a great friend and the first tester of my first webdevelopment project. He motivated me a lot.</p>
            </div>
            <div className="photo-gallery">
                {photos.map((photo, index) => (
                    <div key={index} className="photo-container">
                        <img src={photo} alt={`Aashish ${index + 1}`} className="photo"/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tribute;
