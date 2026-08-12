#!/usr/bin/env python3
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting Tamil Spell Checker Backend Server on http://{host}:{port}")
    print(f"Interactive Swagger Documentation available at http://localhost:{port}/docs")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
