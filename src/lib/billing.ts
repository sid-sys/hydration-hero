/**
 * billing.ts — Google Play & App Store IAP via cordova-plugin-purchase v13
 *
 * Product ID: "remove_ads"  ($1.99 one-time purchase)
 * Must be created in Play Console → Monetize → In-App Products before testing.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const CdvPurchase: any; // injected by cordova-plugin-purchase at runtime

const PRODUCT_ID = "remove_ads";

let storeReady = false;
let onPremiumGranted: (() => void) | null = null;

/**
 * Call once on app startup. Pass the callback that grants premium access.
 */
export function initBilling(onGranted: () => void) {
  // Guard: don't run in browser / Vite dev
  if (typeof CdvPurchase === "undefined") {
    console.warn("[Billing] CdvPurchase not available — running in browser mode");
    return;
  }

  onPremiumGranted = onGranted;
  const { store, ProductType, Platform } = CdvPurchase;

  // Register the product for both Google Play and AppStore
  store.register([
    {
      id: PRODUCT_ID,
      type: ProductType.NON_CONSUMABLE,
      platform: Platform.GOOGLE_PLAY,
    },
    {
      id: PRODUCT_ID,
      type: ProductType.NON_CONSUMABLE,
      platform: Platform.APPLE_APPSTORE,
    },
  ]);

  // Verify and approve all receipts (server-side optional, we trust locally for now)
  store.when()
    .productUpdated(() => { /* products loaded */ })
    .approved((transaction: any) => {
      transaction.verify();
    })
    .verified((receipt: any) => {
      receipt.finish();
    })
    .finished((transaction: any) => {
      // Ownership confirmed — check if it's our product
      const owned = transaction.products?.some((p: any) => p.id === PRODUCT_ID);
      if (owned && onPremiumGranted) {
        onPremiumGranted();
      }
    })
    .receiptUpdated((receipt: any) => {
      // Called after restore — check all transactions
      const owned = receipt.transactions?.some((t: any) =>
        t.products?.some((p: any) => p.id === PRODUCT_ID)
      );
      if (owned && onPremiumGranted) {
        onPremiumGranted();
      }
    });

  store.initialize([Platform.GOOGLE_PLAY, Platform.APPLE_APPSTORE])
    .then(() => {
      storeReady = true;
      console.log("[Billing] Store initialized");
      // Auto-restore owned purchases on startup
      store.restorePurchases();
    })
    .catch((err: any) => {
      console.error("[Billing] Store init failed:", err);
    });
}

/**
 * Trigger the purchase flow for "remove_ads".
 */
export async function purchaseRemoveAds(): Promise<void> {
  if (typeof CdvPurchase === "undefined") {
    console.warn("[Billing] CdvPurchase not available — simulating purchase in dev");
    // In browser/dev, just call the callback directly
    onPremiumGranted?.();
    return;
  }

  if (!storeReady) {
    console.warn("[Billing] Store not ready yet");
    return;
  }

  const { store, Platform } = CdvPurchase;
  const product = store.get(PRODUCT_ID, Platform.GOOGLE_PLAY)
    ?? store.get(PRODUCT_ID, Platform.APPLE_APPSTORE);

  if (!product) {
    console.error("[Billing] Product not found:", PRODUCT_ID);
    return;
  }

  const offer = product.getOffer();
  if (!offer) {
    console.error("[Billing] No offer for product:", PRODUCT_ID);
    return;
  }

  try {
    await offer.order();
  } catch (err) {
    console.error("[Billing] Purchase failed:", err);
  }
}

/**
 * Restore previous purchases (required button for App Store guidelines).
 */
export async function restorePurchases(): Promise<void> {
  if (typeof CdvPurchase === "undefined") {
    console.warn("[Billing] CdvPurchase not available — cannot restore in browser");
    return;
  }

  const { store } = CdvPurchase;
  try {
    await store.restorePurchases();
    console.log("[Billing] Restore complete");
  } catch (err) {
    console.error("[Billing] Restore failed:", err);
  }
}
