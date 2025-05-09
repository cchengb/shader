# Final Project – Bring Coral to Life 🌊🐠

This final project presents an animated underwater scene built using GLSL, featuring a dynamically swaying coral centerpiece surrounded by marine life. By combining procedural animation, bump mapping, lighting, and cube mapping, the project delivers an immersive aquatic experience filled with life and motion.

---

## 🌿 Animated Coral

At the heart of the scene is a **swaying coral**, animated using sinusoidal wave displacement in the vertex shader. The sway can mimic gentle tides or dramatic underwater currents based on tunable parameters:

- **Vertex Shader**:
  - Applies sine wave displacement using adjustable **frequency**, **amplitude**, and **decay**.
  - Simulates coral movement like waving or kelp-like flow.

- **Fragment Shader**:
  - Adds subtle **wave-like noise** for surface variation.
  - Blends a warm procedural base color with a texture map.
  - Uses per-fragment lighting for depth and realism.

---

## 🐙 Additional Sea Creatures

To bring the environment to life, the project includes a collection of animated marine life:

- **Urchins**: Reuse coral shader for spiky motion.
- **Sea Cucumber & Starfish**: Placed on the seafloor, exhibit smooth wiggling.
- **Squid**: Larger, rear-placed entity with dramatic wave motion; bump mapping enhances realism.
- **Fish (mother + small group)**: Lightly animated to simulate swimming.
- **Lone fish**: Moves independently among coral structures.

Each creature adds depth and variety to the scene, creating a vibrant, living seascape.

---

## 🌐 Environment Enhancements

- **Cube Map**:
  - A skybox-style cube map surrounds the scene, simulating underwater lighting and ambiance.
  - Enhances realism and immersion.

- **Bump Mapping**:
  - Used especially on squid and coral textures.
  - Adds surface irregularities to simulate lifelike materials.

- **Lighting**:
  - Carefully adjusted ambient, diffuse, and specular components.
  - Makes coral and marine life respond to light convincingly.

---

## 🎮 Interactive Parameters (Examples)

| Uniform        | Description                              |
|----------------|------------------------------------------|
| `uFreq`        | Frequency of sine wave motion            |
| `uAmp`         | Amplitude of vertex displacement         |
| `uDecay`       | Decay factor to taper motion vertically  |
| `uBumpScale`   | Bump mapping strength                    |

---

## 📸 Scene Composition

The final scene features:

- A central swaying coral pillar
- Several creatures placed for visual balance
- Multiple shaders optimized for realism
- Carefully positioned lights and camera for cinematic presentation

---

## 📂 Files Overview

- `coral.vert` / `coral.frag` – Coral shaders
- `urchin.glib`, `squid.glib`, `fish.glib` – Configurations for each creature
- `cubemap/` – Folder containing cube map textures
- `scene_final.glib` – Overall scene file
- Textures and bump maps for coral and squid surfaces

---

## 📝 Summary

**"Bring Coral to Life"** started as a simple coral animation but evolved into a fully animated marine ecosystem. Through careful design, parameter tuning, and shader optimization, the project blends technical shader programming with artistic scene design. The result is a calming, lively underwater environment that feels organic and visually rich.

https://jmp.sh/pWeyDAoT