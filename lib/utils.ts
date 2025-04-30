import path from "path";
import fs from "fs-extra";
import { consola } from "consola";
import { Settings } from "../core/config";
import { v4 } from "uuid";

function isEmail(str: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

function replaceAllWithUuid(str: string, search: string) {
  // Échappe les caractères spéciaux de la sous-chaîne
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "g");

  // La fonction de remplacement génère un UUID différent à chaque appel
  return str.replace(regex, () => v4());
}

function getMailContent() {
  let LETTER_PATH = path.join(
    process.cwd(),
    "data",
    String(process?.env.LETTER_FILE)
  );
  let letterContent = fs.readFileSync(LETTER_PATH, "utf-8");

  letterContent = replaceAllWithUuid(letterContent, "_uuid_");
  return letterContent;
}

async function getMaiList(): Promise<Array<string>> {
  return new Promise(async (resolve, reject) => {
    try {
      let LIST_PATH = path.join(process.cwd(), "data", Settings.DATA.LIST);
      const listContent = fs.readFileSync(LIST_PATH, "utf-8");
      var list = listContent.split("\n").map((e) => e.trim());
      list = list.filter((e) => e.trim() !== "" && e);
      //  list = [...new Set(list)];
      let finalList = [] as Array<string>;
      list.map((email) => {
        if (isEmail(email)) {
          finalList.push(email);
        }
      });
      // console.log("OK");
      return resolve(finalList);
    } catch (err: any) {
      consola.error("ERROR::LISTMAIL", err?.message);
      reject(err);
    }
  });
}

function takeAndRemove(
  arr: Array<string>,
  n: number
): { elements: Array<string>; arr: Array<string> } {
  const removedElements = arr.splice(0, n);
  return {
    elements: removedElements,
    arr: arr,
  };
}
function extractHtmlContent(input: string) {
  if (!input) return getMailContent();
  const match = input.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return input.trim();
}

export {
  getMailContent,
  isEmail,
  getMaiList,
  takeAndRemove,
  extractHtmlContent,
};
