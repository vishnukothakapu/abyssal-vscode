#!/usr/bin/env bash

# Abyssal shell syntax highlighting fixture

set -euo pipefail

readonly APP_NAME="abyssal"
readonly API_URL="https://api.example.com"
readonly DEFAULT_PORT=3000

log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "[ERROR] $1" >&2
}

check_command() {
    local command_name="$1"

    if ! command -v "$command_name" >/dev/null 2>&1; then
        log_error "Required command not found: $command_name"
        return 1
    fi

    return 0
}

fetch_users() {
    local url="$1"

    curl \
        --silent \
        --show-error \
        --fail \
        "$url/users"
}

main() {
    log_info "Starting ${APP_NAME}"
    log_info "API: ${API_URL}"
    log_info "Port: ${DEFAULT_PORT}"

    check_command "curl"

    local response
    response="$(fetch_users "$API_URL")"

    if [[ -z "$response" ]]; then
        log_error "Empty response"
        exit 1
    fi

    echo "$response"

    for user in Alice Bob Charlie; do
        echo "Processing user: $user"
    done

    if [[ "${DEBUG:-false}" == "true" ]]; then
        log_info "Debug mode enabled"
    else
        log_info "Debug mode disabled"
    fi
}

main "$@"