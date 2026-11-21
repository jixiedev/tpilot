# One image for all TahoePilot components; pick one with the first argument.
#
#   docker build -f docker/Dockerfile -t tahoepilot .            (from repo root)
#   docker run -p 8000:8000 --env-file secrets.env -v $PWD/config:/tahoepilot/config tahoepilot backend
#   docker run -p 3000:3000 -v $PWD/config:/tahoepilot/config tahoepilot frontend
#   docker run -p 3000:3000 -p 8000:8000 --env-file secrets.env tahoepilot all
#   docker run -it --env-file secrets.env tahoepilot cli
#
# Settings (ports, URLs, paths, agents, models) come only from files in the config
# directory, $TAHOEPILOT_CONFIG_DIR (default /tahoepilot/config). Secrets (API keys,
# passwords, tokens named by *_env keys in those files) come from the secrets file,
# $TAHOEPILOT_SECRETS_FILE (default /tahoepilot/secrets/secrets.env; mount a k8s Secret
# there), or from real env vars (--env-file / envFrom). See secrets.env.example.
#
# See docker/entrypoint.sh for the full list of commands.
#
# Layout (WORKDIR /tahoepilot):
#   /tahoepilot/config           every configuration file (toml/json, agents/, metrics/);
#                                mount a ConfigMap here to override the bundled copy
#   /tahoepilot/semantic_models  dbt semantic models (<db>/<model>.{yml,sql});
#                                mount the git-sync volume here
#   /tahoepilot/secrets          secrets.env (KEY=value lines); mount a k8s Secret here
#   /data                        runtime state; mount a PVC and set [paths].data_dir = "/data"
#                                in runtime.toml
#   /root/.cache/tahoepilot/models
#                                RAG embedding + rerank weights (BAAI/bge-m3,
#                                BAAI/bge-reranker-v2-m3), baked in at build time from
#                                config/rag.toml; [local_models].dir must resolve here.
#                                Skip with --build-arg RAG_MODELS=0 (then mount the
#                                weights there, or run `python -m tahoepilot.rag download`).

# ---- frontend build ----
FROM node:22-slim AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/app ./app
COPY frontend/public ./public
COPY frontend/next.config.ts frontend/tsconfig.json frontend/postcss.config.mjs frontend/next-env.d.ts frontend/proxy.ts ./
RUN npm run build

# ---- python dependencies (shared by the model download and the runtime) ----
FROM python:3.11-slim AS pydeps

COPY --from=ghcr.io/astral-sh/uv:0.8.22 /uv /usr/local/bin/uv

WORKDIR /tahoepilot

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project --no-cache --extra web --extra rag

ENV PATH="/tahoepilot/.venv/bin:$PATH" \
    PYTHONPATH=/tahoepilot \
    PYTHONUNBUFFERED=1 \
    TAHOEPILOT_CONFIG_DIR=/tahoepilot/config

# ---- Hugging Face models for RAG (embedding + rerank) ----
# Only the files the download needs are copied, so this multi-GB layer is rebuilt
# only when tahoepilot/rag/, tahoepilot/settings/ or config/rag.toml change. Duplicate pytorch_model.bin
# weights are dropped where model.safetensors exists (transformers prefers it).
FROM pydeps AS hfmodels
ARG RAG_MODELS=1
COPY tahoepilot/__init__.py ./tahoepilot/__init__.py
COPY tahoepilot/settings ./tahoepilot/settings
COPY tahoepilot/rag ./tahoepilot/rag
COPY config/rag.toml ./config/rag.toml
RUN mkdir -p /root/.cache/tahoepilot/models \
 && if [ "$RAG_MODELS" = "1" ]; then \
      python -m tahoepilot.rag download \
      && for d in /root/.cache/tahoepilot/models/*/*/; do \
           if [ -f "${d}model.safetensors" ]; then rm -f "${d}pytorch_model.bin"; fi; \
           rm -rf "${d}.cache"; \
         done; \
    fi

# ---- runtime ----
FROM pydeps

COPY --from=node:22-slim /usr/local/bin/node /usr/local/bin/node
COPY --from=hfmodels /root/.cache/tahoepilot/models /root/.cache/tahoepilot/models

# The whole project, minus what .dockerignore (a mirror of .gitignore) leaves out.
COPY . .

# The built frontend goes over the frontend sources copied above.
COPY --from=frontend /frontend/.next/standalone ./frontend
COPY --from=frontend /frontend/.next/static ./frontend/.next/static
COPY --from=frontend /frontend/public ./frontend/public

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENV TAHOEPILOT_SECRETS_FILE=/tahoepilot/secrets/secrets.env

EXPOSE 8000 3000
ENTRYPOINT ["entrypoint.sh"]
CMD ["backend"]
