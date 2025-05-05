# Sonar Bulk 1.0

## Instruction

## 1- Download and install nodejs via nvm:

```bash
# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
# in lieu of restarting the shell
\. "$HOME/.nvm/nvm.sh"
# Download and install Node.js:
nvm install 22
```

## 2- Install BunJs

```bash
curl -fsSL https://bun.sh/install | bash
```

### 3- Install dependencies on root projet

```bash
bun install
```

### 4- Variable env

Rename .env.example to .env

### 5- Start Sending

```bash
bun run send
```

### 6- Update all

```bash
git pull
```

# Bonus

## Send via socks5

ssh -N -D 1080 user@IP_VPS
SMTP_PROXY=socks://localhost:1080
