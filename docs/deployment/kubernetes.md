# Kubernetes Deployment

## Prerequisites

- kubectl configured with your cluster
- Helm (optional, for monitoring)

## Deploy

```bash
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
```

## Verify

```bash
kubectl get pods -n koko
kubectl get svc -n koko
kubectl get ingress -n koko
```

## Scaling

```bash
kubectl scale deployment koko-api --replicas=5 -n koko
```

## Rolling update

```bash
kubectl set image deployment/koko-api koko-api=ecr/repo:tag -n koko
```
