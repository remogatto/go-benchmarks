package pi

import (
	"rand"
//	"math"
	"time"
//	"fmt"
)

func getCoord() float64 {
	// var sign float64
	// if math.Signbit(rand.NormFloat64()) {
	// 	sign = 1.0
	// } else {
	// 	sign = -1.0
	// }
	// return sign * rand.Float64()
	return rand.NormFloat64() * 3
}

func calcPartialPI(result chan<- float64, iter int) {
//	start := time.Nanoseconds()
	var circle, total int = 0, 0
	for i := 0; i < iter; i++ {
		x, y := getCoord(), getCoord()

		if (x <= 1.0) && (x >= -1.0) && (y <= 1.0) && (y >= -1.0) {
//			fmt.Printf("x, y %f %f\n", x, y)
			total++
		}
		
		if (x*x + y*y) < 1.0 {
			circle++
		}
	}
	// fmt.Printf("Partial calculation takes %f microseconds\n", 
	// 	float(time.Nanoseconds() - start) / float(10e6))
	result <- 4 * float64(circle) / float64(total)
}

func CalcPI(iter, processes int) float64 {
	var acc float64

	result := make(chan float64, processes)
	
	rand.Seed(time.Nanoseconds() % 1e9)
	
	for i := 0; i < processes; i++ {
		go calcPartialPI(result, iter)
	}
	
	for i := 0; i < processes; i++ {
		acc += <-result
	}

	return acc / float64(processes)
}
