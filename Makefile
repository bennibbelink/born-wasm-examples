
MAKEFILE_DIR := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))
# MAKEFILE_DIR has trailing slash

APP_DIR := ${MAKEFILE_DIR}app
APP_ASSETS_DIR := ${APP_DIR}/src/lib/assets
APP_SRC := $(shell find ${APP_DIR}/src ${APP_DIR} -maxdepth 1 \( -name 'package.json' -o -name 'vite.config.ts' -o -name 'tsconfig.json' -o -name '*.svelte' -o -name '*.ts' -o -name '*.js' \))
MNIST_DIR := ${MAKEFILE_DIR}mnist
MNIST_CNN_DIR := ${MAKEFILE_DIR}mnist-cnn

GC := tinygo

MNIST_SRC := $(shell find ${MNIST_DIR} \( -name '*.go' -o -name '*.born' \))
MNIST_CNN_SRC := $(shell find ${MNIST_CNN_DIR} \( -name '*.go' -o -name '*.born' \))

mnist: ${MNIST_SRC}
	GOOS=js GOARCH=wasm ${GC} build -o ${APP_ASSETS_DIR}/mnist.wasm ${MNIST_DIR}

mnist-cnn: ${MNIST_CNN_SRC}
	GOOS=js GOARCH=wasm ${GC} build -o ${APP_ASSETS_DIR}/mnist-cnn.wasm ${MNIST_CNN_DIR}

wasm-exec-js:
	cp "$(shell ${GC} env TINYGOROOT)/targets/wasm_exec.js" ${APP_ASSETS_DIR}

app: mnist mnist-cnn wasm-exec-js ${APP_SRC}
	cd ${APP_DIR} && bun run build

serve: mnist mnist-cnn app
	cd ${APP_DIR} && bun run preview

dev: mnist mnist-cnn wasm-exec-js
	cd ${APP_DIR} && bun run dev

clean:
	rm -f ${APP_ASSETS_DIR}/mnist.wasm ${APP_ASSETS_DIR}/mnist-cnn.wasm ${APP_ASSETS_DIR}/wasm_exec.js
	rm -rf ${APP_DIR}/build

.PHONY: mnist mnist-cnn wasm-exec-js app serve dev clean
