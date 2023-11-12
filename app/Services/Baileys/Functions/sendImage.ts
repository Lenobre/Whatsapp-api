async function sendImage(
  identificator: string,
  phoneNumber: string,
  url: string,
  caption: string = ""
) {
  this.sessions[identificator].sendMessage(phoneNumber, {
    image: { url },
    caption,
  });
}

export default sendImage;
