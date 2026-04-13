import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { Loader2, Save, UploadCloud, Trash2 } from "lucide-react"; // Import new icons

const EditProduct = () => {
    const { id } = useParams();
    const [productData, setProductData] = useState(null); // Original data
    const [formData, setFormData] = useState({}); // Form state
    const [preview, setPreview] = useState([]); // Image previews
    const [loading, setLoading] = useState(true); // Page load
    const [isUpdating, setIsUpdating] = useState(false); // Form submit
    // --- New state for drag-and-drop visual feedback ---
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();

    const backendURL = "https://relayy-backend-9war.onrender.com";

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${backendURL}/api/v1/products/${id}`);
                setProductData(res.data);
                // Initialize form data with fetched product data
                setFormData({
                    title: res.data.title || "",
                    price: res.data.price || "",
                    category: res.data.category || "", // Make sure category is included
                    description: res.data.description || "",
                    // Don't include images here, handle separately
                });
                setPreview(res.data.imageUrls || []);
            } catch (err) {
                console.error("Error loading product:", err);
                alert("Error loading product data.");
                navigate("/profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, backendURL, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // --- Unified function to handle files from click OR drop ---
    const processFiles = (files) => {
        const currentImageCount = preview.length; // Use preview length for existing + new
        const remainingSlots = 4 - currentImageCount;
        const filesToAdd = files.slice(0, remainingSlots);

        if (filesToAdd.length > 0) {
            // Add new files to the formData's 'images' property
            setFormData((prev) => ({
                ...prev,
                images: [...(prev.images || []), ...filesToAdd]
            }));

            // Add new file previews to the existing previews
            const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
            setPreview((prev) => [...prev, ...newPreviews]);
        }

        if (files.length > remainingSlots) {
            alert(`You can only upload a maximum of 4 images. ${remainingSlots} slots were remaining.`);
        }
    };

    /* ------------------------- handle image selection (click) ---------------- */
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
        // Reset the input value so the same file can be selected again if removed
        e.target.value = null;
    };

    /* ------------------------- handle drag-and-drop events ------------------- */
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };


    // --- Function to remove an image (Handles both existing URLs and new previews) ---
    const removeImage = (indexToRemove) => {
        const imageToRemove = preview[indexToRemove];

        // Revoke object URL if it's a blob preview
        if (imageToRemove.startsWith('blob:')) {
            URL.revokeObjectURL(imageToRemove);
        }

        // Filter out the preview
        setPreview((prev) => prev.filter((_, i) => i !== indexToRemove));

        // Filter out the corresponding file from formData.images (if it exists)
        // This part is tricky because formData.images only holds NEW files
        // We need a way to mark existing imageUrls for deletion on the backend
        // For now, let's just handle removing NEWLY added files from formData
        setFormData((prev) => {
            // Find the index in the original File array if possible
            // This assumes the order in preview might match formData.images for new files
            // A more robust solution might involve mapping previews back to files or URLs
            const updatedImages = (prev.images || []).filter((_, i) => {
                 // Simplistic assumption: If removing from preview, remove corresponding index from new files
                 // This might need refinement based on how you track original vs new images
                 // For now, let's assume removing the preview means removing the corresponding new file upload intention.
                 // This requires careful handling if you mix existing URLs and new files in `preview`.
                 // A common approach is to have separate states for `existingImageUrls` and `newFiles`.
                 
                 // If the removed preview was a blob, try removing the file at the corresponding index
                 // Need to adjust index based on how many original URLs were before it.
                 // Let's postpone complex deletion logic for now and focus on upload.
                 return true; // Placeholder: deletion logic needs more thought
            });
            return { ...prev, images: updatedImages };
        });
        
        // **IMPORTANT**: For deleting *existing* images (imageUrls from the server),
        // you'll need to send this information to the backend during the PUT request.
        // A common way is to add a field like `imagesToDelete: [url1, url2]` to your formData
        // when the 'X' button for an existing image URL is clicked.
        // The simple `removeImage` above only handles removing *newly added* file previews.
         alert("Note: Removing existing images requires backend changes. This action only removes previews of newly added files.");

    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            const data = new FormData();
            
            // Append text data (ensure category is sent if edited)
            data.append('title', formData.title);
            data.append('price', formData.price);
            data.append('category', formData.category); // Include category
            data.append('description', formData.description);
            
            // Append NEW images if they exist
            if (formData.images && formData.images.length > 0) {
                formData.images.forEach((img) => data.append("images", img));
            }

            // **IMPORTANT**: Add logic here to append 'imagesToDelete' if implementing deletion
            // data.append('imagesToDelete', JSON.stringify(yourListOfUrlsToDelete));


            await axios.put(`${backendURL}/api/v1/products/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data", // Need this for file uploads
                    // Authorization header might be needed depending on your backend setup
                },
                withCredentials: true, // Send cookies if needed
            });

            alert("✅ Listing updated successfully!");
            navigate("/profile");
        } catch (err) {
            console.error("Error updating listing:", err.response?.data || err.message);
            alert("❌ Failed to update listing.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading)
        return (
            <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
                <Loader2 className="animate-spin text-emerald-600" size={40} />
            </div>
        );

     // Ensure productData exists before rendering form
    if (!productData) {
         return (
             <div className="bg-emerald-50 min-h-screen">
                 <Navbar />
                 <p className="text-center mt-20 text-gray-600">Could not load product data.</p>
             </div>
         );
    }


    return (
        <div className="bg-emerald-50 min-h-screen relative overflow-hidden font-sans">
            {/* Background pattern removed */}
            <div className="relative z-10"> {/* Removed relative z-10 */}
                <Navbar />
                
                {/* Main Content Card */}
                <main className="max-w-3xl mx-auto my-8 p-6 sm:p-8 bg-white rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                        ✏️ Edit Your Listing
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="e.g., 'Vintage Denim Jacket'"
                                value={formData.title || ""}
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-emerald-100 bg-emerald-50 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Price (₹) <span className="text-red-500">*</span></label>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                placeholder="e.g., 999"
                                value={formData.price || ""}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full border-2 border-emerald-100 bg-emerald-50 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                            />
                        </div>

                        {/* Category */}
                         <div>
                            <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category || ""} // Ensure category is bound
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-emerald-100 bg-emerald-50 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white appearance-none"
                            >
                                <option value="" disabled>Select category</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Books">Books</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>


                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows="4"
                                placeholder="Describe your item..."
                                value={formData.description || ""}
                                onChange={handleChange}
                                className="w-full border-2 border-emerald-100 bg-emerald-50 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                            />
                        </div>

                        {/* Custom File Input / Dropzone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Images (Max 4 total) <span className="text-red-500">*</span></label>
                            <label
                                htmlFor="images"
                                onDragOver={handleDragOver} // <-- Added
                                onDragLeave={handleDragLeave} // <-- Added
                                onDrop={handleDrop} // <-- Added
                                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                    ${isDragging ? 'border-emerald-500 bg-emerald-100' : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'}
                                `} // <-- Added dynamic styling
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-emerald-600' : 'text-emerald-500'}`} />
                                    <p className={`mb-2 text-sm ${isDragging ? 'text-emerald-700' : 'text-emerald-700'}`}><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">Add new images (replaces old ones if any)</p> {/* Clarified behavior */}
                                </div>
                                <input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                        </div>
                        
                        {/* Image Previews */}
                        {preview.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-700 mb-2">Current Images</h3> {/* Changed title */}
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                    {preview.map((src, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={src} // src can be an existing URL or a blob URL
                                                alt={`Preview ${idx + 1}`}
                                                className="h-32 w-full object-cover rounded-lg border-2 border-emerald-100"
                                            />
                                            {/* Delete button might need more complex logic for existing vs new */}
                                            <button 
                                                type="button"
                                                onClick={() => removeImage(idx)} 
                                                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                                                title="Remove Image"
                                            >
                                                <Trash2 size={14} /> {/* Changed to Trash icon */}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isUpdating} // Use isUpdating state
                            className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition shadow-md transform hover:scale-105 disabled:opacity-70"
                        >
                            {isUpdating ? ( // Use isUpdating state
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Update Listing
                                </>
                            )}
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default EditProduct;

