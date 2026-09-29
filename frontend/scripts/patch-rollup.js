const fs = require('fs');
const path = require('path');

const nativePath = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist', 'native.js');
if (fs.existsSync(nativePath)) {
  let content = fs.readFileSync(nativePath, 'utf8');
  if (!content.includes("@rollup/wasm-node/dist/native.js")) {
    const target = 'const nativeModule = requireWithFriendlyError(';
    const replacement = `let nativeModule;
try {
	nativeModule = requireWithFriendlyError(
		existsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`
	);
} catch (e) {
	try {
		nativeModule = require('@rollup/wasm-node/dist/native.js');
	} catch (err) {
		throw e;
	}
}
const _dummy = (`;
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(nativePath, content, 'utf8');
      console.log('Successfully patched rollup native.js for wasm fallback.');
    }
  }
}
