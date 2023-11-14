import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ConvertNumber from "App/Services/Baileys/Utils/ConvertNumber";
import WaManager from "App/Services/Baileys/WaManager";
import SendImageValidator from "App/Validators/Wa/SendImageValidator";
import SendMessageValidator from "App/Validators/Wa/SendMessageValidator";

export default class WasController {
  public async sendMessage({ request, response }: HttpContextContract) {
    try {
      await request.validate(SendMessageValidator);
      let { phoneNumber, message } = await request.only([
        "phoneNumber",
        "message",
      ]);
      const token: any = await request.header("Authorization");

      phoneNumber = ConvertNumber(phoneNumber);

      console.log(WaManager);

      const messageStatus: Promise<Boolean> = WaManager.sendMessage(
        token,
        phoneNumber,
        message
      );

      if (!messageStatus)
        return response.badRequest({
          Message: "Não foi possível enviar a mensagem.",
        });

      return response.ok({ Message: "Mensagem enviada com sucesso." });
    } catch (error) {
      console.log(`WasController sendMessage: ${error}`);
      if (error.messages) return response.badRequest(error.messages);
      return response.badRequest({
        Message:
          "Parece que houve um erro no servidor, tente novamente mais tarde.",
      });
    }
  }

  public async sendImage({ request, response }: HttpContextContract) {
    try {
      await request.validate(SendImageValidator);
      let { phoneNumber, imageUrl, caption } = await request.only([
        "phoneNumber",
        "imageUrl",
        "caption",
      ]);
      const token: any = await request.header("Authorization");

      phoneNumber = ConvertNumber(phoneNumber);

      const messageStatus: Promise<Boolean> = WaManager.sendImage(
        token,
        phoneNumber,
        imageUrl,
        caption
      );

      if (!messageStatus)
        return response.badRequest({
          Message: "Não foi possível enviar a imagem.",
        });

      return response.ok({ Message: "Imagem enviada com sucesso." });
    } catch (error) {
      console.log(`WasController sendImage: ${error}`);
      if (error.messages) return response.badRequest(error.messages);
      return response.badRequest({
        Message:
          "Parece que houve um erro no servidor, tente novamente mais tarde.",
      });
    }
  }
  public async qrcode({ request, response, view, auth }: HttpContextContract) {
    try {
      const token: string | any = await request.header("Authorization");
      WaManager.create(token);
      return await view.render("qrcode");
    } catch (error) {
      console.log(`WasController qrcode: ${error}`);
      if (error.messages) return response.badRequest(error.messages);
      return response.badRequest({
        Message:
          "Parece que houve um erro no servidor, tente novamente mais tarde.",
      });
    }
  }
}
