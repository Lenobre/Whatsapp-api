import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import WaManager from "App/Services/Baileys/WaManager";
import SendImageValidator from "App/Validators/Wa/SendImageValidator";
import SendMessageValidator from "App/Validators/Wa/SendMessageValidator";

export default class WasController {
  public async sendMessage({ request, response }: HttpContextContract) {
    await request.validate(SendMessageValidator);
    let { phoneNumber, message } = await request.only([
      "phoneNumber",
      "message",
    ]);
    const token: any = await request.header("Authorization");

    phoneNumber = convertNumber(phoneNumber);

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
  }

  public async sendImage({ request, response }: HttpContextContract) {
    await request.validate(SendImageValidator);
    let { phoneNumber, imageUrl, caption } = await request.only([
      "phoneNumber",
      "imageUrl",
      "caption",
    ]);
    const token: any = await request.header("Authorization");

    phoneNumber = convertNumber(phoneNumber);

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
  }
}
