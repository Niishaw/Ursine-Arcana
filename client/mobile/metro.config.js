const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Fix for Firebase "Component auth has not been registered yet" error
// Add .cjs support for Firebase's CommonJS modules
config.resolver.sourceExts.push('cjs');
// Disable package.json exports field which conflicts with Firebase in Expo SDK 53+
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './src/styles/global.css' });
