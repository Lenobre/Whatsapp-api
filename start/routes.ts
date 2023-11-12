/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";
import WaManager from "App/Services/Baileys/WaManager";

Route.group(() => {
  Route.group(() => {
    Route.post("/register", "AuthController.register");
    Route.post("/login", "AuthController.login");
    Route.post("/logout", "AuthController.logout").middleware("auth");
  }).prefix("/auth");

  Route.group(() => {
    Route.get("/qrcode", async ({ view, request }) => {
      const token: string | any = await request.header("Authorization");
      WaManager.create(token);
      return await view.render("qrcode");
    }).middleware("auth");
    Route.post("/sendMessage", "WasController.sendMessage").middleware("auth");
    Route.post("sendImage", "WasController.sendImage").middleware("auth");
  }).prefix("/wa");
}).prefix("/api");
