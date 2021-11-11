const
  watch = require('node-watch'),
  fs = require('fs'),
  exec = require('child_process').exec,
  suffixesForJsRecompilation = ['ts', 'tsx'],
  suffixesForCssRecompilation = ['scss'],
  compilationTimeout = 500;

let
  jsCompilationTimeoutId = null;
  cssCompilationTimeoutId = null;

const shouldFileTriggerRecompilation = function(filename, interestingSuffixes) {
  const
    shards = filename.split('.'),
    suffix = shards[shards.length - 1],
    isSuffixForRecompilation = function(suffixForRecompilation) {
      return suffix == suffixForRecompilation;
    };

  if(suffix && interestingSuffixes.find(isSuffixForRecompilation)) {
    return true;
  } else {
    return false;
  }
}

watch('src/js', { recursive: true }, (eventType, filename) => {
  if(shouldFileTriggerRecompilation(filename, suffixesForJsRecompilation)) {
    jsCompilationTimeoutId = debounce(jsCompilationTimeoutId, compileJs);
  }
});

watch('src/scss', { recursive: true },(eventType, filename) => {
  if(shouldFileTriggerRecompilation(filename, suffixesForCssRecompilation)) {
    cssCompilationTimeoutId = debounce(cssCompilationTimeoutId, compileCss);
  }
});

const debounce = function(timeoutId, f) {
  if(timeoutId) {
    clearTimeout(timeoutId);
  }

  return setTimeout(f, compilationTimeout);
}

const runTask = function(task) {
  let before = new Date();

  exec(task, function(err, stdoutput, stderrput) {

    if(stdoutput) {
      console.log(`[stdout] ${stdoutput}`);
    }

    if(stderrput) {
      console.error(`[stderr] ${stderrput}`);
    }

    if (!stderrput && stdoutput) {
      console.log('Success');
    }

    let diff = (new Date() - before);
    console.log(`Completed in ${diff}ms`);
  });
}

const compileJs = function() {
  console.log('');
  console.log('Compiling JS');

  runTask('make compile_to_js');
}

const compileCss = function() {
  console.log('');
  console.log('Compiling CSS');

  runTask('make compile_to_css_for_development');
}

const compile = function() {
  console.log('Compiling both JS and CSS');

  runTask('make dev');
}

compile();
