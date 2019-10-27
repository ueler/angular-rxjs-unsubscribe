package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func main() {
	http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
		time.Sleep(5 * time.Second)
		fmt.Fprintf(w, "{\"title\": \"New site title\"}")
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
