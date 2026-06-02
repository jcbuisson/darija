# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Node.js ESM project that uses OpenAI's text-to-speech API to generate audio from text. The project name "speak-darija" suggests the goal is to produce speech in Darija (Moroccan Arabic dialect).

## Setup

Copy `.env` and set `CHATGPT_KEY` to a valid OpenAI API key.

## Running

```bash
node test.js
```

This plays audio directly via the OpenAI helper. Requires a speaker/audio output available.

## Key Details

- **Runtime**: Node.js ESM (`"type": "module"` in package.json), requires Node ≥ 14
- **API**: OpenAI `audio.speech.create` using model `gpt-4o-mini-tts`
- **Audio playback**: Uses `openai/helpers/audio` → `playAudio(response)` which streams to the system audio output
- **Env var**: `OPENAI_API_KEY` in `.env`, loaded by dotenv and picked up automatically by the `openai` SDK
