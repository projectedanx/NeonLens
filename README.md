<div align="center">
<img width="1200" height="475" alt="NeonLens Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NeonLens

NeonLens is a centralized, dark-futuristic platform for AI artists to showcase generated images and share the prompts that created them. It acts as an artistic hub designed to overcome the fragmentation of prompt-sharing across disconnected forums and social media.

## The Problem Space

As AI image generation tools (Midjourney, DALL-E, Stable Diffusion) have proliferated, the workflows and outputs have remained fragmented. Artists generate stunning visuals but often lose the specific parameters or prompts that generated them, or share them in isolated spaces where they are quickly buried.
- **Lost Metadata:** The connection between the resulting artifact (image) and its causal intent (prompt) is frequently severed.
- **Creative Block:** Prompt engineering has become a complex skill, yet finding inspiration or deterministic patterns to generate specific styles is difficult without a centralized repository.

## The Solution

NeonLens solves this by enforcing an architectural coupling between the image artifact and the text prompt.
- **Gallery & Hub:** A curated, visual-first gallery (dark mode, cyberpunk aesthetic) where images are showcased *with* their generative metadata (engine, style tags, full prompt).
- **Prompt Synthesizer (Prompt Engineer):** A deterministic template engine that breaks creative blocks by randomizing parameters (adjectives, lighting, colors) within established prompt structures.
- **Artifact Uploading:** Allows users to upload their generated art alongside the "magic words" used to create it, preserving the intent and methodology.

## System Architecture Context

This repository is primarily a React-based frontend mapping out the core user journeys (Auth, Gallery, Prompt Generation, Uploading, User Profile).
It relies on a simulated backend (`mockService.ts`) to handle state persistence (using local in-memory arrays and `localStorage`) rather than a live database or authentication provider.

For an extensive architectural topology, dependency audit, and cultural analysis of this codebase, please refer to the [0xCARTO Synthesis Document](docs/0xCARTO_SYNTHESIS.md) generated via the Mycelial Ingestion Protocol.

## Quick Start

**Prerequisites:** Node.js (v18+)

1. **Install dependencies:**
   `npm install`

2. **Environment Variables:**
   The build configuration (`vite.config.ts`) expects a `GEMINI_API_KEY`, even though it is not strictly utilized by the active mock services in the source files.
   *(Note: This is documented as a `SILENT_REQUIRED_ENV` in the 0xCARTO audit.)*
   `export GEMINI_API_KEY="your-api-key"`
   Or set it in a `.env.local` file.

3. **Run the local development server:**
   `npm run start-dev-server` (or similar start script)

## Development Status

- **CI/CD:** None active. (See 0xCARTO audit for details).
- **Backend:** Mocked via `mockService.ts`.
- **Testing:** No formal test suite established.
