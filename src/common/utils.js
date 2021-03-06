  // debounce防抖函数
export function debounce (func, delay) {

    let timer = null

    return function (...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        func.apply(this,args)
      },delay)
    }
  }

  // 2.将data进行格式化，转成对应的字符串
  export function formatDate(date, fmt) {
    // 1.获取年份
    // 并不确定别人会传进来几个y
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    // 2.获取
    // M+ -> 正则表达式中的一个规则
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  };
  // substr:截取
  function padLeftZero (str) {
    return ('00' + str).substr(str.length);
  };