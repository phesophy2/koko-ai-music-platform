# Testing

## Rust backend

```bash
cargo test                    # unit tests
cargo test --test integration  # integration tests
```

## Python generation service

```bash
pytest tests/                 # unit + integration
pytest --cov=src tests/       # with coverage
```

## Frontend

```bash
npm test                      # unit tests (Vitest)
npm run test:e2e              # E2E tests (Playwright)
```

## CI

All tests run automatically on GitHub Actions for every push and pull request.
