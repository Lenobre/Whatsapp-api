import makeWASocket, { DisconnectReason } from "@whiskeysockets/baileys";
import AuthManager from "../AuthManager";
import Boom from "boom";
import Ws from "App/Services/Webscoket/Ws";
import QRCode from "qrcode";
import Redis from "@ioc:Adonis/Addons/Redis";

async function openConnection(identificator: string) {
  const { state, saveCreds } = await AuthManager(identificator);

  const socket = makeWASocket({
    printQRInTerminal: false,
    auth: state,
  });

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      QRCode.toDataURL(qr, (err, url) => {
        if (err) console.log(err);
        Ws.io.emit("qrcode", url);
      });
    }
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      if (shouldReconnect) {
        openConnection(identificator);
      } else {
        let cursor = "0";
        let foundedKeys: string[] = [];

        do {
          const key = await Redis.scan(cursor, "MATCH", `${identificator}*`);

          cursor = key[0];
          foundedKeys.push(...key[1]);
        } while (cursor !== "0");

        foundedKeys.forEach((key: string, index: number) => {
          Redis.del(key);
        });

        openConnection(identificator);
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}

export default openConnection;
