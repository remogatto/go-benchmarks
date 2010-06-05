package pi

import (
	"rand"
	"time"
)

func getCoord(rg *rand.Rand) float64 {
	return -1 + rg.Float64()
}

func calcPartialPI(result chan<- float64, iter int) {
	var circle, i int

	rg := rand.New(rand.NewSource(time.Nanoseconds() % 1e9))

	for i = 0; i < iter; i++ {
		x, y := getCoord(rg), getCoord(rg)
		if (x * x + y * y) < 1.0 {
			circle++
		
		}
	}

	result <- 4 * float64(circle) / float64(i)
}

func CalcPI(iter, processes int) float64 {
	var acc float64

	result := make(chan float64, processes)
	
	for i := 0; i < processes; i++ {
		go calcPartialPI(result, iter)
	}
	
	for i := 0; i < processes; i++ {
		acc += <-result
	}

	return acc / float64(processes)
}
