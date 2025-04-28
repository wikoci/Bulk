import { Settings } from "../core/config";
import { createTransport } from "nodemailer";
import type { SendMailOptions } from "nodemailer";
import { consola } from "consola";
import "@colors/colors";
import { convert } from "html-to-text";
import { v4 } from "uuid";
import socks from "socks";
async function _verifySmtp() {
  return new Promise(async (resolve, reject) => {
    //console.log("Settings", Settings.SMTP);
    try {
      let proxy: any = Settings?.SMTP?.PROXY || "";
      proxy = proxy?.replace(/\s/g, "")?.trim() || false;
      if (!proxy?.length || !proxy) {
        proxy = false;
      }
      const transport = createTransport({
        host: Settings.SMTP.HOST,
        port: Number(Settings.SMTP?.PORT),
        secure: Boolean(Settings.SMTP?.SECURE || false),
        auth: {
          user: Settings?.SMTP?.USER,
          pass: Settings?.SMTP?.PASSWORD,
        },
        proxy: proxy ? proxy : null,
      });

      if (proxy) {
        transport.set("proxy_socks_module", socks);
      }

      let response = await transport.verify();
      consola.log("SMTP OK ✅ ");
      resolve(response);
    } catch (err: any) {
      consola.error("SMTP ERROR ❌ ", err?.message);
      reject(err);
    }
  });
}

async function _send(options: SendMailOptions, index: number) {
  options.from = `${Settings.SEND.NAME} <${Settings.SEND.FROM}>`;
  options.text = convert(options?.html || "", {
    wordwrap: 130,
  });
  options.subject = Settings.SEND.SUBJECT;
  options.to = Settings.SEND.DEFAULT_TO;
  options.replyTo = Settings.SEND.REPLY_TO;
  options.date = new Date().toUTCString();
  options.messageId = v4();
  options.headers = {
    "message-id": v4(),
    "List-Unsubscribe": "<mailto:?subject=unsubscribe>",
  };

  options.messageId = v4();
  return new Promise(async (resolve, reject) => {
    try {
      let time_out = Number(Settings?.SEND?.TIMEOUT || 5);

      let proxy: any = Settings?.SMTP?.PROXY || "";
      proxy = proxy?.replace(/\s/g, "")?.trim() || false;

      if (!proxy?.length || !proxy) {
        proxy = false;
      }

      setTimeout(async () => {
        const transport = createTransport({
          host: Settings.SMTP.HOST,
          port: Number(Settings.SMTP?.PORT),
          secure: Boolean(Settings.SMTP?.SECURE || false),
          proxy: proxy,
          auth: {
            user: Settings?.SMTP?.USER,
            pass: Settings?.SMTP?.PASSWORD,
          },
        });
        if (proxy) {
          transport.set("proxy_handler_socks5", socks);
        }
        let use_ai = process.env.USE_AI === "true";
        let response = await transport.sendMail(options);
        consola.log(`[${index}] | AI = ${Boolean(use_ai)} | SEND ✅ `.gray);
        resolve(response);
      }, time_out * 1000);
    } catch (err: any) {
      consola.error(`${index}- SEND ERROR ❌ `);
      reject(err?.message);
    }
  });
}

export { _verifySmtp, _send };
