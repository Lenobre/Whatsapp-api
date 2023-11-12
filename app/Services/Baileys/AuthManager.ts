import Redis from "@ioc:Adonis/Addons/Redis";

import { BufferJSON, initAuthCreds, proto } from "@whiskeysockets/baileys";

const AuthManager = async (identificator: string) => {
  const writeData = async (data: any, key: string) => {
    try {
      await Redis.set(
        `${identificator}:${key}`,
        JSON.stringify(data, BufferJSON.replacer)
      );
    } catch (error) {
      console.log(`writeData: ${error}`);
    }
  };

  const readData = async (key: string) => {
    try {
      const data: any = await Redis.get(`${identificator}:${key}`);
      if (data) {
        return JSON.parse(data, BufferJSON.reviver);
      }
    } catch (error) {
      console.log(`readData: ${error}`);
      return null;
    }
  };

  const removeData = async (key: string) => {
    try {
      await Redis.del(`${identificator}:${key}`);
    } catch (error) {
      console.log(`removeData: ${error}`);
    }
  };

  const fixKeyName = (key?: string) =>
    key?.replace(/\//g, "__")?.replace(/:/g, "-");

  const creds: any = (await readData("")) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: any = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`);
              if (type === "app-state-sync-key" && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }

              data[id] = value;
            })
          );

          return data;
        },
        set: async (data) => {
          const tasks: Promise<void>[] = [];
          for (const category in data) {
            for (const id in data[category]) {
              const value = data[category][id];
              const key = `${category}-${id}`;
              tasks.push(value ? writeData(value, key) : removeData(key));
            }
          }

          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => {
      return writeData(creds, "");
    },
  };
};

export default AuthManager;
