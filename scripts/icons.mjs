{
  "name": "sportnoten",
  "version": "3.2.0",
  "description": "Sportnoten – Notenverwaltung für den Sportunterricht",
  "author": "Simon Mählmann",
  "license": "UNLICENSED",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node scripts/build.mjs",
    "android:add": "npm run build && npx cap add android",
    "android:sync": "npm run build && npx cap sync android",
    "icons": "npx capacitor-assets generate --android",
    "icons:make": "node scripts/icons.mjs"
  },
  "dependencies": {
    "@capacitor/android": "^6.2.0",
    "@capacitor/cli": "^6.2.0",
    "@capacitor/core": "^6.2.0"
  },
  "devDependencies": {
    "@babel/standalone": "^7.26.0",
    "@capacitor/assets": "^3.0.5",
    "sharp": "^0.33.5"
  }
}
