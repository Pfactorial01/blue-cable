# blue-cable

An API that serves as a Cloud Backup System

# Commands
- Build:  
```
npm run build
```
- Start production server:
```
npm run start
```
- Start development server:
```
npm run dev
```
- Test:
```
npm run test
```

# Running on Docker

```
docker compose up
```
then:
```
docker exec -it blue-cable-api-1 [command]
```
e.g
To run tests on docker:
```
docker exec -it blue-cable-api-1 npm run test
```
