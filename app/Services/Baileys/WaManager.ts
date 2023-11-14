import sendMessage from "./Functions/sendMessage";
import create from "./Functions/create";
import sendImage from "./Functions/sendImage";

const WaManager = {
  sessions: {},

  create,
  sendMessage,
  sendImage,
};

export default WaManager;
