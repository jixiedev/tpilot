# One image for all TahoePilot components; pick one with the first argument.
#
#   docker build -f docker/Dockerfile -t tahoepilot .            (from repo root)
#   docker run -p 8000:8000 --env-file .env tahoepilot backend
#   docker run -p 3000:3000 -e AGUI_BACKEND_URL=http://backend:8000/agui tahoepilot frontend
#   docker run -p 3000:3000 -p 8000:8000 --env-file .env tahoepilot all
#   docker run -it --env-file .env tahoepilot cli
#
# See docker/entrypoint.sh for the full list of commands.

# ---- frontend build ----
FROM node:22-slim AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/app ./app
COPY frontend/public ./public
COPY frontend/next.config.ts frontend/tsconfig.json frontend/postcss.config.mjs frontend/next-env.d.ts ./
RUN npm run build

# ---- runtime ----
FROM python:3.11-slim

COPY --from=ghcr.io/astral-sh/uv:0.8.22 /uv /usr/local/bin/uv
COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node

WORKDIR /app

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project --no-cache --extra web --extra rag

COPY agent ./agent
COPY config ./config
COPY graph ./graph
COPY memory ./memory
COPY models ./models
COPY rag ./rag
COPY tools ./tools
COPY compat.py agui_server.py agui_history.py langgraph_graphs.py langgraph.json cli.py main.py ./

COPY --from=frontend /frontend/.next/standalone ./frontend
COPY --from=frontend /frontend/.next/static ./frontend/.next/static
COPY --from=frontend /frontend/public ./frontend/public

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    AGUI_HOST=0.0.0.0 \
    AGUI_PORT=8000 \
    FRONTEND_PORT=3000 \
    AGUI_BACKEND_URL=http://127.0.0.1:8000/agui \
    TAHOEPILOT_LOCAL_DIR=/data

EXPOSE 8000 3000
ENTRYPOINT ["entrypoint.sh"]
CMD ["backend"]
