.PHONY: build test

build:
	cd impl && yarn build

test: build
	cd tests && yarn execute