
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"

const db = new PrismaClient()

export const auth = async (req: any) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) return new Response(JSON.stringify({message: "No token provided"}), {status: 401})
        const verified = jwt.verify(token, process.env.SECRET_KEY as string)
        const user = await db.user.findUnique({where: {id: (verified as any).id}})
        if (!user) return new Response(JSON.stringify({message: "User not found"}), {status: 404})
        req.user = user
    } catch (error: any) {
        return new Response(JSON.stringify({message: error.message}), {status: 500})
    }
}
