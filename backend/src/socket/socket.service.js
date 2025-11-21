import { Server } from "socket.io";
import { generateContent, generateVector } from "../services/ai.service.js";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import messageModel from "../models/message.model.js";
import { createMemory, queryMemory } from "../services/vector.service.js";

function setupSocketServer(server) {
  const allowedOrigins = [
    'https://askly-the-college-query-platform.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174'
  ];

  const io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      const headerAuth = socket.handshake.headers?.authorization || socket.handshake.headers?.Authorization;
      const authToken = socket.handshake.auth?.token;

      let token = cookies.token;
      if (!token && headerAuth?.startsWith("Bearer ")) {
        token = headerAuth.slice(7);
      }
      if (!token && typeof authToken === 'string') {
        token = authToken;
      }

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.userId);

      if (!user) {
        return next(new Error("Authentication error: user not found"));
      }
      socket.user = user;

      next();
    } catch (error) {
      return next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      let parsedPayload;

      try {
        if (typeof messagePayload === "string") {
          parsedPayload = JSON.parse(messagePayload);
        } else {
          parsedPayload = messagePayload;
        }

        const { content, chat } = parsedPayload;

       

        const [message,vectors] = await Promise.all([
          messageModel.create({
            user: socket.user._id,
            chat: chat,
            content: content,
            role: "user",
          }),
          generateVector(content),
         
        ]);

       
     
        
         createMemory({
            vectors,
            messageId: message._id,
            metadata: {
              chat: chat,
              user: socket.user._id,
              text: content,
            },
          })

        const [memory, chatHistory] = await Promise.all([
          queryMemory({
            queryVector: vectors,
            limit: 3,
            metadata: {
              user: socket.user._id,
            },
          }),
          messageModel
            .find({ chat: chat })
            .sort({ createdAt: -1 })
            .limit(4)
            .lean()
            .then((messages) => messages.reverse()),
        ]);

        const shortTermMemory = chatHistory.map(msg => {
          return {
            role: msg.role,
            parts: [{ text: msg.content }],
          };
        });

        const longTermMemory = [
          {
            role: "user",
            parts: [
              {
                text: `these are some previous messages from the chat ,use them to generate a response
                ${memory.map((item) => item.metadata.text).join("\n")}
              `,
              },
            ],
          },
        ];

        const result = await generateContent([
          ...longTermMemory,
          ...shortTermMemory,
        ]);
        
        socket.emit("ai-response", {
          message: result,
          chat: chat,
        });
   

        const [ responseMessage, responseVectors] = await Promise.all([
           messageModel.create({
          user: socket.user._id,
          chat: chat,
          content: result,
          role: "model",
        }),
        generateVector(result)
        ])

        await createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: chat,
            user: socket.user._id,
            text: result,
          },
        });

      } catch (error) {
        console.error("Error processing AI message:", error);
        socket.emit("ai-error", {
          error: "Failed to generate AI response",
          chat: parsedPayload?.chat || messagePayload?.chat,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.email);
    });
  });

  return io;
}

export default setupSocketServer;
