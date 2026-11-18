---
name: Halo Automations
description: One team builds everything your business runs on, shown as one hand-bent neon circuit on a dark wall.
colors:
  neon-red: "#ff3045"
  neon-red-hot: "#ff5a69"
  neon-red-rim: "#ff8590"
  neon-red-core: "#ffd5d9"
  neon-red-text: "#ff5263"
  argon-cobalt: "#7d90ff"
  argon-tube: "#6f86ff"
  argon-core: "#e3e8ff"
  room-black: "#0b090a"
  room-black-2: "#100d0f"
  lit-wall: "#131012"
  panel: "#171316"
  panel-2: "#1e191d"
  plaster-cream: "#ede7df"
  cream-muted: "rgba(237, 231, 223, 0.76)"
  cream-soft: "rgba(237, 231, 223, 0.6)"
  line: "rgba(237, 231, 223, 0.1)"
  line-2: "rgba(237, 231, 223, 0.2)"
  tube-outline: "rgba(237, 231, 223, 0.26)"
  unlit-glass: "rgba(237, 231, 223, 0.15)"
  electrode-steel: "#8e9099"
  sleeve-metal: "#6f727b"
  sleeve-band: "#3d3f45"
  cold-tip: "#4a3f43"
  lit-ink: "#170609"
typography:
  display:
    fontFamily: "'Barlow Semi Condensed', 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.7rem, 6.4vw, 5.6rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.012em"
  headline:
    fontFamily: "'Barlow Semi Condensed', 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.2rem, 4.4vw, 3.9rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.012em"
  title:
    fontFamily: "'Barlow Semi Condensed', 'Arial Narrow', sans-serif"
    fontSize: "clamp(24px, 2.4vw, 30px)"
    fontWeight: 700
    lineHeight: 1.05
  lede:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "clamp(17px, 1.35vw, 19px)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "'Barlow', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.005em"
  reading:
    fontFamily: "'Barlow Semi Condensed', 'Arial Narrow', sans-serif"
    fontSize: "clamp(26px, 2.8vw, 34px)"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  measurement:
    fontFamily: "'JetBrains Mono', ui-monospace, Consolas, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  plate: "10px"
  panel-sm: "14px"
  panel: "18px"
  sign: "22px"
  tube: "999px"
spacing:
  gutter-phone: "20px"
  gutter-tablet: "32px"
  gutter-desktop: "48px"
  wrap: "1240px"
  header: "72px"
  section: "clamp(80px, 10vw, 136px)"
  section-closing: "clamp(96px, 12vw, 168px)"
components:
  button-lit:
    backgroundColor: "{colors.neon-red}"
    textColor: "{colors.lit-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.tube}"
    padding: "0 26px"
    height: "54px"
  button-lit-hover:
    backgroundColor: "{colors.neon-red-hot}"
  button-tube:
    backgroundColor: "transparent"
    textColor: "{colors.plaster-cream}"
    typography: "{typography.button}"
    rounded: "{rounded.tube}"
    padding: "0 26px"
    height: "54px"
  button-lit-sm:
    backgroundColor: "{colors.neon-red}"
    textColor: "{colors.lit-ink}"
    rounded: "{rounded.tube}"
    padding: "0 16px"
    height: "40px"
  input-tube:
    backgroundColor: "rgba(14, 11, 13, 0.9)"
    textColor: "{colors.plaster-cream}"
    rounded: "{rounded.tube}"
    padding: "0 16px"
    height: "46px"
  field:
    backgroundColor: "{colors.room-black-2}"
    textColor: "{colors.plaster-cream}"
    rounded: "{rounded.plate}"
    padding: "12px 14px"
    height: "50px"
  spec-plate:
    backgroundColor: "transparent"
    textColor: "{colors.plaster-cream}"
    rounded: "{rounded.plate}"
    padding: "10px 14px"
  panel-calculator:
    backgroundColor: "#0c0a0b"
    textColor: "{colors.plaster-cream}"
    rounded: "{rounded.panel}"
    padding: "clamp(22px, 3vw, 36px)"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.cream-muted}"
    rounded: "{rounded.tube}"
    padding: "6px 12px"
  nav-link:
    textColor: "{colors.cream-muted}"
    padding: "0 14px"
    height: "44px"
  nav-link-active:
    textColor: "{colors.plaster-cream}"
---

# Design System: Halo Automations

## Overview

**Creative North Star: "The Night Wall Circuit"**

A dark room wall at night, warm black with faint plaster grain, carrying one continuous hand-bent neon circuit. Neon red is the gas for signs and for the action; argon cobalt is the gas for live numbers. Everything that is not lit is either the wall, clear unlit glass, or the hardware that holds glass to a wall: electrode sleeves, standoff clips, hooks and feed wires. Display words are not set in a font; they are single-stroke script (EMS Allure, drawn as tube paths) bent as tubes with a light spill, a coloured tube and a white-hot core.

The page reads like signage rather than a product brochure: Barlow Semi Condensed carries statements in road-sign plainness, Barlow carries reading, and the neon script carries the one phrase per heading that the visitor should remember. Density is low; each section is one sign and its spec plate. Motion is electrical: tubes strike with two failed starts before holding, current travels the circuit on scroll, and reduced motion shows everything lit.

The site is dark by binding brand commitment; even a "brighter" section is only a wall lit a little more (#131012). The red halo-ring logo glows as the only lit part of the header.

**Key Characteristics:**
- One continuous circuit links the hero to every service; services are rows on one rail, never a grid of equal cards.
- Light lives only on lit glass and lit controls; panels never glow.
- Two gases only: red for signs and action, argon for live numbers.
- Unlit is a real state (clear glass with a glint), and lighting up is an event.
- Mono appears only on measurements: spec plates, readings, timelines.

## Colors

Warm room black and plaster cream, struck through by two neon gases.

### Primary
- **Neon Red** (`neon-red`): the tube colour of every red sign, the lit button, the circuit current, the logo ring, slider fill, focus rings and selection. Its hotter step **Neon Red Hot** (`neon-red-hot`) is the hover state of a lit button; **Neon Red Rim** (`neon-red-rim`) is the glass rim around a lit button and the outer halo of the current's head; **Neon Red Core** (`neon-red-core`) is the white-hot centre line inside a red tube. **Neon Red Text** (`neon-red-text`) is red used on small icons and link glyphs where pure tube red would read too dark.

### Secondary
- **Argon Cobalt** (`argon-cobalt`): live numbers only. The savings calculator's readings, the report list's indicator dots, and the faint cool wash at the right of the wall. In lettering and the brain's folds the tube is **Argon Tube** (`argon-tube`) with **Argon Core** (`argon-core`).

### Neutral
- **Room Black** (`room-black`): the wall and page background; also the scrollbar track. **Room Black 2** (`room-black-2`) is the recessed fill of text fields.
- **Lit Wall** (`lit-wall`): an alternate section where the wall is lit slightly brighter. It stays dark.
- **Panel** (`panel`, `panel-2`): calculator readings and inputs, the only filled surfaces.
- **Plaster Cream** (`plaster-cream`): primary text. **Cream Muted** (0.76 alpha) for secondary copy and nav, **Cream Soft** (0.6 alpha) for measurement labels and quiet notes.
- **Line / Line 2** (0.1 / 0.2 alpha cream): row dividers and plate, chip and panel borders.
- **Tube Outline** (0.26 alpha cream): the 2px glass outline of an unlit button or input.
- **Unlit Glass** (0.15 alpha cream): the stroke of an unlit neon tube.
- **Hardware** (`electrode-steel`, `sleeve-metal`, `sleeve-band`, `cold-tip`): sleeves, clips, hooks, standoffs and the cold electrode tip of an unlit tube.
- **Lit Ink** (`lit-ink`): text on a lit red surface.

### Named Rules
**The Two Gases Rule.** Red is for signs and the action; argon is for numbers that change with the visitor's input. No third accent colour. The one exception is the WhatsApp icon's green inside the tube button, which is the channel's own mark.

**The Light On Glass Rule.** Glow (spill strokes, drop-shadow halos, text-shadow) belongs only to lit glass: neon lettering, the current, the logo ring, lit buttons and argon readings. Panels, plates and cards are never given a coloured glow.

**The Stays Dark Rule.** No light theme and no light sections. A section that needs separation uses Lit Wall, a divider line, or more space.

## Typography

**Display Font:** Barlow Semi Condensed 600/700 (with Arial Narrow)
**Body Font:** Barlow 400/500/600 (with system-ui)
**Label/Mono Font:** JetBrains Mono 400, measurements only
**Neon Script:** EMS Allure, single stroke, rendered as SVG tube paths by the Neon component, never as a font file

**Character:** Barlow comes from road and rail signage, the sign shop's own lettering, so the grotesk statements and the script tubes look like they came out of one workshop. The grotesk states; the script glows.

### Hierarchy
- **Display** (700, clamp(2.7rem, 6.4vw, 5.6rem), 0.98): inner page titles (title--xl).
- **Headline** (700, clamp(2.2rem, 4.4vw, 3.9rem), 0.98, -0.012em): section titles; the hero and closing headlines sit in the same range (clamp(2.2rem, 4.2vw, 3.7rem) / 3.6rem max). The grotesk lines cap at 13ch in the hero; the neon line takes the full column.
- **Title** (700, clamp(24px, 2.4vw, 30px), 1.05): step and panel headings; list headings at 23px.
- **Lede** (400, clamp(17px, 1.35vw, 19px), 1.6): section intros and the hero line, in Cream Muted, about 62ch.
- **Body** (400, 17px, 1.6): reading text; service lines at 19px / 1.5 within 46ch.
- **Reading** (700 Barlow Semi Condensed, clamp(26px, 2.8vw, 34px), tabular numerals): argon calculator readings; the headline reading runs to clamp(44px, 6vw, 72px).
- **Measurement** (JetBrains Mono 400, 11-12px, 0.08-0.1em, uppercase on plate labels): spec-plate terms, timelines, sources.

### Named Rules
**The Two-Line Title Rule.** A section title is a statement line in Barlow Semi Condensed followed by a second line drawn as neon script (about 1.02em tall). The script line is the phrase to remember, kept short enough to bend as one tube.

**The Mono Measures Rule.** JetBrains Mono appears only where a value is measured or specified: plate labels, "live in" and "you measure" tags, data sources. It never labels sections or sits above headings.

**The Drawn Not Typed Rule.** Neon words are always the Neon component's tube paths, with the real words repeated for screen readers. Never fake neon with a script webfont and text-shadow.

## Layout

A single centred wrap (max 1240px) with gutters of 20px on phones, 32px from 640px and 48px from 1100px. Sections breathe at clamp(80px, 10vw, 136px) vertical padding; the closing sign gets clamp(96px, 12vw, 168px). The fixed header is 72px.

Compositions are asymmetric two-column at 1000px and up, stacked below: hero 1.12fr / 0.88fr (statement left, circuit right, full viewport height), services 0.78fr / 1.22fr with the heading column sticky beside the rail, brain 0.9fr / 1.1fr with the art sticky, closing 1fr / 1fr. The results steps run as a vertical rail on phones and turn into a horizontal three-step rail at 900px. Spacing values sit on a 4px scale (6, 8, 12, 16, 20, 24, 28, 32, 40, 48, 72).

**The One Rail Rule.** Sequences (services, results steps) hang on one continuous line with clips or nodes at each stop, divided by thin rules. They are never laid out as a grid of equal boxed cards.

## Elevation & Depth

Depth comes from light, not stacking. The wall is flat with two soft gas washes (red at top left, argon at right) and a 5% grain over everything. Objects that hang on the wall (the open sign, the calculator) cast a deep, soft, neutral shadow downward; glass tubes cast a small offset blurred shadow onto the wall. Coloured light is reserved for lit glass and is expressed as halos, not as elevation.

### Shadow Vocabulary
- **Hung object** (`box-shadow: 0 30px 60px -30px rgba(0,0,0,0.8)`, 0.9 on the sign): calculator panel and open sign.
- **Tube on wall** (stroke rgba(0,0,0,0.55), 7px, offset 2px 5px, blur 2px): the shadow path under clear glass tubes.
- **Lit button** (`0 0 0 4px rgba(255,48,69,0.14), 0 10px 30px -8px rgba(255,48,69,0.65)`; hover widens to 6px / 0.18 and 14px 36px / 0.8): the light a lit tube button throws.
- **Current halo** (`drop-shadow(0 0 4px rgba(255,48,69,0.95)) drop-shadow(0 0 12px rgba(255,48,69,0.6))`): circuit current, lit rail and logo ring.
- **Argon reading** (`text-shadow: 0 0 18px rgba(125,144,255,0.55), 0 2px 0 rgba(0,0,0,0.4)`): the headline savings number.
- **Hardware** (`2px 4px 6px rgba(0,0,0,0.6)`): standoffs and slider thumbs.

### Named Rules
**The Lit Or Unlit Rule.** Every tube has exactly three states: off (clear glass, glint, cold tip), igniting (the strike: two failed starts over 0.9s, stepped, then hold), on. Ignition is driven by scroll or arrival; under reduced motion everything is on.

## Shapes

The form language is bent tube and wall hardware. Controls are full pills (999px) because they are tubes; the slider track is a thin 8px tube with a fill of red gas. Information surfaces use modest radii: plates and fields 10px, reading grids 14px, panels 18px, the open sign 22px. Strokes are round-capped and round-joined everywhere. Borders are 1px hairlines in cream alpha on information, 2px on anything that reads as glass (buttons, inputs, tube outlines). Round nodes (8-15px dots) mark stops on a rail.

## Components

### Buttons
Buttons are tubes that ignite.
- **Shape:** full pill (999px), 54px tall in large use, 40px small.
- **Lit (primary):** Neon Red fill, Lit Ink text, a 2px Neon Red Rim glass edge, and the lit-button light. Hover moves to Neon Red Hot and the light widens. One lit button per group.
- **Tube (secondary):** transparent with a 2px Tube Outline, cream text. Hover: outline turns red, text white, a soft red underglow. Used for WhatsApp, whose icon keeps its green.
- **Focus:** 2px Neon Red outline, offset 3px. Active presses down 1px.
- **Live link (ext--live):** a red-outlined tube that fills red on hover, for links to live shipped work.

### Chips
- **Style:** pill, 1px Line 2 border, Barlow 14px in Cream Muted. Timeline tags under the hero circuit follow the same form at 12px, the lead tag in cream with a red-tinted border.

### Cards / Containers
- **Spec plate:** two-column grid of 10px-radius boxes with a 1px Line 2 border and a faint top-down sheen; mono uppercase term, Barlow 600 value. Sits under each service.
- **Calculator panel:** 18px radius, #0c0a0b, 1px Line 2 border, hung-object shadow, padding clamp(22px, 3vw, 36px). Readings sit in a 1px-gap grid on Panel fill with argon numerals; the headline reading spans the row with a cool argon wash.
- **Report panel:** outline-only, 18px radius, argon indicator dots.

### Inputs / Fields
- **Calculator inputs:** tube pills, 2px Tube Outline, rgba(14,11,13,0.9) fill, 46px tall; hover turns the outline red; focus is a 2px red outline. Range sliders are an 8px glass track filled with red to the value, with a steel ball thumb (22px).
- **Enquiry fields:** 10px radius, 1px Line 2, Room Black 2 fill, 50px tall; focus turns the border cream with a 3px red ring; errors turn the border red with #ff7a88 text.

### Navigation
- Fixed 72px header, transparent at rest, then rgba(9,9,12,0.86) with a 14px backdrop blur and a hairline once scrolled. Logo at 84px with the ring glowing red. Links are Barlow 500 15px in Cream Muted, 44px targets; hover and current page go cream, the current page marked by a 4px red dot beneath. A small lit Book a call button sits at the right; phones get a full-screen menu with a block lit button.

### Neon Lettering (signature)
The Neon component draws a phrase as three stacked layers: spill (2.6x tube width, 0.16 opacity), tube (tone colour), core (0.32x width, near-white). Tone is red or argon. Optional electrodes put a metal sleeve and band on each end with a hot tip. Height is set by `--neon-h`, stroke weight by `--tw` (46 default, 52-62 for large lines).

### The Circuit (signature)
Clear glass tube paths (shadow, edge, bore, glint) routed through the hero and down the service rail, held by standoff clips whose screws turn red when their row is lit. A red current (5px dash with the current halo) is moved by one scroll clock that also lights each service sign; the rail fills with red to the current's bright round head.

### The Open Sign (signature)
A hung glass panel (22px radius, faint diagonal sheen, four steel standoffs, two hooks and a feed wire from above) carrying a neon word with electrodes that strikes on arrival.

## Do's and Don'ts

### Do:
- **Do** draw every display phrase with the Neon component and keep its screen-reader text.
- **Do** give every new tube an off state and let it strike (0.9s stepped) when it comes into view; show it on under reduced motion.
- **Do** keep one lit red button per action group, paired with a tube outline button.
- **Do** hang sequences on one rail with clips or nodes, divided by hairlines.
- **Do** colour numbers that respond to the visitor's input in argon, with tabular numerals.
- **Do** keep the wall dark; separate sections with Lit Wall, a hairline or space.

### Don't:
- **Don't** add a third accent colour or a light section.
- **Don't** put coloured glow on panels, plates or cards; glow is light thrown by lit glass.
- **Don't** fake neon with a script webfont plus text-shadow.
- **Don't** use JetBrains Mono for section labels, eyebrows or anything that is not a measurement.
- **Don't** lay services or steps out as a grid of equal boxed cards.
