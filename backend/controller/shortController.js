
import uploadOnCloudinary from "../config/cloudinary.js"
import Channel from "../model/channelModel.js"
import Short from "../model/shortModel.js"

export const createShort = async (req, res) => {
    try {
        console.log("Create short function called") 
        const { title, description, tags, channelId } = req.body

        if (!title || !req.file || !channelId) {
            return res.status(400).json({ 
                message: "Short title, channelId and file is required" })
        }

        let shortUrl
        if (req.file) {
            shortUrl = await uploadOnCloudinary(req.file.path)
        }

        const channelData = await Channel.findById(channelId)
        if (!channelData) {
            return res.status(400).json({
                 message: "channel is not found by id" })
        }

        const newShort = await Short.create({
            channel: channelData._id,
            title,
            description,
            shortUrl,
            tags: tags ? JSON.parse(tags) : []
        })
        await Channel.findByIdAndUpdate(
            channelData._id,
            {$push:{Shorts:newShort._id}},
            {new:true}
        )

        await Channel.findByIdAndUpdate(
            channelData._id,
            { $push: { Shorts: newShort._id } },
            { new: true }
        )

        return res.status(201).json(newShort)
    } catch (error) {
        // return res.status(500).json({ message: `failed to create short ${error}` })
        console.error("Create short error",error);
        return res.status(500).json({message:error.message})
    }
}

export const getAllShorts = async (req, res) => {
    try {
        const shorts = await Short.find()
            .populate("channel", "name avatar subscribers")
            .sort({ createdAt: -1 })

        if (!shorts) {
            return res.status(400).json({ message: "No shorts found" })
        }

        return res.status(200).json(shorts)
    } catch (error) {
        return res.status(500).json({
             message: `Failed to get all shorts ${error}` })
    }
}

export const toggleLikesShort = async (req, res) => {
    try {
        const { shortId } = req.params
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({ message: "short is not found" })
        }

        if (short.likes.includes(userId)) {
            short.likes.pull(userId)
        } else {
            short.likes.push(userId)
            short.dislikes.pull(userId)
        }

        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({
             message: `failed to like the short ${error}` })
    }
}

export const toggleDislikesShort = async (req, res) => {
    try {
        const { shortId } = req.params
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({ message: "short is not found" })
        }

        if (short.dislikes.includes(userId)) {
            short.dislikes.pull(userId)
        } else {
            short.dislikes.push(userId)
            short.likes.pull(userId)
        }

        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({ 
            message: `failed to dislike the short ${error}` })
    }
}

export const toggleSaveShort = async (req, res) => {
    try {
        const { shortId } = req.params
        const userId = req.userId

        const short = await Short.findById(shortId)
        if (!short) {
            return res.status(400).json({ 
                message: "short is not found" })
        }

        if (short.saveBy.includes(userId)) {
            short.saveBy.pull(userId)
        } else {
            short.saveBy.push(userId)
        }

        await short.save()
        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({
             message: `failed to save the short ${error}` })
    }
}

export const getShortViews = async (req, res) => {
    try {
        const { shortId } = req.params

        const short = await Short.findByIdAndUpdate(
            shortId,
            { $inc: { views: 1 } },
            { new: true }
        )

        if (!short) {
            return res.status(400).json({ 
                message: "short is not found" })
        }

        return res.status(200).json(short)
    } catch (error) {
        return res.status(500).json({
             message: `failed to get short views ${error}` })
    }
}
