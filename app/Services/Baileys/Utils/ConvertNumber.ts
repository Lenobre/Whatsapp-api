// Identifica se o número informmado é realmente um núemro de telefone ou o id de um grupo
// Caso seja o id de um grupo, é adicionado o seguinte: @g.us e se não for @s.whatsapp.net
const convertNumber = (phoneNumber: string): string => {
  if (phoneNumber.length > 15) {
    return `${phoneNumber}@g.us`;
  } else {
    return `${phoneNumber}s.whatsapp.net`;
  }
};
