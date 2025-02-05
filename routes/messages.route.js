import { Router } from "express";
import {Message} from "../models/message.model.js";
export const router = Router()

router.get("/messages", async (req, res) => {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });
  
  // Save a new message
  router.post("/messages", async (req, res) => {
    try {
      const { message, link } = req.body;
      if (!message) return res.status(400).json({ error: "Message is required" });
  
      const newMessage = new Message({ message, link });
      await newMessage.save();
      res.status(200).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Server Error" });
    }
  });
  
  router.delete("/messages/:id", async (req, res) => {
    try {
      await Message.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting message" });
    }
  });
  
  