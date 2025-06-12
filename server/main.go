package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

type DeployRequest struct {
	UserID      int    `json:"user_id"`
	RegistryURL string `json:"registry_url"`
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// Allow CORS
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	file, header, err := r.FormFile("dockerfile")
	if err != nil {
		http.Error(w, "failed to read file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	fmt.Printf("Received Dockerfile: %s\n", header.Filename)

	buildDir, err := os.MkdirTemp("", "docker-build-*")
	if err != nil {
		http.Error(w, "Failed to create temp dir", http.StatusInternalServerError)
		return
	}

	dockerfilePath := filepath.Join(buildDir, "Dockerfile")
	outFile, err := os.Create(dockerfilePath)
	if err != nil {
		http.Error(w, "Failed to save Dockerfile", http.StatusInternalServerError)
		return
	}
	defer outFile.Close()
	io.Copy(outFile, file)

	imageName := "user-app:" + filepath.Base(buildDir)
	cmd := exec.Command("docker", "build", "-t", imageName, buildDir)
	output, err := cmd.CombinedOutput()
	if err != nil {
		log.Printf("Docker build failed: %s", output)
		http.Error(w, "Docker build failed:\n"+string(output), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Docker image %s built successfully.\n%s", imageName, output)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("File received"))
}

func deployHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}

	fmt.Print("Starting to deploy")

	var req DeployRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Decode error: %v", err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	if req.RegistryURL == "" {
		http.Error(w, "Missing registry_url", http.StatusBadRequest)
	}

	imageName := req.RegistryURL
	containerName := fmt.Sprintf("app-%d", req.UserID)

	pullCmd := exec.Command("docker", "pull", imageName)
	pullOutput, err := pullCmd.CombinedOutput()
	if err != nil {
		log.Printf("Pull faied: %s", pullOutput)
		http.Error(w, "Docker pull failed:\n"+string(pullOutput), http.StatusInternalServerError)
		return
	}

	runCmd := exec.Command("docker", "run", "-d", "--name", containerName, imageName)
	runOutput, err := runCmd.CombinedOutput()
	if err != nil {
		log.Printf("Run failed: %s", runOutput)
		http.Error(w, "Docker run failed:\n", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("App deployed successfully"))
}

func main() {
	http.HandleFunc("/upload", uploadHandler)
	http.HandleFunc("/deploy", deployHandler)
	fmt.Println("Build service listening on :9000")
	http.ListenAndServe(":9000", nil)
}
