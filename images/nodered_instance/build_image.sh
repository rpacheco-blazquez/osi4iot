docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/osi4iot/nodered_instance:1.1.0 --push .
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/osi4iot/nodered_instance:latest --push .