# Sonar Bulk 1.0

## Instruction

### 1- Install dependencies

```bash
bun install
```

### 2- Rename .env.example to .env

### 3- Start Sending

```bash
bun run send
```

# Bonus

## Send via socks5

ssh -N -D 1080 user@IP_VPS
SMTP_SPROX=socks://localhost:1080
