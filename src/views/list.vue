<template>
  <div class="hello">
    <h1>vue</h1>
    <h2>{{msg}}</h2>
    <p><button type="button" id="export-table" @click="exportFunc">下载excel文件</button></p>
    <div id="out-table">
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>姓名</td>
            <td>年龄</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>111111</td>
            <td>我是前端开发</td>
            <td>今年29岁</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
console.log(FileSaver);
export default {
  name: 'helloworld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    };
  },
  methods: {
    exportFunc: function(e) {
      // 从表生成工作簿对象
      var wb = XLSX.utils.table_to_book(document.getElementById('out-table'));
      // 得到二进制字符串作为输出
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'binary'
      });
      FileSaver.saveAs(new Blob([this.s2ab(wbout)], {
        type: 'application/octet-stream'
      }), 'a.xlsx');
    },
    s2ab: function(s) {
      var cuf;
      var i;
      if (typeof ArrayBuffer !== 'undefined') {
        cuf = new ArrayBuffer(s.length);
        var view = new Uint8Array(cuf);
        for (i = 0; i !== s.length; i++) {
          view[i] = s.charCodeAt(i) & 0xFF;
        }
        return cuf;
      } else {
        cuf = new Array(s.length);
        for (i = 0; i !== s.length; ++i) {
          cuf[i] = s.charCodeAt(i) & oxFF;
        }
        return cuf;
      }
    }
  },
  components: {
    FileSaver,
    XLSX
  }
};
</script>
