
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { auth } from './middleware'
const db = new PrismaClient()

type User = {
    id: number
    name: string
    email: string
    password: string
}

type Post = {
    id: number
    title: string
    content: string
    authorId: string
}

// user register
export const register = async (req: any) => {
    try {
        const { name, email, password }: User = req.body
        // check if user already exists
        const user = await db.user.findUnique({where: {email: email}})
        if (user) {
            return new Response(JSON.stringify({message: "User already exists"}),{status: 400})
        }
        // create user
        const newUser = await db.user.create({data: {name: name,email: email,password: password}})
        return new Response(JSON.stringify({message: "User created successfully",user: newUser}), {status: 200})
    } catch (error: any) {
        return new Response(JSON.stringify({message: error.message}),{status: 500})
    }
}

export const test = () => {
    return "tested"
}

// user login
export const login = async (req: any) => {
    try {
        const { email, password }: User = req.body
        // check if user already exists
        const user = await db.user.findUnique({where: {email: email}})
        if (!user) {
            return new Response(JSON.stringify({message: "User does not exist"}), {status: 400})
        }
        // check if password is correct
        if (user.password !== password) {
            return new Response(JSON.stringify({message: "Incorrect password"}), {status: 400})
        }
        // create token
        const secret = "secret"
        const token = jwt.sign({id: user.id}, secret, {expiresIn: "1h"})
        return new Response(JSON.stringify({message: "User logged in successfully",token: token}), {status: 200})
    } catch (error: any) {
        return new Response(JSON.stringify({message: error.message}),{status: 500})
    }
}

// user create post
export const createPost = async (req: any) => {
    try {
        const { title, content }: Post = req.body
        const newPost = await db.post.create({data: {title: title,content: content,authorId: req.user.id}})
        return new Response(JSON.stringify({message: "Post created successfully",post: newPost}), {status: 200})
    } catch (error: any) {
        return new Response(JSON.stringify({message: error.message}),{status: 500})        
    }
}


// user get all posts
export const getPosts = async (req: any) => {
    try {
        // console.log(req.user.id)
        const posts = await db.post.findMany()
        return new Response(JSON.stringify({message: "Posts fetched successfully",posts: posts}), {status: 200})
    } catch (error: any) {
        return new Response(JSON.stringify({message: error.message}),{status: 500})        
    }
}


// user get post by id
export const getPost = async (req: any) => {
    try {
        const { id }: Post = req.params
        const post = await db.post.findUnique({where: {id: String(id)}})
        return new Response(JSON.stringify({message: "Post fetched successfully",post: post}), {status: 200})
    } catch (error: any) {
        return new Response(JSON.stringify({message: error.message}),{status: 500})        
    }
}


// user update post
export const updatePost = async (req: any) => {
    try {
        const { id }: Post = req.params
        const { title, content }: Post = req.body
        // check if user is the author of the post
        const post = await db.post.findUnique({where: {id: String(id)}})
        if (post?.authorId !== req.user.id) {
            return new Response(JSON.stringify({message: "You are not the author of this post"}), {status: 401})
        }
        // update post
        const updatedPost = await db.post.update({where: {id: String(id)},data: {title: title,content: content}})
        return new Response(JSON.stringify({message: "Post updated successfully",post: updatedPost}), {status: 200})
    }
    catch (error: any) {
        return new Response(JSON.stringify({message: error.message}),{status: 500})        
    }
}


// user delete post
export const deletePost = async (req: any) => {
    try {
        const { id }: Post = req.params
        // check if user is the author of the post
        const post = await db.post.findUnique({where: {id: String(id)}})
        if (post?.authorId !== req.user.id) {
            return new Response(JSON.stringify({message: "You are not the author of this post"}), {status: 401})
        }
        // delete post
        await db.post.delete({where: {id: String(id)}})
        return new Response(JSON.stringify({message: "Post deleted successfully"}), {status: 200})
    }
    catch (error: any) {
        return new Response(JSON.stringify({message: error.message}),{status: 500})        
    }
}

// user get all posts
export const getPostsByUser = async (req: any) => {
    try {
        const posts = await db.post.findMany({where: {authorId: req.user.id}})
        return new Response(JSON.stringify({posts: posts}), {status: 200})
    } catch (error: any) {
        return new Response(JSON.stringify({message: error.message}),{status: 500})        
    }
}

