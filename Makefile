install: install-deps

install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

rss:
	node bin/

lint:
	npx eslint .

publish:
	npm publish --dry-run
