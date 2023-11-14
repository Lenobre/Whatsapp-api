import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import CredentialValidator from "App/Validators/Auth/CredentialValidator";

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    try {
      await request.validate(CredentialValidator);

      const credentials = await request.only(["email", "password"]);

      let user = await User.findBy("email", credentials.email);
      if (user != null)
        return response.badRequest({
          Message: "Já existe um usuário com este e-mail registrado.",
        });

      user = await User.create(credentials);
      if (user === null)
        return response.badRequest({
          Message: "Não foi possível criar o usuário.",
        });

      const token = await auth.attempt(
        credentials.email,
        credentials.password,
        {
          expiresIn: "5 days",
        }
      );
      if (!token)
        return response.badRequest({
          Message:
            "Não foi possível gerar o token de autorização, tente novamente mais tarde.",
        });

      return response.created({
        Message: "Usuário registrado com sucesso.",
        Token: token,
      });
    } catch (error) {
      console.log(`AuthController Register: ${error}`);
      if (error.messages) return response.badRequest(error.messages);
      return response.badRequest({
        Message: "Tente novamente mais tarde, houve um erro no servidor.",
      });
    }
  }
  public async login({ auth, request, response }: HttpContextContract) {
    try {
      await request.validate(CredentialValidator);

      const credentials = await request.only(["email", "password"]);

      const user = await User.findBy("email", credentials.email);
      if (!user)
        return response.badRequest({
          Message: "Nenhum usuário foi encontrado.",
        });

      await Database.from("api_tokens").where("user_id", user.id).delete();

      const token = await auth.attempt(
        credentials.email,
        credentials.password,
        {
          expiresIn: "5 days",
        }
      );

      if (!token)
        return response.badRequest({
          Message:
            "Não foi possível gerar o token de autorização, tente novamente mais tarde.",
        });

      return response.ok({
        Message: "Usuário logado com sucesso.",
        Token: token,
      });
    } catch (error) {
      console.log(`AuthController Login: ${error}`);
      if (error.messages) return response.badRequest(error.messages);
      return response.badRequest({
        Message: "Tente novamente mais tarde, houve um erro no servidor.",
      });
    }
  }
  public async logout({ auth, request, response }: HttpContextContract) {
    try {
      await auth.use("api").revoke();
      return response.ok({ Message: "Usuário deslogado com sucesso." });
    } catch (error) {
      console.log(`AuthController Logout: ${error}`);
      if (error.messages) return response.badRequest(error.messages);
      return response.badRequest({
        Message: "Tente novamente mais tarde, houve um erro no servidor.",
      });
    }
  }
}
