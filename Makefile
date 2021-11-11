DIST=src/dist
INPUT_APP_NAME=CNBExchangeRates
OUTPUT_APP_NAME=app

JS_INPUT=src/js/${INPUT_APP_NAME}.tsx
JS_OUTPUT=${DIST}/${OUTPUT_APP_NAME}.js
JS_MIN_OUTPUT=${DIST}/${OUTPUT_APP_NAME}.min.js
JS_MIN_GZIPPED_OUTPUT=${JS_MIN_OUTPUT}.gz

CSS_INPUT=src/scss/${INPUT_APP_NAME}.scss
CSS_OUTPUT=${DIST}/${OUTPUT_APP_NAME}.css
CSS_MIN_OUTPUT=${DIST}/${OUTPUT_APP_NAME}.min.css
CSS_MIN_GZIPPED_OUTPUT=${CSS_MIN_OUTPUT}.gz

.DEFAULT_GOAL := dev
.PHONY: clean
.PHONY: clean_js
.PHONY: clean_css

clean: clean_js clean_css

clean_js:
	rm -rf ${JS_OUTPUT} ${JS_MIN_OUTPUT} ${JS_MIN_GZIPPED_OUTPUT}

clean_css:
	rm -rf ${CSS_OUTPUT} ${CSS_MIN_OUTPUT} ${CSS_MIN_GZIPPED_OUTPUT}


# Development #

dev: compile_to_js compile_to_css_for_development


compile_to_css_for_development: clean_css
	sass --no-source-map ${CSS_INPUT}:${CSS_OUTPUT}


# Production #

build: clean compile_to_js compile_to_css_for_development uglify_js gzip_js compile_to_css gzip_css

compile_to_js:
	tsc --outFile ${JS_OUTPUT}

uglify_js:
	uglifyjs --compress --mangle -- ${JS_OUTPUT} > ${JS_MIN_OUTPUT}

gzip_js:
	yes | gzip --keep --best --force ${JS_MIN_OUTPUT} > ${JS_MIN_GZIPPED_OUTPUT}

compile_to_css:
	sass --no-source-map ${CSS_INPUT}:${CSS_MIN_OUTPUT} --style compressed

gzip_css:
	yes | gzip --keep --best --force ${CSS_MIN_OUTPUT} > ${CSS_MIN_GZIPPED_OUTPUT}
