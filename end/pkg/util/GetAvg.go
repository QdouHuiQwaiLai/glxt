package util

func GetAvg(arr []float64) float64 {
	sum := 0.0
	var avg float64
	switch len(arr) {
	case 0:
		avg = 0
	default:
		for _, v := range arr {//下划线表示那个值舍去，即舍去下标索引
			sum += v
		}
		avg = sum / float64(len(arr))
	}
	return avg
}
