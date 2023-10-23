

import { register, test, login, createPost, getPosts, getPost, updatePost, deletePost, getPostsByUser } from "./controllers";
import { Elysia } from "elysia";
import { auth } from "./middleware";

const routes = new Elysia()
  

routes.group("/user", routes => routes
    .group("/auth", routes => routes 
        .post("/register", register)
        .post("/login", login)
    )
    .onBeforeHandle(
        auth
    )
    .post("/post", createPost)
    .get("/posts", getPosts)
    .get("/post/:id", getPost)
    .get("/myposts", getPostsByUser)
    .put("/post/:id", updatePost)
    .delete("/post/:id", deletePost)
    .get("/test", test)
)

export default routes

