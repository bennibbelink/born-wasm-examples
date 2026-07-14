Examples of born-ml/born in the browser

This repository demonstrates how to run machine learning models from the [born-ml/born](https://github.com/born-ml/born) framework in the browser using Go's WebAssembly (WASM) runtime.

## What It Does

Built with **Go + SvelteKit**, this project shows how to:

- **Compile ML models to WASM**: Using Go's WASM build capabilities to package born-ml/born inference models
- **Run models in browsers**: Execute trained machine learning models directly in the client-side browser
- **Interactive demos**: Feature two working examples:
  - **MNIST**: Handwritten digit recognition
  - **MNIST-CNN**: Convolutional neural network for digit classification

## Architecture

### Backend (Born + Go)

The ML models are implemented in Go using the born framework:
```
born-wasm-examples/
├── mnist/
│   ├── main.go      # Entry point
|   |-- model.go     # Born model definition
│   └── mnist.born   # Born model parameters
└── mnist-cnn/
│   ├── main.go
│   ├── model.go
│   └── mnist-cnn.born
```

**How it works:**
1. Go source code with born models is compiled to WASM
2. Output: `.wasm` files that can run in any modern browser
3. Static files served alongside the Svelte app

## Setup & Usage

### Development

```bash
make dev

# Access at http://localhost:5173
```

Or manually:
```bash
# Build ML models
make mnist
make mnist-cnn

# Run SvelteKit dev server
cd app && bun run dev
```

### Production

```bash
# Build everything
make app
```

## Project Structure

```
born-wasm-examples/
├── app/                   # SvelteKit frontend
│   ├── src/
│   │   ├── routes/        # SvelteKit routes
│   │   └── lib/           # Shared utilities
│   ├── static/            # Compiled WASM files
│   │   ├── mnist.wasm
│   │   └── mnist-cnn.wasm
│   └── package.json
├── mnist/                  # MNIST model (Go)
├── mnist-cnn/              # MNIST-CNN model (Go)
├── Makefile                # Build automation
└── README.md               # This file
```
