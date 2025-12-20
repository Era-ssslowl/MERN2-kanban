# TaskFlow - Quick Start Guide

## Fastest Way to Run (Docker)

```bash
# 1. Start all services
docker-compose up --build

# 2. Wait for all services to be healthy (~2-3 minutes)

# 3. Seed database (in new terminal)
docker-compose exec api npm run seed

# 4. Open browser
http://localhost:3000

# 5. Login with demo credentials
Email: john@example.com
Password: password123
```

## What's Running?

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/graphql
- **MongoDB**: localhost:27017
- **Mongo Express** (DB Admin): http://localhost:8081

## Test Realtime Features

1. Open two browser windows
2. Login as different users in each:
   - Window 1: `john@example.com` / `password123`
   - Window 2: `jane@example.com` / `password123`
3. Navigate to the same board in both windows
4. Create a card in Window 1
5. Watch it appear instantly in Window 2 ✨

## Common Commands

```bash
# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart api

# Remove everything (including data)
docker-compose down -v
```

## Troubleshooting

**Services won't start?**
- Make sure Docker is running
- Check ports 3000, 4000, 8081, 27017 are not in use

**Can't login?**
- Make sure you ran the seed command
- Try restarting the API service

**Realtime not working?**
- Check WebSocket connection in browser DevTools → Network → WS
- Ensure both users are on the same board

## Next Steps

- Read the full [README.md](README.md)
- Check out the API in GraphQL Playground: http://localhost:4000/graphql
- Explore the codebase structure
- Run tests: `docker-compose exec api npm test`

---

Happy coding! 🚀
