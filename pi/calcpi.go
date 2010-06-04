package main

import (
	"./pi"
	"flag"
	"time"
	"fmt"
)

func main() {

	iter := flag.Int("iter", 500000, "Iterations per process")
	processes := flag.Int("processes", 10, "Num of processes")
	
	flag.Parse()

	start := time.Nanoseconds()
	fmt.Printf("Approx PI value %f calculated in %f microseconds\n", 
		pi.CalcPI(*iter, *processes),
		float(time.Nanoseconds() - start) / float(10E6))
}
