import { getMailContent, getMaiList, takeAndRemove } from "./utils";
import { consola } from "consola";
import { Settings } from "../core/config";
import { MistralAgentLetter, MastraAgentLetter } from "./mistral";
import { _send } from "./nodemailer";
var memoryLetter = [];

async function scheduleNow() {
  let lists = await getMaiList();
  let CC_LIMIT = Number(Settings?.SEND?.CC_LIMIT || 100);
  let total = lists?.length;
  // Number of rotate
  let rotate = Math.round(lists?.length / CC_LIMIT);
  if (CC_LIMIT > lists?.length) {
    rotate = 1;
  }

  let waitIndexArray = lists.slice(0, rotate);
  let sendIndex: number = 1;

  consola.log("🔄 Sending, please wait ...\n");
  for await (let index of waitIndexArray) {
    try {
      let mailist = takeAndRemove(lists, CC_LIMIT);
      let HTML_CONTENT = await getMailContent();
      let use_ai = process.env.USE_AI === "true";
      // console.info("USE AI :", use_ai);
      if (use_ai) {
        HTML_CONTENT = await MistralAgentLetter().catch((err) =>
          getMailContent()
        );
      }
      await _send(
        {
          bcc: mailist.elements,
          html: HTML_CONTENT,
        },
        Number(sendIndex)
      );
    } catch (err: any) {
      consola.error(err?.message);
    }
    sendIndex++;
  }
  console.log("\n");
  consola.log(`FINISH ${total}  ✅`);
}

export { scheduleNow };
