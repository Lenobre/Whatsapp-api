async function sendMessage(
  identificator: string,
  phoneNumber: string,
  message: string
): Promise<Boolean> {
  const { status } = await this.sessions[identificator].sendMessage(
    phoneNumber,
    {
      text: message,
    }
  );
  if (status !== 1) return false;

  return true;
}

export default sendMessage;
