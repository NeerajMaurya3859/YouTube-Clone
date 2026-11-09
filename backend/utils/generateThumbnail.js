import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

const generateThumbnail = async (videoPath, thumbnailPath) => {
    try {
        await execFileAsync("ffmpeg", [
            "-y",
            "-ss", "1",
            "-i", videoPath,
            "-frames:v", "1",
            "-q:v", "2",
            "-vf", "scale=640:-1",
            thumbnailPath
        ]);

        return thumbnailPath;

    } catch (error) {
        console.error("ffmpeg error:", error.message);
        throw new Error("Thumbnail generation failed");
    }
};

export default generateThumbnail;