# Artsy CLI Open

Open Artsy links with iOS, Android or the browser.

## Usage

**With an alias:**

```
artsy open artwork
```

opens https://www.artsy.net/artwork/banksy-love-rat-signed-16 on iOS

**With a path:**

```
artsy open /artwork/andy-warhol-watercolor-paint-kit-with-brushes-11
```

opens https://www.artsy.net/artwork/andy-warhol-watercolor-paint-kit-with-brushes-11 on iOS

**With a full URL:**

```
artsy open https://www.staging.artsy.net/artwork/andy-warhol-watercolor-paint-kit-with-brushes-11
```

opens https://www.staging.artsy.net/artwork/andy-warhol-watercolor-paint-kit-with-brushes-11 on iOS

**With flags:**

```
artsy open artwork -a -l
```

opens localhost:3000/artwork/banksy-love-rat-signed-16 on Android

**With custom variables:**

```
artsy open artist artistID:andy-warhol
```

opens https://www.artsy.net/artist/andy-warhol on Android

## Config

All aliases and defaults can be found [here](src/lib/open/data/config.json).

The config can be overriden by providing `~/.config/artsy-open.json`. Just copy the config from GitHub and modify it:

```
curl https://raw.githubusercontent.com/artsy/cli/master/src/lib/open/data/config.json > ~/.config/artsy-open.json
```
