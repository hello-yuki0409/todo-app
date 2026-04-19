#!/bin/sh

echo "Container note: Vite may print http://localhost:5173/ as the local URL."
echo "That localhost is inside the container."
echo "To reach it from your Mac, publish the port with: docker run --rm -p 5173:5173 tutorial"

exec npm run dev -- --host 0.0.0.0
