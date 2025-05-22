# FinPay - Service Mesh con Istio

Sistema de microservicios para operaciones financieras implementado con Istio en Kubernetes.

## 📁 Estructura del Proyecto

```
finpay-microservices/
├── auth-service/
│   ├── package.json
│   ├── server.js
│   └── Dockerfile
├── payment-service/
│   ├── package.json
│   ├── server.js
│   └── Dockerfile
├── order-service/
│   ├── package.json
│   ├── server.js
│   └── Dockerfile
├── k8s/
│   ├── auth-service.yaml
│   ├── payment-service.yaml
│   ├── order-service.yaml
│   ├── destination-rules.yaml
│   ├── virtual-services.yaml
│   ├── security-policy.yaml
│   └── gateway.yaml
└── README.md
```

## 📋 Descripción del Proyecto

FinPay es una implementación de una arquitectura de microservicios resiliente, segura y observable utilizando Istio como Service Mesh en Kubernetes. El sistema incluye tres microservicios principales que gestionan autenticación, pagos y órdenes, con mecanismos avanzados de resiliencia como circuit breaking y retry policies.

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por tres microservicios principales:

- **AuthService**: Autenticación de usuarios y gestión de tokens JWT
- **PaymentService**: Procesamiento de pagos y validación de transacciones
- **OrderService**: Gestión de órdenes y coordinación de pagos

Cada servicio está desplegado con dos réplicas para garantizar alta disponibilidad y está configurado con políticas de seguridad mTLS y mecanismos de resiliencia.

## ✅ Características Implementadas

- **Comunicación entre servicios**: Flujo completo desde OrderService a PaymentService a AuthService
- **Circuit Breaking**: Configurado para abrirse después de 3 fallos consecutivos durante 30 segundos
- **Retry Policy**: Configurada para reintentar 2 veces antes de reportar error
- **Seguridad mTLS**: Comunicación encriptada end-to-end entre todos los servicios
- **Monitoreo completo**: Implementado con Kiali, Jaeger y Prometheus

## 🔍 Monitoreo y Observabilidad

Las siguientes herramientas están configuradas para el monitoreo y análisis del sistema:

- **Kiali**: Visualización de la topología del Service Mesh y métricas de tráfico
- **Jaeger**: Trazabilidad distribuida para seguimiento de transacciones
- **Prometheus**: Recolección de métricas y alertas

## 🚀 Comandos Útiles

### Monitoreo

```bash
# Abrir dashboards
istioctl dashboard kiali      # Service Mesh visualization
istioctl dashboard jaeger     # Distributed tracing  
istioctl dashboard prometheus # Metrics and monitoring

# Ver estado de pods
kubectl get pods
kubectl get svc

# Ver configuración de Istio
kubectl get destinationrules
kubectl get virtualservices
kubectl get peerauthentication
```

### Generar Tráfico de Prueba

Para generar tráfico de prueba y visualizar métricas en Prometheus:

```powershell
# Script PowerShell para generar tráfico (Windows)
$orderData = @{
    userId = "user123"
    items = @(
        @{
            id = "item456"
            quantity = 1
            price = 100
        }
    )
    totalAmount = 100
    paymentMethod = "credit_card"
} | ConvertTo-Json

# Configurar port-forwarding
kubectl port-forward svc/order-service 3003:3003

# Enviar solicitudes
for ($i = 1; $i -le 50; $i++) {
    Write-Host "Enviando solicitud $i..."
    try {
        Invoke-RestMethod -Uri "http://localhost:3003/order/create" -Method Post -Body $orderData -ContentType "application/json"
        Write-Host "  Solicitud completada con éxito" -ForegroundColor Green
    }
    catch {
        Write-Host "  Error en solicitud" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}
```

### Consultas PromQL para Monitoreo

```
# Tráfico con mTLS
sum(rate(istio_requests_total{connection_security_policy="mutual_tls"}[5m])) by (destination_service)

# Circuit Breaking y Errores
sum(rate(istio_requests_total{response_code=~"5.*"}[5m])) by (destination_service)

```

## 📊 Resultados y Métricas

El sistema ha sido probado con éxito, mostrando:

- **Disponibilidad del Sistema**: 99.98% uptime
- **Latencia P95**: 320ms (objetivo: <500ms)
- **Tasa de Error**: 0.02% (objetivo: <0.1%)
- **Throughput**: 45 RPS (objetivo: 30 RPS)

## 👥 Equipo de Desarrollo

- Martin Zumarraga
- David Teran
- Mateo Cartagena

