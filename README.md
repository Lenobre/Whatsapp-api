
# Whatsapp Api

Api criada para o aplicativo de mensagens **Whatsapp**, é feita uma conexão com o websocket, deste modo, podendo desta forma, ler mensagens, enviar mensagens (imagem, arquivos...), pegar contatos salvos...

## Stack utilizada

Técnologias principalmente usadas.

**Back-end:** Node, Adonisjs, Baileys, Redis e Mysql(Ainda não foi adicionado, temporariamente utilizando mysql).



## Funcionalidades

Algumas das funcionalidades já prontas. Aceito ideias.

Concluído: ✅ Não pronto: ❌

- Login via qrcode ✅
- Enviar mensagem de texto ✅
- Enviar mensagem com imagem ✅
- Enviar mensagem com vídeo ❌
- Enviar mensagem com outros arquivos(excel, pdf) ❌






## Documentação da API

### Auth
**Nota:** Em breve será alterado, autenticação simples apenas para testes.
#### Registrar usuário

```http
  POST /api/auth/register
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. |
| `password` | `string` | **Obrigatório**. |

#### Resposta
Se um usuário com o e-mail já existir, retorna um bad request.
```json
{
    "Message": "Já existe um usuário com este e-mail registrado.",
}
```
Se não foi possível salvar o usuário, retorna um bad request.
```json
{
    "Message": "Não foi possível criar o usuário.",
}
```
Caso o usuário tenha sido registrado com **sucesso** e não houve nenhum outro erro.
```json
{
    "Message": "Usuário registrado com sucesso.",
    "Token": {
	    "type": "bearer",
	    "token": "...",
	    "expires_at": "2023-23-23T23:23:23.159-03:00"
	}
}
```

#### Logar usuário

```http
  POST /api/auth/login
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email` | `string` | **Obrigatório**. |
| `password` | `string` | **Obrigatório**. |

#### Respostas
Se o usuário não existir, retorna um bad request.
```json
{
    "Message": "Nenhum usuário foi encontrado.",
}
```
Se o usuário for logado com sucesso.
```json
{
    "Message": "Usuário logado com sucesso.",
    "Token": {
	    "type": "bearer",
	    "token": "...",
	    "expires_at": "2023-23-23T23:23:23.159-03:00"
	}
}

#### Deslogar usuário

```http
  POST /api/auth/logout
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token` | `string` | **Obrigatório**. Enviado no header. |

#### Respostas
Se o usuário for deslogado com sucesso.
```json
{
    "Message": "Usuário deslogado com sucesso."
}
```

#### Respostas genéricas
Se não foi possível gerar o token, retorna um bad request.
```json
{
    "Message": "Não foi possível gerar o token de autorização, tente novamente mais tarde.",
}
```
### Wa (Whatsapp Routes)
**Nota:** A rota de geração de qrcode está sujeita a mudanças, pois, ao fazer um teste com axios por usar websocket para a transimissão do qrcode não foi possível obter o mesmo.
#### Gerar qrcode
```http
  GET /api/wa/qrcode
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token` | `string` | **Obrigatório**. Enviado no header. |

### Respostas
Retorna uma view que por sua vez recebe o qrcode por websocket, é possível visualizar usando o "getIt (Exec. para testes de rotas)" ou selenium.

#### Enviar mensagem
```http
  POST /api/wa/sendMessage
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token` | `string` | **Obrigatório**. Enviado no header. |
| `phoneNumber` | `string` | **Obrigatório**. Necessário enviar em json, o número junto ao código do país. |
| `message` | `string` | **Obrigatório**. Texto a ser enviado.|

#### Respostas
Caso a mensagem não seja enviada, retorna um bad request.
```json
{
    "Message": "Não foi possível enviar a mensagem.",
}
```
Se a mensagem for enviada com sucesso
```json
{
    "Message": "Mensagem enviada com sucesso.",
}
```
#### Enviar imagem
```http
  POST /api/wa/sendImage
```
| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `token` | `string` | **Obrigatório**. Enviado no header. |
| `phoneNumber` | `string` | **Obrigatório**. Necessário enviar em json, o número junto ao código do país. |
| `imageUrl` | `string` | **Obrigatório**. Url da imagem.|
| `caption` | `string` | Texto para a imagem. |

#### Respostas
Caso a mensagem não seja enviada, retorna um bad request.
```json
{
    "Message": "Não foi possível enviar a imagem.",
}
```
Se a mensagem for enviada com sucesso
```json
{
    "Message": "Imagem enviada com sucesso.",
}
```
