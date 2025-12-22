# FABRIC Codex Plugins

Official plugin registry for [FABRIC Codex](https://frame.dev/codex) - the structured knowledge repository viewer.

## Available Plugins

| Plugin | Description | Type |
|--------|-------------|------|
| [Pomodoro Timer](./plugins/pomodoro-timer/) | Focus timer using the Pomodoro Technique | Widget |

## Installing Plugins

1. Open FABRIC Codex
2. Go to **Settings** → **Plugins**
3. Browse the community plugins or paste a plugin URL
4. Click **Install**

## Creating Plugins

Want to create your own plugin? Check out our [Plugin Development Guide](https://frame.dev/docs/plugins).

### Plugin Structure

```
my-plugin/
├── manifest.json    # Plugin metadata and settings
├── main.js          # Plugin code
└── styles.css       # Optional styles
```

### manifest.json Example

```json
{
  "id": "com.yourname.my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "What your plugin does",
  "author": "Your Name",
  "minFabricVersion": "1.0.0",
  "main": "main.js",
  "styles": "styles.css",
  "type": "widget",
  "position": "sidebar"
}
```

### Plugin Types

- **widget** - Sidebar or floating widget (e.g., Pomodoro Timer)
- **renderer** - Custom markdown renderer (e.g., Citation Manager)
- **processor** - Content processor (transforms content before display)
- **theme** - Visual theme extension
- **panel** - Full sidebar panel
- **toolbar** - Toolbar button/menu
- **command** - Keyboard command only (no UI)

## Contributing

1. Fork this repository
2. Create your plugin in `plugins/your-plugin-name/`
3. Add your plugin to `registry.json`
4. Submit a Pull Request

## License

MIT License - See [LICENSE](./LICENSE) for details.
