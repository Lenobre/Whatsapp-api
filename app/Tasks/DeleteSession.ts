import Database from "@ioc:Adonis/Lucid/Database";
import WaManager from "App/Services/Baileys/WaManager";
import {
  BaseTask,
  CronTimeV2,
} from "adonis5-scheduler/build/src/Scheduler/Task";
import { DateTime } from "luxon";

export default class DeleteSession extends BaseTask {
  public static get schedule() {
    // Use CronTimeV2 generator:
    return CronTimeV2.everyMinute();
    // or just use return cron-style string (simple cron editor: crontab.guru)
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmp/adonis5-scheduler/locks/your-class-name`
   */
  public static get useLock() {
    return true;
  }

  public async handle() {
    this.logger.info("Deleting inactive sockets.");
    (await Database.from("api_tokens")).forEach(async (value) => {
      const expirestAt = DateTime.fromSQL(value.expires_at, {
        zone: "America/Sao_Paulo",
      });
      const now = DateTime.now().setZone("America/Sao_Paulo");
      const diff = now.diff(expirestAt, "minutes").minutes;

      // Deleta sessões que já passaram 30 minutos sem ter o token atualizado
      if (diff >= 30) {
        delete WaManager.sessions[value.token];
        await Database.from("api_tokens").where("id", value.id).delete();
      }
    });
    this.logger.info("Deleted inactive sockets.");
  }
}
