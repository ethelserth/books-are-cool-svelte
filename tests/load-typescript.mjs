import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

// Exercise the real server modules with explicit API doubles, without credentials or network calls.
export function loadTypescript(filename, mocks = {}, cache = new Map()) {
	const absolute = path.resolve(filename);
	if (cache.has(absolute)) return cache.get(absolute);
	const module = { exports: {} };
	cache.set(absolute, module.exports);
	const nativeRequire = createRequire(absolute);
	const require = (specifier) => {
		if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
		if (specifier.startsWith('.') || specifier.startsWith('$lib/')) {
			const target = specifier.startsWith('$lib/')
				? path.resolve('src/lib', specifier.slice(5))
				: path.resolve(path.dirname(absolute), specifier);
			return loadTypescript(`${target}.ts`, mocks, cache);
		}
		return nativeRequire(specifier);
	};
	const compiled = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
		compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
	}).outputText;
	new Function('require', 'module', 'exports', compiled)(require, module, module.exports);
	return module.exports;
}
