# Quarry Community Plugins

Official community plugin repository for [Quarry](https://github.com/framersai/quarry) — the open-source AI-native personal knowledge management system.

## What is Quarry?

Quarry is the open-source edition of Frame.dev's knowledge management platform, featuring:
- Knowledge graph visualization
- Semantic search
- Full plugin & theme support
- Markdown rendering with custom extensions
- Offline-first architecture

## Installing Plugins

### From the Registry (Recommended)

1. Open Quarry and click the **Plugins** tab in the sidebar
2. Click **Browse Registry**
3. Find the plugin you want and click **Install**

### From URL

1. Go to the **Plugins** tab
2. Click **Install from URL**
3. Paste the plugin's ZIP URL (e.g., `https://github.com/user/plugin/releases/download/v1.0.0/plugin.zip`)

### Manual Installation

1. Download the plugin ZIP file
2. Go to **Plugins** → **Install from ZIP**
3. Select the downloaded file

## Creating Plugins

### Quick Start

```bash
# Clone the template
git clone https://github.com/quarry-plugins/template-widget my-plugin
cd my-plugin

# Edit manifest.json with your plugin details
# Write your plugin code in main.ts

# Build (if using TypeScript)
npm install && npm run build

# Test locally by installing via ZIP in Quarry
```

### Plugin Structure

```
my-plugin/
├── manifest.json    # Required: Plugin metadata
├── main.js          # Required: Plugin entry point
├── styles.css       # Optional: Plugin styles
└── README.md        # Recommended: Documentation
```

### manifest.json

```json
{
  "id": "com.yourname.plugin-name",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "What your plugin does",
  "author": "Your Name",
  "authorUrl": "https://yoursite.com",
  "minQuarryVersion": "1.0.0",
  "main": "main.js",
  "styles": "styles.css",
  "type": "widget",
  "position": "sidebar",
  "settings": {
    "mySetting": {
      "type": "boolean",
      "default": true,
      "label": "Enable Feature",
      "description": "Toggle this feature on/off"
    }
  }
}
```

### Plugin Types

| Type | Description | Position Options |
|------|-------------|------------------|
| `widget` | Sidebar panel with custom UI | `sidebar`, `sidebar-bottom` |
| `renderer` | Custom markdown rendering | `content` |
| `processor` | Content transformation | N/A |
| `theme` | Visual theming | N/A |
| `panel` | Full panel component | `sidebar`, `floating` |
| `toolbar` | Toolbar buttons/menus | `toolbar` |
| `command` | Keyboard commands | N/A |

### Plugin API

```typescript
class MyPlugin extends QuarryPlugin {
  async onLoad() {
    // Register a sidebar widget
    this.api.registerSidebarWidget(MyWidgetComponent)

    // Register a command
    this.api.registerCommand({
      id: 'my-command',
      name: 'Do Something',
      hotkey: 'Ctrl+Shift+M',
      callback: () => this.doSomething()
    })

    // Register custom markdown syntax
    this.api.registerMarkdownRenderer({
      pattern: /\[\[(.+?)\]\]/g,
      component: WikiLinkRenderer,
      priority: 10
    })

    // Listen to events
    this.api.on('navigate', (path) => {
      console.log('Navigated to:', path)
    })

    // Store data
    this.store('myKey', { some: 'data' })
  }

  async onUnload() {
    // Cleanup
  }

  onSettingsChange(key: string, value: any) {
    // React to setting changes
  }
}
```

### Available API Methods

```typescript
interface QuarryPluginAPI {
  // Navigation
  navigateTo(path: string): void
  openFile(path: string): Promise<void>

  // Content
  getContent(): string
  getMetadata(): StrandMetadata

  // UI
  showNotice(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void
  showModal(options: ModalOptions): Promise<boolean>

  // Storage (per-plugin)
  getData<T>(key: string): T | null
  setData<T>(key: string, value: T): void

  // Events
  on(event: EventType, callback: Function): () => void

  // Registration
  registerSidebarWidget(component: React.ComponentType): void
  registerToolbarButton(options: ToolbarButtonOptions): void
  registerCommand(options: CommandOptions): void
  registerMarkdownRenderer(options: RendererOptions): void

  // Context
  getContext(): PluginContext
}
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `navigate` | `{ path: string }` | User navigated to a page |
| `contentLoad` | `{ content: string, metadata: object }` | Content loaded |
| `settingsChange` | `{ key: string, value: any }` | Plugin setting changed |
| `themeChange` | `{ theme: string }` | Theme changed |
| `search` | `{ query: string }` | Search performed |

## Contributing

### Submitting a Plugin

1. Fork this repository
2. Create your plugin in `plugins/your-plugin-name/`
3. Ensure your plugin has:
   - Valid `manifest.json`
   - Working `main.js`
   - `README.md` with usage instructions
4. Add your plugin to `registry.json`
5. Submit a Pull Request

### Guidelines

- **ID Format**: Use reverse domain notation: `com.yourname.plugin-name`
- **Versioning**: Follow [semver](https://semver.org/)
- **Compatibility**: Specify accurate `minQuarryVersion`
- **Documentation**: Include clear README with examples
- **Testing**: Test your plugin thoroughly before submitting
- **No Malware**: Plugins must not contain malicious code

### Validation

All PRs are automatically validated:
- Manifest schema validation
- Version compatibility check
- Basic security scan
- Build verification

## Official Plugins

| Plugin | Type | Description |
|--------|------|-------------|
| [Pomodoro Timer](plugins/pomodoro-timer) | widget | Focus timer with work/break cycles |
| [Citation Manager](plugins/citation-manager) | renderer + widget | Academic citation support |
| [Custom Callouts](plugins/custom-callouts) | renderer | Styled callout blocks |

## License

All plugins in this repository are licensed under the [MIT License](LICENSE) unless otherwise specified.

## Support

- [Quarry Documentation](https://quarry.frame.dev/docs)
- [Plugin Development Guide](https://quarry.frame.dev/docs/plugins)
- [Discord Community](https://discord.gg/quarry)
- [GitHub Issues](https://github.com/quarry-plugins/quarry-plugins/issues)
