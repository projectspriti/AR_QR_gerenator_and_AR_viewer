# Quick Start: Getting AR Plane Detection to Work

## 🚨 CRITICAL: HTTPS is Required!

**Plane detection (surface tracking) will NOT work without HTTPS.** This is a browser security requirement for WebXR.

## Quick Setup Steps

### For Local Testing (Recommended: Use ngrok)

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # Or use npm: npm install -g ngrok
   ```

2. **Start your backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Expose backend with ngrok:**
   ```bash
   ngrok http 5000
   ```
   Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

4. **Update backend/.env:**
   ```
   BACKEND_URL=https://abc123.ngrok.io
   ```

5. **Restart backend** and access through ngrok URL

### Testing AR

1. **Upload a model** through the frontend
2. **Get the QR code** or AR viewer URL
3. **Open on mobile device** (Android with Chrome/Edge or iOS with Safari)
4. **Ensure HTTPS** - URL must start with `https://`
5. **Click "View in AR"** button
6. **Allow camera** permissions
7. **Point at flat surface** (table, floor)
8. **Move device slowly** - wait for "Surface detected" message
9. **Tap surface** to place model

## Device Requirements

### ✅ Works On:
- **Android:** Chrome/Edge with ARCore support (Android 7.0+)
- **iOS:** Safari on iOS 12+ (uses scene-viewer, not WebXR)

### ❌ Won't Work On:
- Desktop browsers (limited WebXR support)
- HTTP connections (must use HTTPS)
- Unsupported browsers (Firefox, Opera on mobile)

## Common Issues

### "No plane detection"
→ **Solution:** Use HTTPS (not HTTP)

### "AR button doesn't appear"
→ **Solution:** Check if model loaded, verify WebXR support

### "Camera not working"
→ **Solution:** Grant permissions, use HTTPS

### "Surface not detected"
→ **Solution:** 
- Improve lighting
- Try textured surface (not plain white wall)
- Move device slowly
- Ensure good camera view of surface

## Testing Checklist

- [ ] Using HTTPS URL
- [ ] Testing on mobile device
- [ ] Supported browser (Chrome/Edge Android, Safari iOS)
- [ ] Camera permissions granted
- [ ] Good lighting
- [ ] Flat, textured surface visible
- [ ] Device moved slowly for tracking

## Need Help?

See `AR_TROUBLESHOOTING.md` for detailed troubleshooting guide.

---

**Remember:** HTTPS is mandatory for plane detection to work!

