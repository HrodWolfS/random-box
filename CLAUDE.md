# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Random Box is an interactive 3D name drawing application built with Next.js, React Three Fiber, and TypeScript. The application simulates a physical office environment where users can submit names, store them in a virtual hat, and draw them randomly with animated confetti effects.

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint
```

## Architecture

### Core Technology Stack
- **Next.js 15** with App Router
- **React Three Fiber** for 3D scene management
- **Zustand** for global state management
- **TypeScript** for type safety
- **Tailwind CSS** with shadcn/ui components
- **canvas-confetti** for celebration effects

### Project Structure

```
components/3D/          # All 3D scene components
├── Scene.tsx          # Main 3D canvas and scene setup
├── CameraController.tsx # Camera animation and positioning
├── Hat.tsx            # Interactive hat for drawing names
├── Board.tsx          # History display board
├── PaperStack.tsx     # Input interaction for adding names
├── Paper.tsx          # Animated paper for name transitions
└── [Room Elements]    # Floor, walls, furniture for ambiance

lib/
├── store.ts           # Zustand state management
└── utils.ts           # Utility functions

app/                   # Next.js App Router structure
```

### State Management (Zustand Store)

The application uses a centralized Zustand store with the following key states:

- **names**: Array of names waiting to be drawn
- **history**: Array of previously drawn names
- **drawnName**: Currently selected name from hat
- **cameraTarget**: Controls camera focus ("room", "paper", "board", "hat")
- **Animation states**: paperFlying, paperExiting, boxShaking

Key actions include `addName()`, `drawRandomName()`, `setCameraTarget()`, and animation state management.

### 3D Scene Architecture

**Camera System**: Smooth lerp-based transitions between predefined positions (room overview, paper stack, board closeup, hat focus) with controlled FOV changes.

**Interactive Elements**:
- **PaperStack**: Click to activate name input, Enter key to submit
- **Hat**: Click to draw random name from history, triggers confetti
- **Board**: Click to focus camera, displays up to 9 recent draws in 3x3 grid

**Animation Pipeline**: Names flow as animated Paper components from input → hat → display board with physics-based movement.

## Development Guidelines

### 3D Component Patterns
- All 3D components should use `@react-three/fiber` primitives
- Interactive elements require `onClick`, `onPointerOver`, and `onPointerOut` handlers
- Use `useStore` for state access and `useFrame` for animations
- Position props follow Three.js Vector3 format: `[x, y, z]`

### Visual Style (from .cursorrules)
- **Aesthetic**: Cartoon low-poly with soft pastel colors
- **Lighting**: SoftShadows with ambient + directional lighting
- **Materials**: meshStandardMaterial, avoid realistic textures
- **Palette**: Beige (#f2f0ed), white, black, soft green, light gray (#c0c0c0)

### State Management Patterns
- Use `useStore` selectors for reactive state access
- Animation states have automatic cleanup via `setTimeout`
- Camera tweening prevents interaction conflicts via `cameraTweening` flag
- All name operations maintain both active list and history arrays

### Animation Guidelines
- Use `useFrame` for smooth 60fps animations
- Implement lerp-based transitions for camera and object movement
- Set `cameraTweening` during transitions to prevent UI conflicts
- Reset animation states after completion (typically 2000ms)

## Model Assets

3D models are stored in `public/models/`:
- `top-hat.glb` - Interactive hat model
- `board.glb` - Cork board for history display
- Other furniture models for scene decoration

Models use `.glb` format and are loaded via `useGLTF` with preloading for performance.