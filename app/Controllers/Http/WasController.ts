import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import WaManager from "App/Services/Baileys/WaManager";
import SendImageValidator from "App/Validators/Wa/SendImageValidator";
import SendMessageValidator from "App/Validators/Wa/SendMessageValidator";

export default class WasController {
  public async sendMessage({ request, response }: HttpContextContract) {
    await request.validate(SendMessageValidator);
    const { phoneNumber, message } = await request.only([
      "phoneNumber",
      "message",
    ]);

    const messageStatus = WaManager.sendMessage(
      "leandro",
      phoneNumber,
      message
    );

    if (!messageStatus)
      return response.badRequest({
        Message: "Não foi possível enviar a mensagem.",
      });

    return response.badRequest({ Message: "Mensagem enviada com sucesso." });
  }

  public async sendImage({ request, response }: HttpContextContract) {
    await request.validate(SendImageValidator);
    const { phoneNumber, imageUrl, caption } = await request.only([
      "phoneNumber",
      "imageUrl",
      "caption",
    ]);

    const messageStatus = WaManager.sendImage(
      "leandro",
      phoneNumber,
      imageUrl,
      caption
    );
  }
}
