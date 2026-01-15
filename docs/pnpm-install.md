corepack enable
pnpm --version
corepack prepare pnpm@latest --activate

# pnpm is Hard to Type – So Set Up an Alias

alias s=pnpm

# Choose which packages are allowed to run scripts:

pnpm approve-builds
