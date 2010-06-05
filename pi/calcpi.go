package main

import (
	"./pi"
	"flag"
	"time"
	"fmt"
)

func main() {
	iter := flag.Int("iter", 5000, "Iterations per process")
	processes := flag.Int("processes", 100, "Num of processes")
	
	flag.Parse()

	start := time.Nanoseconds()
	pi.CalcPI(*iter, *processes)
	fmt.Printf("%f", float(time.Nanoseconds() - start) / float(10E6))
}
