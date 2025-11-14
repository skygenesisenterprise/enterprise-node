#!/bin/bash

# 🐳 Docker Build Script pour Enterprise SDK
# Script pour construire et gérer les images Docker du SDK

set -e

# Configuration
IMAGE_NAME="skygenesisenterprise/enterprise-node"
VERSION="1.1.4"
REGISTRY=""  # Laisser vide pour Docker Hub, ou mettre votre registry

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Afficher l'aide
show_help() {
    cat << EOF
🐳 Enterprise SDK Docker Build Script

Usage: $0 [COMMAND] [OPTIONS]

COMMANDS:
    build [target]     Construire l'image Docker
        targets: base, demo, dev, all (default: all)
    
    push [target]      Pousser l'image vers le registry
        targets: base, demo, dev, all (default: all)
    
    run [target]       Lancer un conteneur
        targets: demo, dev, quickstart, nextjs
    
    clean              Nettoyer les images et conteneurs
    
    test               Tester les builds
    
    help               Afficher cette aide

EXAMPLES:
    $0 build all                    # Construire toutes les images
    $0 build demo                   # Construire seulement l'image demo
    $0 run demo                     # Lancer la démo
    $0 push all                     # Pousser toutes les images
    $0 clean                        # Nettoyer tout

ENVIRONMENT VARIABLES:
    AI_API_KEY                      Clé API pour le module IA
    DOCKER_REGISTRY                 Registry Docker personnalisé
    NO_CACHE                        Construire sans cache

EOF
}

# Construire les images Docker
build_images() {
    local target=${1:-"all"}
    
    log_info "Construction des images Docker pour Enterprise SDK..."
    
    # Préfixe du registry si spécifié
    local full_image_name="${REGISTRY}${IMAGE_NAME}"
    
    case $target in
        "base")
            log_info "Construction de l'image de base..."
            docker build --target base -t "${full_image_name}:${VERSION}" \
                ${NO_CACHE:+--no-cache} .
            docker tag "${full_image_name}:${VERSION}" "${full_image_name}:latest"
            log_success "Image de base construite: ${full_image_name}:${VERSION}"
            ;;
        "demo")
            log_info "Construction de l'image demo..."
            docker build --target demo -t "${full_image_name}:${VERSION}-demo" \
                ${NO_CACHE:+--no-cache} .
            log_success "Image demo construite: ${full_image_name}:${VERSION}-demo"
            ;;
        "dev")
            log_info "Construction de l'image de développement..."
            docker build --target development -t "${full_image_name}:${VERSION}-dev" \
                ${NO_CACHE:+--no-cache} .
            log_success "Image dev construite: ${full_image_name}:${VERSION}-dev"
            ;;
        "all")
            build_images "base"
            build_images "demo"
            build_images "dev"
            ;;
        *)
            log_error "Target inconnu: $target"
            show_help
            exit 1
            ;;
    esac
}

# Pousser les images
push_images() {
    local target=${1:-"all"}
    local full_image_name="${REGISTRY}${IMAGE_NAME}"
    
    log_info "Push des images vers le registry..."
    
    case $target in
        "base")
            docker push "${full_image_name}:${VERSION}"
            docker push "${full_image_name}:latest"
            ;;
        "demo")
            docker push "${full_image_name}:${VERSION}-demo"
            ;;
        "dev")
            docker push "${full_image_name}:${VERSION}-dev"
            ;;
        "all")
            push_images "base"
            push_images "demo"
            push_images "dev"
            ;;
        *)
            log_error "Target inconnu: $target"
            exit 1
            ;;
    esac
    
    log_success "Images poussées avec succès!"
}

# Lancer un conteneur
run_container() {
    local target=${1:-"demo"}
    local full_image_name="${REGISTRY}${IMAGE_NAME}"
    
    log_info "Lancement du conteneur $target..."
    
    case $target in
        "demo")
            docker run --rm -it \
                -e AI_API_KEY="${AI_API_KEY:-}" \
                "${full_image_name}:${VERSION}-demo"
            ;;
        "dev")
            docker run --rm -it \
                -p 3000:3000 \
                -p 9229:9229 \
                -v "$(pwd):/app" \
                "${full_image_name}:${VERSION}-dev"
            ;;
        "quickstart")
            docker run --rm -it \
                "${full_image_name}:latest" \
                node examples/quick-start.js
            ;;
        "nextjs")
            log_warning "Le service Next.js nécessite docker-compose. Utilisez: docker-compose --profile nextjs up"
            docker-compose --profile nextjs up enterprise-nextjs
            ;;
        *)
            log_error "Target inconnu: $target"
            exit 1
            ;;
    esac
}

# Nettoyer les images et conteneurs
clean_docker() {
    log_info "Nettoyage des ressources Docker..."
    
    # Arrêter les conteneurs liés
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Supprimer les images
    local full_image_name="${REGISTRY}${IMAGE_NAME}"
    docker rmi "${full_image_name}:${VERSION}" 2>/dev/null || true
    docker rmi "${full_image_name}:latest" 2>/dev/null || true
    docker rmi "${full_image_name}:${VERSION}-demo" 2>/dev/null || true
    docker rmi "${full_image_name}:${VERSION}-dev" 2>/dev/null || true
    
    # Nettoyer les images pendantes
    docker image prune -f
    
    log_success "Nettoyage terminé!"
}

# Tester les builds
test_builds() {
    log_info "Test des builds Docker..."
    
    # Test de build de base
    log_info "Test du build de base..."
    docker build --target base -t enterprise-test-base .
    
    # Test que l'image peut démarrer
    log_info "Test de démarrage de l'image de base..."
    docker run --rm enterprise-test-base --version
    
    # Nettoyer l'image de test
    docker rmi enterprise-test-base
    
    log_success "Tests de build réussis!"
}

# Main
case ${1:-"help"} in
    "build")
        build_images "${2:-"all"}"
        ;;
    "push")
        push_images "${2:-"all"}"
        ;;
    "run")
        run_container "${2:-"demo"}"
        ;;
    "clean")
        clean_docker
        ;;
    "test")
        test_builds
        ;;
    "help"|*)
        show_help
        ;;
esac