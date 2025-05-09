# CS 457 Project #2 - Noisy Elliptical Dots

**Author**: Colin Cheng  

## 🎯 Project Description

This project builds upon the previous elliptical dot shader by introducing **3D noise distortion** into the pattern. The primary goal was to enhance the visual complexity by using a noise texture to perturb texture coordinates and produce wavy, animated ellipses on 3D models such as spheres and dragons.

### 🧪 Technical Overview

- **Noise Texture Generation**:
  - A 3D noise texture was created using the `LoadNoiseTexture()` function.
  - A 32×32×32 grid was filled with random float values between 0 and 1.
  - This texture was sampled in the fragment shader to introduce distortion in the `s`, `t` coordinates.

- **Dynamic Uniform Controls**:
  - `uAd`, `uBd`: Controls the horizontal and vertical stretch of ellipses.
  - `uTol`: Controls edge blending sharpness.
  - `uNoiseAmp`: Amplitude of the noise distortion.
  - `uNoiseFreq`: Frequency of the noise waves.

- **Keyboard Interaction**:
  | Key | Action |
  |-----|--------|
  | `A`/`a` | Increase/decrease `uAd` |
  | `B`/`b` | Increase/decrease `uBd` |
  | `T`/`t` | Increase/decrease `uTol` |
  | `N`/`n` | Increase/decrease `uNoiseAmp` |
  | `R`/`r` | Increase/decrease `uNoiseFreq` |

- **Lighting Model**:
  - Reuses per-fragment lighting from Project 1.
  - Includes **ambient**, **diffuse**, and **specular** components.

## ✨ Visual Results

The shader was applied to both **Sphere** and **Dragon** models, showcasing how parameter changes affect dot shape, noise distortion, and blending edges.

> 📷 _Add screenshots here if available in `images/` folder with markdown below:_
```markdown
![Dragon with Noisy Elliptical Dots](images/proj0204.png)
![Dragon with Noise and Edge Blending](images/proj0203.png)
![Dragon with Noise and Edge Blending](images/proj0202.png)
![Dragon with Noise and Edge Blending](images/proj0201.png)