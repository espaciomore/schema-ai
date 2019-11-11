proxy = console.log;

exports.log = (text) => {
  if(process.env.NODE_ENV == 'dev'){
    proxy(text);
  } else {
      if(text.message !== undefined) {
          proxy(text.message.split('\n').shift());
      } else {
          proxy(text);
      }
  }
};
