import file, {FileCustomRequest} from "../middleware/file";
import {Response} from "express";
import router from "../routes/protected";
import {ApiResponse} from "../utils/ApiResponse";
const sendResponse = (res: Response, status: number, response: ApiResponse) => {
    res.status(status).json(response);
};
router.post("/upload", file.single("image"), (req: FileCustomRequest, res: Response): void => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded or invalid file type" })
            sendResponse(res, 400, {
                error: { code: "ERR", title: 'Bad Request', message: "No file uploaded or invalid file type" },
            });
            return;
        }

        const protocol = req.protocol;
        const host = req.get("host");
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
        sendResponse(res, 200, {
            success: {
                title: 'Uploaded',
                message:'Image uploaded successfully'
            },
            data: { image_url: imageUrl },
        })
    } catch (error) {
        console.error("Upload error:", error);
        sendResponse(res, 500, {
            error: { code: "ERR", title: 'Server Error', message: "Internal server error" },
        });
    }
});
export default router
