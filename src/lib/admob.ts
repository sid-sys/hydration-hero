import { 
  AdMob, 
  BannerAdPosition, 
  BannerAdSize, 
  AdOptions, 
  BannerAdOptions
} from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

// Production AdMob IDs
const ANDROID_APP_ID = 'ca-app-pub-2778983812131153~9585766111';
const ANDROID_BANNER_ID = 'ca-app-pub-2778983812131153/3239849612';
const ANDROID_INTERSTITIAL_ID = 'ca-app-pub-2778983812131153/4029219503';

// iOS Production AdMob IDs
const IOS_APP_ID = 'ca-app-pub-2778983812131153~4078288562';
const IOS_BANNER_ID = 'ca-app-pub-2778983812131153/1236502808';
const IOS_INTERSTITIAL_ID = 'ca-app-pub-2778983812131153/8706831112';

export async function initializeAdMob() {
  if (!Capacitor.isNativePlatform()) return;
  
  await AdMob.initialize({
    initializeForTesting: false, // Set to true to use test ads during development
  });
}

export async function showBanner() {
  if (!Capacitor.isNativePlatform()) return;

  const adId = Capacitor.getPlatform() === 'ios' ? IOS_BANNER_ID : ANDROID_BANNER_ID;

  const options: BannerAdOptions = {
    adId: adId,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.TOP_CENTER,
    margin: 0,
    isTesting: false // Set to true during development
  };

  try {
    await AdMob.showBanner(options);
  } catch (e) {
    console.error('Banner failed to show', e);
  }
}

export async function hideBanner() {
  if (!Capacitor.isNativePlatform()) return;
  await AdMob.removeBanner();
}

export async function showInterstitial() {
  if (!Capacitor.isNativePlatform()) return;

  const adId = Capacitor.getPlatform() === 'ios' ? IOS_INTERSTITIAL_ID : ANDROID_INTERSTITIAL_ID;

  const options: AdOptions = {
    adId: adId,
    isTesting: false // Set to true during development
  };

  try {
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  } catch (e) {
    console.error('Interstitial failed', e);
  }
}


