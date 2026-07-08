# Project Plan: "Worlds of the Two-Faced: Solar System"

## Description

An interactive model of a fictional binary star system, implemented as a **top-down 2D visualization** (like a map). At the center are two suns orbiting each other. Several planets revolve around them. One of these is a Saturn analog with rings and 7 inhabited moons.

## Technologies

- **HTML5** — page structure
- **CSS3** — interface styling
- **JavaScript (ES6+)** — application logic
- **Three.js** — 2D rendering via WebGL (orthographic camera, top-down view)
- **OrbitControls** — camera zooming and panning control
- **Webpack** — project bundling, module bundling, asset optimization
- **Docker Compose** — containerization of development environment and deployment

## Project Structure

```
two-faced-world-cosmology/
├── package.json
├── webpack.config.js
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── PLAN.md
├── README.md
├── public/
│   ├── index-oop.html
│   └── index-procedural.html
├── src/
│   ├── js/                          # OOP version (main)
│   │   ├── main.js                  # Entry point (Vue app)
│   │   ├── App.vue                  # Vue root component
│   │   ├── components/
│   │   │   └── InfoPanel.vue        # Vue UI component
│   │   └── space-engine/
│   │       ├── core/
│   │       │   ├── SpaceSimulation.js  # Main orchestrator
│   │       │   ├── TimeManager.js      # Simulation time & calendar
│   │       │   └── InteractionManager.js # Raycasting & clicks
│   │       ├── objects/
│   │       │   ├── SpaceObject.js  # Base class for celestial bodies
│   │       │   ├── Star.js         # Star entity
│   │       │   ├── Planet.js       # Planet entity (with rings)
│   │       │   └── Moon.js         # Moon entity
│   │       ├── constants/
│   │       │   ├── constants.js        # Colors, camera, controls
│   │       │   └── space-objects-data.js # SPACE_OBJECTS data
│   │       └── utils/
│   │           └── texture-generators.js # Procedural textures
│   ├── js-procedural/               # Procedural version
│   │   ├── cosmo/
│   │   │   ├── effects.js
│   │   │   ├── firmament.js
│   │   │   ├── moons.js
│   │   │   ├── objects.js
│   │   │   └── saturn.js
│   │   ├── constants.js
│   │   ├── main.js
│   │   └── utils.js
│   ├── scss/                        # OOP styles (SCSS)
│   │   ├── base.scss
│   │   └── main.scss
│   ├── css-procedural/              # Procedural styles (plain CSS)
│   │   ├── base.css
│   │   ├── timeline.css
│   │   ├── info-panel.css
│   │   └── legend.css
│   └── assets/
└── ssl/
    ├── server.crt
    └── server.key
```

## Key System Elements

### Stars (2)
- **Yellow Sun** — large, bright, color #FFD700 (golden yellow), glow effect
- **Red Sun** — smaller, color #FF4500 (orange-red), glow effect
- Orbit each other around the common center of mass along elliptical paths
- Glow effect

### Planets (6)
1. **Inner Planet** — small, hot, close to the suns
2. **Second Planet** — medium-sized, rocky
3. **Saturn-like Planet** — gas giant with rings (central object)
4. **Fourth Planet** — gas giant, smaller than Saturn
5. **Fifth Planet** — ice giant
6. **Outer Planet** — distant, small

### Saturn-like Planet (Details)
- Large gas giant with texture in warm tones
- Ring system (inner, middle, outer) — viewed as rings from above
- Orbit at medium distance from the suns

### Saturn's Moons (7 inhabited)
1. **Mimas** — "World of the Emperor". A world with an advanced civilization, imperial city-state.
2. **Enceladus** — planet of intelligent beings, a vast ocean of living substance. The entire world is one organism.
3. **Tethys** — partially flooded world, port cities on islands and coasts.
4. **Dione** — *TBD (to be defined later)*
5. **Rhea** — "World of Singers and the Blind". A green world with vegetation, jungles, fungi, spores.
6. **Titan** — rocky world of diamonds and fierce warriors.
7. **Iapetus** — "World of Twilight and Dawn". Dark and icy world with bioluminescence at night; burning desert by day.

## Interactivity

### Camera
- **Always top-down view** (orthographic camera)
- Zooming: pinch/scroll
- Panning: drag
- Fixed perspective — full 3D is not required

### Timeline
- Slider for time navigation
- Buttons: pause / play
- Time speed adjustment
- Display of current timestamp
- At any moment, you can "freeze" to see the positions of all bodies

### Point Selection on Moon
- Clicking on a moon enable "point-select" mode. A guide line between center of the moon and cursor drawn. This guide line shows where on the moon curface the point will be set on click.
- Selecting a point on the moon's surface = **selecting a point on a circle** (top-down view)
- Display of the **fermament cone** on the sky dome:
  - The cone is drawn as a sector on the sky dome circle around the moon

### Scale Navigation
- **Overview:** entire binary system
- **Saturn-like Planet:** zoom into Saturn and its orbit
- **Moon:** zoom into a selected moon for point selection

### Information Panel
- Name, type, radius, temperature, population
- Description

## Development Stages

### Stage 0: Basic Structure (Mobile First)
- [x] Setup HTML5 template
- [x] Basic CSS structure for mobile screens
- [x] Connect Three.js (ES Module via npm)
- [x] Configure Webpack (entry, output, devServer, HMR)
- [x] Configure Docker Compose (app + nginx, HTTPS)

### Stage 1: Basic Scene
- [x] Setup Three.js with orthographic camera (top-down view)
- [x] Create starry sky (particles)
- [x] Add two suns with rotation
- [x] OrbitControls (zooming and panning)
- **Technical Note:** Ensure `material.side = THREE.DoubleSide` for all flat meshes to prevent Z-fighting and visibility issues in top-down view. Adjust camera near/far planes dynamically if precision loss occurs during zoom.

### Stage 2: Orbits and Planets
- [x] Orbit lines for all objects
- [x] Create 6 planets as circles with different characteristics
- [x] Orbital motion of planets around the suns
- [x] Timeline (slider + speed)
- [x] Frame-rate independent animation (simTime)
- [x] Protection against HMR (preventing duplicate initialization)
- [x] Move all constants to `constants.js`
- [x] Modular CSS structure
- [x] Declension of time units (hour/day/week)
- [x] Interface: timeline, legend, info panel

### Stage 3: Saturn-like Planet
- [x] Create gas giant
- [x] Ring system (view from above — ellipses/rings)
- [x] Orbit around the binary system

### Stage 4: Saturn's Moons
- [x] 7 moons as circles on orbits around Saturn
- [x] Inhabited markers
- [x] Data for each moon

### Stage 5: Visibility Cone
- [x] Select moon → outline moon with white ring
- [x] Select point on circle (polar coordinates)
- [x] Display auxiliary line when selecting a point on the circle
- [x] Visualize visibility cone on sky dome (sector of circle)
- [x] Rotation of cone and point on moon's circle (moon is in tidal lock)

### Stage 6: Improving Camera Scale Handling
- [x] Default scale should fit Saturn's orbit completely within the screen.
- [x] Selecting a moon → zoom camera to the moon

### Stage 7: Transition to OOP (Refined)
- [x] **Architecture for parallel transition:**
  - [x] Procedural version is at `src/js-procedural/` and served by nginx at `/procedural/`
  - [x] OOP version becomes primary and is served at `/`
  - [x] Two entry points in webpack: `./src/js/main.js` (OOP) and `./src/js-procedural/main.js` (Procedural)
  - [x] Two sections in nginx server config for serving different URLs
- [ ] **New Classes & Utilities:**
  - [x] `SpaceSimulation` — main orchestrator. Creates scene, renderer, camera, starts animation loop. Properties: `scene`, `camera`, `renderer`, `timeManager`, `spaceObjects` (array).
  - [x] `TimeManager` — encapsulates `simTime`, `isPlaying`, `speedMultiplier`, calendar system. Provides orchestrator with a clean interface for getting current time.
  - [x] `InteractionManager` — handles raycasting, click events, delegates to `SpaceObject.onClick()`.
  - [x] `SpaceObject` — base class for celestial bodies. Encapsulates mesh creation, orbit calculation, glow effect.
  - [x] `Star`, `Planet`, `Moon` — inherit from `SpaceObject`. `Planet` adds ring rendering.
  - [ ] `CameraController`: Handles smooth camera transitions (lerping) between zoom levels (Overview -> Saturn -> Moon).
  - [ ] `CalendarSystem`: Decouples fantasy date calculation from simulation time (`simTime`). Provides formatted dates for UI.
  - [ ] **Iterative OOP Implementation (Step-by-Step):**
  - [x] **Step 1:** Implement CalendarSystem. (Note: Time and Calendar logic is fully implemented inside TimeManager.js)
  - [x] **Step 2:** Create base class `SpaceObject`. Migrate *one* static object (e.g., a placeholder planet) to this class. Verify mesh creation and basic state management.
  - [x] **Step 3:** Implement `Star` class. Migrate the two suns. Verify orbital motion using parametric equations: `angle = (simTime * 2π) / orbitalPeriod`.
  - [x] **Step 4:** Implement `Planet` and `Moon` classes. Migrate Saturn and its moons. Verify ring rendering and moon orbits.
  - [x] **Step 4.5:** Implement `InteractionManager`. Connect raycasting to the new entity structure for selection logic.
  - [ ] **Step 5:** Implement `CameraController`. Add smooth zoom/pan transitions when selecting objects.
  - [ ] **Step 6:** Finalize `SpaceSimulation` orchestrator. Ensure all systems work together.

#### Stage 7.1: Integration with Vue.js
- [x] Vue 3 (`<script setup>`) integration
- [x] `App.vue` — mounts `SpaceSimulation`, listens for `space-object-selected` events
- [x] `InfoPanel.vue` — UI component (placeholder)
- [ ] `InfoPanel.vue` — full implementation with selected object data display
- [ ] `TimeControls.vue` - controls for speed multiplier, play/pause

#### Stage 7.2: Refactoring. Replacing Inheritance with Composition
- [ ] Create space-engine/factories/OrbitFactory.js. Move SpaceObject.createOrbitLine() to OrbitFactory.
- [x] Create space-engine/effects/GlowEffect.js. Move SpaceObject.createGlowMesh() to GlowEffect.js.
- [ ] Create space-engine/effects/RingsEffect.js. Move Planet.createRingsMeshes() to RingsEffect.js.
- [ ] Create space-engine/effects/FirmamentConeEffect.js. Implement it. Add it to the moons.

### Stage 8: Features
- [ ] Textures
- [ ] Rotation of celestial objects
- [ ] Light

### Stage 9: Timeline
- [ ] Decide on the calendar. Which calendar to use? What are the fantasy month names? What is the composition of the year and months?
- [ ] Set default positions for all celestial objects and bind them to a specific date
- [ ] Date selection (year, month, day) from fantasy calendar
- [ ] Display current date (year, month, day, hour, minute, second) — dynamically change date while animation is running
- [ ] Date selection → calculate positions of celestial objects at the selected time point

### Stage 10: Interface (Fantasy Style)
- [ ] Information panel (parchment style)
- [ ] Timeline in ancient map style
- [ ] Rune separators and icons
- [ ] Time speed control

### Stage 11: Adaptation?
- [ ] Tablet screens (768px+)
- [ ] Desktop screens (1024px+)
- [ ] Control optimization (touch + mouse)

### Stage 21: Polishing
- [ ] Glow effects (bloom)?
- [ ] Transition animations between scale modes
- [ ] Performance optimization
- [ ] Testing on real devices



## Build and Deployment

### Webpack

**Purpose:** modular project build, JS/CSS/SCSS bundling, asset processing.

**Structure:**
- `webpack.config.js` — build configuration
- `src/` — source code (modules)
- `dist/` — build output (deployment-ready files)

**Configuration:**
- **entry** — two entry points: `oop` → `src/js/main.js` (OOP), `procedural` → `src/js-procedural/main.js` (Procedural)
- **output** — `dist/oop/` and `dist/procedural/` with separate bundles and CSS per version
- **modules:**
  - `babel-loader` — JS transpilation (ES6+ → compatible JS)
  - `css-loader` + `MiniCssExtractPlugin` — CSS module processing
  - `sass-loader` + `css-loader` + `MiniCssExtractPlugin` — SCSS processing (OOP version)
  - `asset/resource` — image and font processing
- **plugins:**
  - `HtmlWebpackPlugin` — generate `oop/index.html` and `procedural/index.html` from templates
  - `MiniCssExtractPlugin` — extract CSS into separate files per version
  - `CleanWebpackPlugin` — clean `dist/` before each build
- **devServer** — serves from `dist/`, `historyApiFallback` rewrites `/` → `/oop/`, HMR
- **aliases**: `@js` → `src/js`, `@scss` → `src/scss`, `@css` → `src/css-procedural`, `@assets` → `src/assets`
- **mode** — `development` / `production` (with minification and tree-shaking)

**npm scripts:**
- `npm run build` — production build
- `npm run dev` — development with HMR (webpack-dev-server)
- `npm run lint` — code checking (ESLint)

### Docker Compose

**Containers:**

1. **app (development)**
   - **Image:** `node:20-alpine`
   - **Purpose:** development environment with webpack-dev-server
   - **Volume:** `./ → /app` (hot loading of sources)
   - **Ports:** `443:443` (webpack-dev-server, HTTPS)
   - **Command:** `npm run dev`
   - **Note:** `nginx` service removed from dev workflow. Only `app` is used during development.

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: tfwcosmo-dev
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "443:443"
    command: npm run dev
    environment:
      - NODE_ENV=development
```

**Dockerfile (app):**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]
```

**Nginx (production only):**
- **Image:** `nginx:alpine`
- **Purpose:** serving static files from `dist/`
- **Volume:** `./dist → /usr/share/nginx/html:ro`
- **Config:** `nginx.conf` — `/` → `dist/oop/`, `/procedural/` → `dist/procedural/`
- **Note:** `nginx` service is not used during development. Only for production builds.

## Visual Style (Fantasy)

### Color Palette
- **Background:** deep dark blue / almost black (space)
- **UI Panels:** warm parchment (#f4e4c1, #d4b896)
- **Accents:** bronze (#cd7f32), muted gold (#b8860b)
- **Text:** dark brown (#3e2723)
- **Highlight:** amber (#ffbf00)

### Interface Elements
- Parchment textures for panels
- Bronze/golden frames with rivets
- Rune symbols as separators
- Font: serif for headings, sans-serif for data

## Responsiveness (Mobile First)

### Mobile (320–767px)
- Full-screen scene
- Information panels — slide-up from bottom (bottom sheet)
- Timeline — compact, horizontal
- One-finger control (pinch for zoom, drag for pan)
- Point selection on moon: tap + drag along circle

### Tablet (768–1023px)
- Panels on the side
- Timeline — full width
- Double-tap to select object

### Desktop (1024px+)
- Panels on the sides
- Timeline at the bottom
- Hover effects
- Mouse wheel for zoom
