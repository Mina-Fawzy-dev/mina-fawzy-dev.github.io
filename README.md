# CG Hub — Mina's Resource Center 🎨✨

**CG Hub** is a fast, centralized personal resource center designed to keep all essential Design, UI/UX, and 3D tools easily accessible from anywhere. It's a single-page, fully responsive dashboard built to organize hundreds of references, tools, fonts, brushes, and more into logical, easy-to-use categories.

## 🚀 Features

- **Blazing Fast Search:** Real-time global search that instantly filters through out of thousands of sites by name, domain, or category tag.
- **Dynamic Quick Access:** Immediate links to the most frequently used tools like Photopea, FontBug, and AI upscalers, along with a dedicated "Toools.design Directory".
- **Responsive Layout:** A clean, glowing dark-mode UI with a retractable sidebar menu that works flawlessly on desktop, tablet, and mobile viewing.
- **Categorized Resources:** Over 20 distinct resource categories, including:
  - 🖌️ **Design Resources:** Fonts, Brushes, Textures, Photos, PNG Images, Icons, Mockups.
  - 🧊 **3D Hub:** Comprehensive lists of models, addons, materials, and scripts for 3ds Max, Blender, and V-Ray.
  - 💻 **Software & Tools:** Presets for Photoshop, After Effects, Premiere Pro, and more.
  - 🧠 **AI & Productivity:** Tools to enhance workflow, scheduling (Trello, Milanote), and AI generative assets.

## 🛠️ Technology Stack

CG Hub is built to be lightweight, portable, and extremely easy to run without any complex backend setup:
- **HTML5:** Semantic structure.
- **Vanilla JavaScript:** Fast client-side rendering and search logic.
- **Vanilla CSS:** Custom properties (CSS variables), Grid/Flexbox layouts, and a modern glassmorphic look with subtle noise overlays.
- **Bootstrap Icons:** Lightweight vector iconography (`bootstrap-icons` via CDN).
- **Google Fonts:** Utilizing `Barlow Condensed`, `Space Mono`, and `Barlow`.

## 📦 How to Use

Since CG Hub is entirely client-side, using it is incredibly simple:

1. Clone or download this repository.
2. Open the `index (1).html` (or `index.html` if renamed) file in your preferred web browser.
3. *That's it!* You can instantly start browsing and searching through the resources.

## 📂 Customization & Adding New Sites

To add new resources, open the HTML file in a code editor and locate the `const resources` object inside the `<script>` tag. Data is structured cleanly:

```javascript
{ 
  id: "category-id", 
  name: "Category Name", 
  icon: "bi-icon-name", 
  accent: "#color_hex", 
  sites: ["Site Name|https://link.com"] 
}
```
Simply append your new `Site Name|https://link.com` to the `sites` array of any category, and the dashboard will update its counts and search index automatically.

## 👨‍💻 Developed By

**[Mina.dev](https://github.com/Mina-Fawzy-dev/)**  
**[CGHub](https://mina-fawzy-dev.github.io/)**  
Feel free to follow me on GitHub for more projects and updates!
