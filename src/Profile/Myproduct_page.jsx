import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import Navbar from "../Navbar";
// import Breadcrumbs from "../Product_details/Breadcrumbs"; // Removed this import
import { Loader2, Edit, Trash2 } from "lucide-react"; // Import new icons

const Myproduct_page = () => {
    const { id } = useParams(); // product ID from URL
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(""); // State for gallery
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const backendURL = "https://relayy-backend-9war.onrender.com";

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${backendURL}/api/v1/products/${id}`);
                setProduct(res.data);
                if (res.data.imageUrls && res.data.imageUrls.length > 0) {
                    setMainImage(res.data.imageUrls[0]);
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                alert("Product not found!");
                navigate("/profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, backendURL, navigate]);

    const handleDelete = async () => {
        // Confirmation dialog
        if (window.confirm("Are you sure you want to delete this ad? This cannot be undone.")) {
            try {
                await axios.delete(`${backendURL}/api/v1/products/${id}`, {
                    withCredentials: true,
                });
                alert("Ad deleted successfully.");
                navigate("/profile"); // Navigate back to profile after delete
            } catch (err) {
                console.error("Error deleting product:", err);
                alert("Failed to delete ad. Please try again.");
            }
        }
    };

    if (loading)
        return (
            <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );

    if (!product)
        return (
            <div className="bg-emerald-50 min-h-screen">
                <Navbar />
                <p className="text-center mt-20 text-gray-600">Product not found.</p>
            </div>
        );

    const images = product.imageUrls || [];

    return (
        <div className="bg-emerald-50 min-h-screen relative overflow-hidden font-sans">
            

            <div className="relative z-10">
                <Navbar />
                
                {/* Main Content Card */}
                <main className="max-w-4xl mx-auto my-8 p-4 sm:p-8 bg-white rounded-2xl shadow-xl">
                    {/* <Breadcrumbs category={product.category} title={product.title} /> */} {/* Removed this line */}

                    <div className="grid md:grid-cols-2 gap-8 mt-6">
                        
                        {/* --- Image Gallery --- */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-gray-100 rounded-lg shadow-inner overflow-hidden border border-gray-200">
                                <img
                                    src={mainImage || 'https://placehold.co/600x600/e2e8f0/64748b?text=No+Image'}
                                    alt="Main product view"
                                    className="w-full h-auto md:h-[450px] object-cover"
                                />
                            </div>
                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-5 gap-3">
                                    {images.map((imgSrc, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setMainImage(imgSrc)}
                                            className={`
                                                rounded-lg overflow-hidden h-20 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500
                                                ${mainImage === imgSrc 
                                                  ? 'ring-2 ring-emerald-500 border-2 border-emerald-500' 
                                                  : 'border border-gray-200 opacity-70 hover:opacity-100'
                                                }
                                            `}
                                        >
                                            <img
                                                src={imgSrc}
                                                alt={`thumb ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* --- Details --- */}
                        <div className="flex flex-col">
                            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                                {product.title}
                            </h2>
                            <p className="text-gray-600 mb-4">Category: {product.category}</p>
                            
                            {/* Price */}
                            <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800 mb-4">
                                ₹{product.price}
                            </p>
                            
                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-700 leading-relaxed">{product.description}</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="mt-auto space-y-3">
                                <button
                                    onClick={() => navigate(`/edit/${product._id}`)}
                                    className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition shadow-md transform hover:scale-105"
                                >
                                    <Edit className="w-5 h-5 mr-2" />
                                    Edit This Listing
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition shadow-md transform hover:scale-105"
                                >
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    Delete This Listing
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Myproduct_page;

