# AR Plane Detection Troubleshooting Guide

## Why Plane Detection Might Not Work

Plane detection (surface tracking) requires specific conditions to function properly. Here's what you need to know:

## ✅ Requirements for Plane Detection

### 1. **HTTPS Connection (CRITICAL)**
- **WebXR requires HTTPS** - This is mandatory for security reasons
- Local development: Use `https://localhost` or a tool like `ngrok`
- Production: Must use HTTPS certificate
- **Without HTTPS, plane detection will NOT work**

### 2. **Browser & Device Compatibility**

#### Android:
- ✅ **Chrome/Edge** with ARCore support
- ✅ Android 7.0+ (Nougat)
- ✅ Device must support ARCore (check: https://developers.google.com/ar/discover/supported-devices)
- ❌ Firefox, Opera - Limited support

#### iOS:
- ✅ **Safari** on iOS 12+
- ✅ Uses ARKit (scene-viewer mode)
- ❌ Chrome on iOS - Limited AR support

#### Desktop:
- ❌ Most desktop browsers don't support WebXR AR
- ✅ Use mobile device for best experience

### 3. **Environment Conditions**
- **Good lighting** - Plane detection needs visible surfaces
- **Textured surfaces** - Plain white walls are harder to detect
- **Flat surfaces** - Tables, floors, desks work best
- **Stable device** - Move slowly for better tracking

## 🔧 How to Test Plane Detection

### Step 1: Check HTTPS
```bash
# The AR viewer URL should start with https://
# NOT http://
```

### Step 2: Check Browser Support
Open browser console and run:
```javascript
if ('xr' in navigator) {
  navigator.xr.isSessionSupported('immersive-ar').then(supported => {
    console.log('WebXR AR supported:', supported);
  });
} else {
  console.log('WebXR not available');
}
```

### Step 3: Test on Mobile Device
1. Ensure you're using HTTPS
2. Open the AR viewer page
3. Tap "View in AR" button
4. Allow camera permissions
5. Point at a well-lit, textured surface
6. Move device slowly - you should see tracking indicators

## 🐛 Common Issues & Solutions

### Issue: "No plane detection / No surface tracking"

**Possible Causes:**
1. ❌ **Not using HTTPS** - Most common issue!
2. ❌ Browser doesn't support WebXR
3. ❌ Device doesn't support ARCore/ARKit
4. ❌ Poor lighting conditions
5. ❌ Surface too plain/featureless

**Solutions:**
- ✅ Use HTTPS (use ngrok for local testing)
- ✅ Test on supported device (Android with ARCore or iOS 12+)
- ✅ Improve lighting
- ✅ Try different surfaces (wooden table, carpeted floor)

### Issue: "AR button doesn't appear"

**Solutions:**
- Check if model loaded successfully
- Verify WebXR support in browser
- Try scene-viewer mode (iOS Safari)

### Issue: "Camera permission denied"

**Solutions:**
- Grant camera permissions in browser settings
- Use HTTPS (required for camera access)
- Check device camera is working

## 🚀 Quick Setup for HTTPS (Local Development)

### Option 1: Using ngrok (Recommended)

1. Install ngrok:
```bash
npm install -g ngrok
# or download from https://ngrok.com/
```

2. Start your backend:
```bash
cd backend
npm start
```

3. In another terminal, expose backend:
```bash
ngrok http 5000
```

4. Update `.env` with ngrok URL:
```
BACKEND_URL=https://your-ngrok-url.ngrok.io
```

5. Access frontend through ngrok or use HTTPS for frontend too

### Option 2: Using mkcert (Local HTTPS)

1. Install mkcert:
```bash
# Windows (using Chocolatey)
choco install mkcert

# Or download from https://github.com/FiloSottile/mkcert
```

2. Create local CA:
```bash
mkcert -install
```

3. Generate certificates:
```bash
mkcert localhost 127.0.0.1
```

4. Update server to use HTTPS (requires Express HTTPS setup)

## 📱 Testing Checklist

- [ ] Using HTTPS (not HTTP)
- [ ] Testing on mobile device (not desktop)
- [ ] Using supported browser (Chrome/Edge on Android, Safari on iOS)
- [ ] Device supports ARCore (Android) or ARKit (iOS)
- [ ] Camera permissions granted
- [ ] Good lighting conditions
- [ ] Textured, flat surface visible
- [ ] Model file loaded successfully
- [ ] "View in AR" button appears
- [ ] AR session starts when button clicked

## 🎯 Expected Behavior

1. **After clicking "View in AR":**
   - Camera should activate
   - You should see camera feed
   - Status should show "Move device to detect surfaces..."

2. **During surface detection:**
   - Move device slowly over a flat surface
   - Status should change to "Surface detected! Tap to place model"
   - You may see visual indicators (varies by browser)

3. **After tapping surface:**
   - Model should appear at tapped location
   - Status should show "Model placed!"
   - You can move around to view from different angles

## ⚠️ Important Notes

- **Desktop browsers** generally don't support WebXR AR - use mobile
- **iOS** uses scene-viewer mode (different from WebXR)
- **Plane detection quality** depends on device sensors and lighting
- **First-time setup** may require additional permissions

## 🔗 Useful Links

- [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [ARCore Supported Devices](https://developers.google.com/ar/discover/supported-devices)
- [Model Viewer Documentation](https://modelviewer.dev/)
- [WebXR Samples](https://immersiveweb.dev/)

## 💡 Pro Tips

1. **Test in well-lit room** with varied textures
2. **Move device slowly** - fast movements break tracking
3. **Use flat surfaces** - tables and floors work best
4. **Keep device stable** - avoid shaking
5. **Check console logs** for detailed error messages

---

**Remember:** HTTPS is **MANDATORY** for WebXR plane detection. Without it, the feature simply won't work!

