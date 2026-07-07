# Memory Optimization Plan

## Issues Found & Fixes

### Critical Memory Issues:

1. **[server.ts] requestCounts memory leak** - Map stores IP→timestamps[] but never cleans up stale entries
2. **[API.ts] lookupIP opens mmdb reader every request** - `maxmind.open()` reads entire ~80MB file each call
3. **[User.ts] absurdly large limits** - `search()` and `getAll()` use `limit: 1000000000000`, fetching ALL users
4. **[User.ts] register() loads ALL users** - Calls `getAll()` just to check duplicate email/nickname
5. **[API.ts + RecordMessages.ts] Duplicate Supabase clients** - Two separate clients created
6. **[User.ts + AppUpdateCheck.ts + VVApps.ts + server.ts] Multiple Sign instances** - Redundant objects
7. **[server.ts] Verbose request logging** - Stringify entire headers/body every request
8. **[tgbot.ts] Global console.log for every message** - Unnecessary memory retention

### Minor Optimizations:
- Remove unused/unnecessary console.log that retains objects
- Pre-compile regex patterns