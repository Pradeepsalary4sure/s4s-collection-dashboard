# Fix: `otpHash` Unknown Argument Error

## Steps

- [x] Read relevant files (authController.js, otpService.js, schema.prisma)
- [x] Create plan and get approval
- [x] **1. Edit `schema.prisma`** — Change `otp String? @db.VarChar(6)` → `otp String? @db.VarChar(64)`
- [x] **2. Edit `authController.js`** — Fix all `otpHash` references to `otp`
  - [x] `sendOtp`: `otpHash` → `otp: otpHash` in update data
  - [x] `verifyOtp`: `user.otpHash` → `user.otp`
  - [x] `verifyOtp`: `otpHash: null` → `otp: null`
- [x] **3. Run Prisma migration** — Applied to database (running in terminal)

