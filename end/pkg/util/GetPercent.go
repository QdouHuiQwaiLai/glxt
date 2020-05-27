package util

import (
	"math"
)

func GetPercent(a int, b int) int {
	return int(math.Floor(float64(a) / float64(b) * 1000 + 0.5))
}
