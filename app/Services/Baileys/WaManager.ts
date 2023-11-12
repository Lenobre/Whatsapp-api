import sendMessage from "./Functions/sendMessage";
import create from "./Functions/create";
import sendImage from "./Functions/sendImage";

const waManager = {
  sessions: {},

  create,
  sendMessage,
  sendImage,
};

export default waManager;
