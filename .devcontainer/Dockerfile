FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Install Firebase CLI
RUN npm install -g firebase-tools

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Set `SHELL` env var for VS Code
ENV SHELL=/bin/bash