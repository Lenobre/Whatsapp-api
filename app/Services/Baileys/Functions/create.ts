import openConnection from "./openConnection";

async function create(identificator: string) {
  if (identificator in this.sessions) {
    this.sessions[identificator].ws.close();
    delete this.sessions[identificator];
  }
  this.sessions[identificator] = await openConnection(identificator);
}

export default create;
