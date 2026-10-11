import assert from 'node:assert/strict';
import { resolveGeminiWatermarkSearchConfigs } from '../vendor/gemini-watermark-remover/src/core/geminiSizeCatalog.js';
import { getEmbeddedAlphaMap } from '../vendor/gemini-watermark-remover/src/core/embeddedAlphaMaps.js';

const exact2k = resolveGeminiWatermarkSearchConfigs(1696, 2528, null);
assert.deepEqual(exact2k[0], { logoSize: 96, marginRight: 64, marginBottom: 64 });

const exact1k = resolveGeminiWatermarkSearchConfigs(768, 1376, null);
assert.deepEqual(exact1k[0], { logoSize: 48, marginRight: 32, marginBottom: 32 });

assert.equal(getEmbeddedAlphaMap(48).length, 48 * 48);
assert.equal(getEmbeddedAlphaMap(96).length, 96 * 96);
console.log('Upstream Gemini catalog and alpha maps: PASS');
