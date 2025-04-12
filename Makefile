install:
	npm install

lint: 
	npx eslint .

lint-fix:
	npx eslint --fix

start:
	npx webpack serve --open

build:
	npx webpack

