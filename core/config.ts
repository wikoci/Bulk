const Settings = {
  SMTP: {
    // Config SMTP server
    HOST: process.env.SMTP_HOST,
    PORT: Number(process.env.SMTP_PORT),
    SECURE: process.env.SMTP_SECURE === "true",
    USER: process.env.SMTP_USER,
    PASSWORD: process.env.SMTP_PASS,
    PROXY: process.env.SMTP_PROXY,
  },
  SEND: {
    NAME: process.env.FROM_NAME,
    FROM: process.env.FROM_EMAIL,
    SUBJECT: process.env.SUBJECT,
    CC_LIMIT: process.env.CC_LIMIT,
    DEFAULT_TO: process.env.DEFAULT_TO,
    REPLY_TO: process.env.REPLY_TO,
    TIMEOUT: process.env.TIMEOUT, // seconds
  },
  DATA: {
    // data
    LIST: process.env.LIST_FILE,
    LETTER: process.env.LETTER_FILE,
  },
  AI: {
    // AI config
    INSTRUCTION_SUBJECT: process.env.SUBJECT_PROMPT,
    INSTRUCTION_LETTER: process.env.LETTER_PROMPT,
  },
  API_KEY: {
    // API_KEY
    MISTRAL: process.env.API_KEY_MISTRAL,
    OPENAI: process.env.API_KEY_OPENAI,
  },
};

export { Settings };
