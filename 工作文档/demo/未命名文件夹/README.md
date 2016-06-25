# H5--移动端知识点整理 <br/>
## 1. 在UC浏览器下input光标定位的问题。<br/>
  ### 比如如下简单的代码，给input框设置高度和行高；<br/>
  ### 如下代码：<br/>
  <input type="text" class="input-cls"/>
  <pre>
  a,button,input,optgroup,select,textarea{
      outline: none;
  }
  .input-cls {
    width:10rem;
    height:2rem;
    border:1px solid red;
    line-height: 2rem;
    text-indent: 0.12rem;
    font-size: 1rem;
  }
  </pre>
  在UC浏览器下会显示如下效果: <br/>
  <img src="http://images2015.cnblogs.com/blog/561794/201606/561794-20160625170655344-1968154825.jpg"/><br/>
  其他浏览器下还好，但是比如qq浏览器一刚开始光标在整个input框内，当输入的时候，会居中对齐；<br/>
  ## 如上解决的方法有2种；<br/>
  ## 第一种方案是不设置input的行高；如下代码：<br/>
  <pre>
     .input-cls {
        width:10rem;
        height:2rem;
        border:1px solid red;
        text-indent: 0.12rem;
        font-size: 1rem;
      }
  </pre><br/>

  ## 第二种解决方法是设置padding和高度一起使用；<br/>
  代码如下：
  <pre>
     .input-cls {
        width:10rem;
        height:1rem;
        line-height:1rem;
        padding:0.5rem 0;
        border:1px solid red;
        text-indent: 0.12rem;
        font-size: 1rem;
      }
  </pre><br/>
 在UC浏览器下会显示如下效果: <br/>
  <img src="http://images2015.cnblogs.com/blog/561794/201606/561794-20160625170720844-987241925.jpg"/>
  <br/>

