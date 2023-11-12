async function sendImage(
  identificator: string,
  phoneNumber: string,
  imageUrl: string,
  caption: string = ""
) {
  this.sessions[identificator].sendMessage(phoneNumber, {
    image: { imageUrl },
    caption,
  });
}

export default sendImage;
