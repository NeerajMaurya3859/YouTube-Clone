
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadLargeVideo = (filePath) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
            filePath,
            {
                resource_type: "video",
                chunk_size: 5* 1024 * 1024
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
    });
};
// 
// Extract Cloudinary public_id from the stored URL
const getPublicIdFromUrl = (url) => {
    const pathname = new URL(url).pathname;
    const uploadIndex = pathname.indexOf("/upload/");

    if (uploadIndex === -1) {
        throw new Error("Invalid Cloudinary URL");
    }

    const parts = pathname
        .substring(uploadIndex + 8)
        .split("/");

    // Remove version segment, such as v123456789
    const versionIndex = parts.findIndex(part => /^v\d+$/.test(part));

    const publicIdParts = versionIndex !== -1
        ? parts.slice(versionIndex + 1)
        : parts;

    return publicIdParts.join("/").replace(/\.[^/.]+$/, "");
};


// Delete video or thumbnail from Cloudinary
export const deleteFromCloudinary = async (url, resourceType) => {
    if (!url) return;

    const publicId = getPublicIdFromUrl(url);

    const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        invalidate: true
    });

    if (result.result !== "ok" && result.result !== "not found") {
        throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }

    return result;
};
// 
const uploadOnCloudinary = async (filePath, resourceType = "auto") => {
    if (!filePath) {
        throw new Error("File path is missing.");
    }

    try {
        let result;

        if (resourceType === "video") {
            result = await uploadLargeVideo(filePath);
        } else {
            result = await cloudinary.uploader.upload(filePath, {
                resource_type: resourceType
            });
        }

        if (!result?.secure_url) {
            throw new Error("Cloudinary returned no secure URL.");
        }

        console.log("Cloudinary upload successful:", result.secure_url);

        return result.secure_url;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw error;

    } finally {
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
                console.error("Temporary file cleanup failed:", error.message);
            }
        }
    }
};

export default uploadOnCloudinary;

