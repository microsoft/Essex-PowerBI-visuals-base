# Essex PBI Base

Utilities for creating custom visuals

# Notes
## Bundling
Implementers should mark powerbi as an externally loaded resource so that the PowerBI client codebase
is not bundled into custom visuals.

```
externals: {
  "powerbi-visuals/lib/powerbi-visuals": "powerbi"
}
```
