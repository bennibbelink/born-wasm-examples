//go:build wasm

package main

import (
	_ "embed"
	"log"
	"time"
	"unsafe"

	"github.com/born-ml/born/backend/cpu"
	"github.com/born-ml/born/nn"
	"github.com/born-ml/born/tensor"
)

var inputBuf [784]float32
var outputBuf [10]float32

var durationMs int32

//go:embed mnist-cnn.born
var modelBytes []byte

var model *MNISTNetCNN[*cpu.Backend]
var backend *cpu.Backend

func main() {
	backend = cpu.New()
	model = NewMNISTNetCNN(backend)
	_, err := nn.LoadFromBytes(modelBytes, backend, model)
	if err != nil {
		log.Fatal(err)
	}
	select {}
}

//go:wasmexport getInputBufPtr
func getInputBufPtr() int32 {
	return int32(uintptr(unsafe.Pointer(&inputBuf[0])))
}

//go:wasmexport getOutputBufPtr
func getOutputBufPtr() int32 {
	return int32(uintptr(unsafe.Pointer(&outputBuf[0])))
}

//go:wasmexport getDurationMs
func getDurationMs() int32 {
	return durationMs
}

//go:wasmexport tinygoPredict
func tinygoPredict(inputLen int32, outputLen int32) int32 {
	if model == nil {
		log.Println("model is not initialized")
		return 0
	}
	if inputLen != 784 || outputLen < 10 {
		log.Printf("invalid lengths: inputLen=%d, outputLen=%d", inputLen, outputLen)
		return 0
	}
	inputTensor, err := tensor.FromSlice(inputBuf[:], tensor.Shape{1, 784}, backend)
	if err != nil {
		log.Printf("failed to create inputTensor: %v", err)
		return 0
	}

	start := time.Now()
	logits := model.Forward(inputTensor)
	durationMs = int32(time.Since(start).Milliseconds())

	probs := backend.Softmax(logits.Raw(), -1)
	n := copy(outputBuf[:], probs.AsFloat32())
	return int32(n)
}
