import { scheduleNow } from "./bulk";
import { _verifySmtp } from "./nodemailer";
async function runScript() {
  try {
    await _verifySmtp();
    scheduleNow();
  } catch (err: any) {
    console.error(err?.message);
  }
}

export { runScript };
