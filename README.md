# tab-namer

A [Herdr](https://herdr.dev) mod that renames the active tab with a short AI-generated name, lowercase
and joined with underscores (`fix_login_api`), plus an optional patch so the **Agents** section shows
the tab name and, below it, the space it belongs to.

## How it works

When opened, the mod reads the last lines of the active tab's terminal screen, its folder, its title and
the space name, passes them to `claude -p --model haiku` and renames the tab with `tab.rename`. It
answers with 1 to 3 words, no spaces or accents, 24 characters at most. It opens and closes itself.

## Install

Ask your agent: *"Read ~/.config/herdr-app/AGENTS.md, then add this mod:
github.com/alfonsoHR98/herdr-tab-namer"*. Or by hand:

```sh
cp -R mods/tab-namer ~/.config/herdr-app/mods/
herdr-app check ~/.config/herdr-app/mods/tab-namer
```

The full brief to rebuild it from scratch is in [RECIPE.md](RECIPE.md).

Merge [keys.json](keys.json) into yours (`alt-shift-n` renames the active tab).

### Optional patch: two-line Agents rows and a ✦ button

[agents-two-line-rows.patch](agents-two-line-rows.patch) changes the `agents` mod that ships with
Herdr: each row shows the tab name on top and its space below (in gray), and the header gains a ✦
button that opens `tab-namer`. Made against Herdr App 0.1.13; if your `agents` differs, apply it by hand.

```sh
cd ~/.config/herdr-app && patch -p1 < path/to/agents-two-line-rows.patch
```

## Requirements and what it touches

- `claude` (Claude Code) installed and signed in. It uses your account.
- **Privacy:** a fragment of the terminal screen (up to about 60 lines), the folder, the title and the
  space name are sent to Claude. Don't name a tab with this if it shows sensitive data.
- It runs `hc read` (reads the screen) and `claude`; it makes no network calls of its own and stores
  no files.

## Limits

- It only renames the active tab, one at a time.
- If `claude` fails (expired sign-in, no network), it notifies you and changes nothing.

Code: MIT.
