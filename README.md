# Codescopix Font

## Overview
Codescopix is a a monospace pixel font that includes characters for all major languages in Europe and America. The font covers the classic Windows and OS X encodings, ensuring comprehensive language support and compatibility across various systems. See an example [here](./Example.png).

## Supported Encodings
The font covers the Unicode [subset](./Codescopix.png) containing Cyrillic and Latin characters for different languages:
- Roman (win1252, mac10000, mac10079)
<!--- - Greek (win1253, mac10006) -->
- Cyrillic (win1251, mac10007, mac10017)
- Central European (win1250, win1257, mac10029, mac10010, mac10082)
- Turkish (win1254, mac10081)
- Vietnamese (win1258)

## Features
- **Comprehensive Character Coverage**: Supports Roman, Cyrillic, Central European, Turkish, and Vietnamese characters.
- **Monospace Pixel Font**: Ensures uniform character width, ideal for coding, text editors, and terminal applications.
- **Distinct Characters**: Emphasizes unique designs for each character to avoid confusion between similar-looking glyphs (e.g., letter O and digit 0, Latin C and Cyrillic С).
- **TTF Format**: Built as a TrueType Font for wide compatibility and easy installation.

## Installation
1. **Download the Font File**: Ensure you have the `ttf` file from the release package.
2. **Install on Windows**:
   - Right-click the `.ttf` file.
   - Select "Install" from the context menu.
3. **Install on macOS**:
   - Double-click the `.ttf` file.
   - Click "Install Font" in the preview window.

## Creation
Codescopix was created using [Bits'N'Picas](https://github.com/kreativekorp/bitsnpicas), a bitmap font editor.

## Help Needed: Generating a 16px Font Size
Currently, I am facing a challenge in generating a 16px font size using the Bits'n'Pics tool. At the moment, the tool only allows me to select parameters that output a 14px font. This presents a problem because 14px translates to 10.5 pt, a size that is not universally selectable in all text editors and IDEs. Having a standard 16px (12 pt) font size is crucial for better compatibility and readability across various platforms.

### The Issue
- **Current Output**: 14px font size (10.5 pt).
- **Desired Output**: 16px font size (12 pt).
- **Problem**: 10.5 pt is not a standard size and may not be selectable in many text editors and IDEs.

### How You Can Help
If you have experience with Bits'n'Pics or similar font creation tools, I would greatly appreciate your assistance in configuring the tool to output a 16px font size. Any guidance, suggestions, or tips on achieving this would be immensely helpful.

## License
This font is licensed under the SIL Open Font License (OFL). For more details, see the full license text included in this repository.
