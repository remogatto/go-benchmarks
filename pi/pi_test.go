package pi

import (
	"testing"
	"math"
)


func TestCalcPI(t *testing.T) {
	result := math.Fabs(CalcPI(5000, 10) - math.Pi)
	expected := float64(0.1)
	if result > expected {
		t.Errorf("Expected %s found %s", expected, result)
	}
}

func BenchmarkCalcPi(b *testing.B) {
	b.StartTimer()
	CalcPI(5000, 10)
	b.StopTimer()
}
