
import React, { useState, useEffect } from 'react';
import { Galleria } from 'primereact/galleria';
import axios from 'axios';
import { galleria } from '../../../layout/galleria';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../../constants';

export default function ControlledDemo() {
    const [images, setImages] = useState([]);

    const {id} = useParams();
    const responsiveOptions = [
        {
            breakpoint: '991px',
            numVisible: 4
        },
        {
            breakpoint: '767px',
            numVisible: 3
        },
        {
            breakpoint: '575px',
            numVisible: 1
        }
    ];

    useEffect(() => {
                const fetchImages = async () => {
                    try {
                        const response = await axios.get(`${BASE_URL}/products/${id}`);
                        if (response.status === 200) {
                            // Fetch images from API
                            const galleryImages = response.data.data.gallery.map(item => ({
                                itemImageSrc: item.url, // Image URL
                                alt: `Image ${item._id}` // Alternative text for the image
                            }));
                            setImages(galleryImages); // Store images in state
                        }
                    } catch (error) {
                        console.error("Error fetching images:", error.message);
                        console.error("Error details:", error.response);
                    }
                };
                fetchImages();
       }, [id]);

    const itemTemplate = (item) => {
        return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '800px', display: 'block', height :"600px",}} />;
    }

    const thumbnailTemplate = (item) => {
        return (
                        <div style={{
                            backgroundColor: 'transparent',
                            padding: '5px',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '300px',
                            height: '100px',
                            overflow: 'hidden',
                        }}>
                            <img src={item.itemImageSrc} alt={item.alt} style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'cover',
                }} />
            </div>
        );
    };

    return (
        <div className="card">
              <Galleria 
                value={images} 
                responsiveOptions={responsiveOptions} 
                numVisible={5} 
                circular 
                style={{ maxWidth: '640px' }}
                item={itemTemplate} 
                thumbnail={thumbnailTemplate} 
                pt={galleria} 
                />
                </div>
    );
}
        
