async function sendImage(
  identificator: string,
  phoneNumber: string,
  imageUrl: string,
  caption: string = ""
): Promise<Boolean> {
  const { status } = await this.sessions[identificator].sendMessage(
    phoneNumber,
    {
      image: { url: imageUrl },
      caption,
    }
  );
  if (status !== 1) return false;

  return true;
}

export default sendImage;
