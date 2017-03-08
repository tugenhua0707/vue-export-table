/*
 zTree 依赖 结构  <ul id="ztreeId" class="ztree"></ul>
 */
var zTree;
var modalInst;
var ZTreeSingle = function() {
  this.init();
};
ZTreeSingle.prototype = {
  init: function() {
    var stylesheet = '.ztree{float: left; width: 220px; padding: 0; padding-top: 22px; background: #393857; overflow:hidden;}' + 
    '.hidden{display:none}'+
    '.ztree-content{margin-left: 220px; height: 100%;}'+ 
    '.ztree-content .ztop{height:80px; background: #fff; overflow: hidden;}' + 
    '.ztree-content .ztop .title{font-size: 18px;color: #393857;margin-top: 20px;margin-left: 20px;font-weight: 700;}' +
    '.ztree-content .ztop .stitle{font-size: 12px; margin-left: 20px;margin-top: 6px;}' + 
    '.zcontent{border-radius:5px; -webkit-border-radius: 5px; background: #fff;margin: 20px;height:100%;overflow: hidden }' +
    '.zcontent ul{display: block; margin: 40px 30px 0; border: 1px solid #d1e1ee}' +
    '.zcontent ul li {border-bottom: 1px solid #d1e1ee; height: 44px; overflow: hidden;}'+
    '.zcontent li:last-child {border-bottom: none; }' + 
    '.zcontent .title {float: left;width: 100px;background: #EAEFF3;height: 44px;padding-left: 20px;line-height: 44px;color: #393857;font-size: 14px;}' +
    '.zcontent .value {margin-left: 139px;height: 44px;line-height:44px;}'+
    '.remodal p{font-size: 16px}'+
    '.ztree li span{color: #fff; opacity: 0.5;}'+
    '.ztree li span.useless{opacity: 0.3 !important;}'+
    '.ztree li ul.level0.line{border-left: none}' + 
    '.ztree li span.button.add {margin-left: 2px; margin-right: -1px; background-position: -144px 0; vertical-align: top; *vertical-align: middle;}' + 
    '.ztree li ul.line{background: none; border-left: 1px dotted rgba(142, 140, 231, 0.42);margin-left:8px;}' + 
    '.ztree li ul{padding-left: 10px; padding-top: 4px; }'+
    '.ztree li{position: relative}'+
    '.ztree li a {padding-left: 4px; padding-right: 100%; }' +
    '.ztree li .add, .ztree li .remove {position: absolute;right: 0; top: 0;z-index: 100;}' + 
    '.ztree li span.button.remove, .ztree li span.button.add {background: url("@@@PREFIX@@@/images/del.png") no-repeat 0 0;background-size: 15px 18px;width: 15px; height: 18px; opacity: 1;}' + 
    '.ztree li span.button.add{background: url("@@@PREFIX@@@/images/add.png") no-repeat 0 0; background-size: 15px 18px;}'+
    '.ztree li .aParent .add, .ztree li .aParent .remove{top: 8px}' +
    '.ztree li span.button.center_open, .ztree li span.button.bottom_open, .ztree li span.button.roots_open {opacity:1; background: url("@@@PREFIX@@@/images/jian.png") no-repeat 0 0;background-size: 10px 2px; width: 10px;height: 10px;margin-left: 4px;margin-top: 7px;}' + 
    '.ztree li span.button.center_close, .ztree li span.button.bottom_close, .ztree li span.button.roots_close{opacity: 1; background: url("@@@PREFIX@@@/images/plus.png") no-repeat 0 0; background-size: 10px 10px; width: 10px; height: 10px; margin-left: 4px;}'+
    '.ztree li .add{right: 20px}' +
    '.ztree li span.button.ico_open, .ztree li span.button.ico_close, .ztree li span.button.ico_docu{display: none}'+
    '.ztree li a.curSelectedNode{border: none;background: none;padding-top: 1px; color: #fff; opacity: 1;}'+
    '.ztree li .white{color: #fff;opacity: 1;}'+
    '.ztree li a.curSelectedNode span {opacity: 1}'+
    '.ztree li a.curSelectedNode:hover{text-decoration: none}'+
    '.ztree .li_open{background: #30304D;}'+
    '.ztree .fontsize14 {font-size: 14px; opacity: 1}'+
    '.ztree .margintop14{ padding-left: 16px; padding-bottom: 8px; padding-top: 8px;}';

    var win_open = '<div class="remodal" data-remodal-id="modal" id="j-modal">' +
                      '<button data-remodal-action="close" class="remodal-close"></button>'+
                      '<p></p>'+
                      '<button data-remodal-action="cancel" class="remodal-cancel hidden">取消</button>'+
                      '<button data-remodal-action="confirm" class="remodal-confirm">确定</button>'+
                    '</div>';
    // 动态增加样式
    this.addStyleSheet(stylesheet);
    // 动态增加弹窗html结构
    $('body').prepend(win_open);

    // 弹窗实例化
    modalInst = $('[data-remodal-id=modal]').remodal();
  },
  // JS 动态添加css样式
  addStyleSheet: function(refWin, cssText, id){        
     var self = this;
     if(self.isString(refWin)) {
         id = cssText;
         cssText = refWin;
         refWin = window;
     }
     refWin = $(refWin);
     var doc = document;
     var elem; 
     if (id && (id = id.replace('#', ''))) {
         elem = $('#' + id, doc);
     }

     // 仅添加一次，不重复添加
     if (elem) {
         return;
     }
     //elem = $('<style></style>'); 不能这样创建 IE8有bug
     elem =  document.createElement("style");         
     // 先添加到 DOM 树中，再给 cssText 赋值，否则 css hack 会失效
     $('head', doc).append(elem);
     if (elem.styleSheet) { // IE
        elem.styleSheet.cssText = cssText;
     } else { // W3C
         $(elem).append(doc.createTextNode(cssText));
     }
  },
  isString: function(str) {
    return Object.prototype.toString.apply(str) === '[object String]';
  },
  beforeRemove: function(treeId, treeNode) {
    if (treeNode.status === 0 || $("#" + treeNode.tId + '_span').hasClass('useless')) {
      zSingle.noAddMenu();
      $("#j-modal p").html("该节点已经处于废弃状态~");
      $(".remodal-confirm").removeClass("J_UnLessNode");
      return false;
    }
    zSingle.noSubMenu();
    $('.remodal-cancel').removeClass('hidden');
    $(".remodal-confirm").addClass("J_UnLessNode");
    $("#j-modal p").html("确认废弃该节点 -- " + treeNode.accName + " 吗？");

    // 为了获取treeNode 因此dom操作放在里面进行
    $(document).on('click', '.J_UnLessNode', function(){
      // 如果它有子节点的话， 那么需要递归遍历当前根节点下的所有子节点，使它们也被废弃
      zSingle.allChilds(treeNode);
    });
    return false;
  },

  noAddMenu: function() {
    modalInst.open();
    $('.remodal-cancel').addClass('hidden');
    $("#j-modal p").html('已被废弃,不能增加菜单了');
    $(".remodal-confirm").removeClass("J_UnLessNode");
  },
  noSubMenu: function() {
    modalInst.open();
    $('.remodal-cancel').addClass('hidden');
    $("#j-modal p").html('不能再增加菜单了');
    $(".remodal-confirm").removeClass("J_UnLessNode");
  },
  addHoverDom: function(treeId, treeNode) {
    var status,
        isNoUser;
    var sObj = $("#" + treeNode.tId + "_span");
    if ($("#addBtn_"+treeNode.tId).length > 0) {
      return;
    }
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
      + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) {
      btn.bind("click", function(){

        if (treeNode.status === 0 || $("#" + treeNode.tId + '_span').hasClass('useless')) {
          zSingle.noAddMenu();
          $("#j-modal p").html("该节点已经处于废弃状态~");
          $(".remodal-confirm").removeClass("J_UnLessNode");
          return false;
        }
        var aParent = $(this).closest('a');
        var level;
        if (zTree.getSelectedNodes()[0]) {

          // 获取状态 是否被废弃状态
          status = zTree.getSelectedNodes()[0].status;
          if (status === 0) {
            isNoUser = zSingle.noAddMenu();
            return false;
          }
          // 如果是第四层菜单的话 不允许再增加子菜单
          level = zTree.getSelectedNodes()[0].level;
          if (level > 2) {
            zSingle.noSubMenu();
            return false;
          }
        } else {
          // 获取状态 是否被废弃状态
          status = treeNode.status;
          if (status === 0) {
            isNoUser = zSingle.noAddMenu(status);
            return false;
          }
          // 如果是第四层菜单的话 不允许再增加子菜单
          level = treeNode.level;
          if (level > 2) {
            zSingle.noSubMenu();
            return;
          }
        }
        zTree.addNodes(treeNode, {id:null, pId:treeNode.id, accName:"new node" });
        $("#" + treeNode.tId).addClass('li_open');
        // 获取所有的节点数据, 是否显示 废弃 文案
        var nodes = zTree.getNodes();
        zSingle.isUseless(nodes);
        return false;
      });
    }
  },
  removeHoverDom: function(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
  },
  ajaxRequest: function(cfg) {
    var method = method || 'GET';
    var url = cfg.url,
        method = cfg.method || 'GET',
        data = cfg.data || {},
        callback = cfg.callback || null;

    $.ajax({
      url: url,
      type: method,
      data: data,
      dataType: 'json',
      success: function(data) {
        callback && $.isFunction(callback) && callback(data);
      },
      error: function(error) {
        callback && $.isFunction(callback) && callback(error);
      }
    });
  },
  // 对所有子节点进行操作
  allChilds: function(treeNode) {
    var subListElem = treeNode.subList;
    $("#" + treeNode.tId + '_span').addClass('useless');
    var spanHtml = $("#" +treeNode.tId + '_span').html();
    if (spanHtml && spanHtml.indexOf('废弃') === -1) {
      $("#" +treeNode.tId + '_span').append('(废弃)')
    }
    if (subListElem && subListElem.length) {
      // 进行递归调用
      for (var i = 0, ilen = subListElem.length; i < ilen; i++) {
        zSingle.allChilds(subListElem[i]);
      }
    }
  },
  // 获取所有父节点的name值 -- 通过递归的方式
  getAllParentName: function(node) {
    var arrs = [];
    var rAllNodesName = function(node) {
       var name = node.name;
       var tId = node.tId;
       arrs.push({
         name: name,
         tId: tId
       });
       // 如果该节点有父节点的话， 使用递归的方式 递归获取
       var parentNode = node.getParentNode();
       if (parentNode && parentNode.name) {
          rAllNodesName(parentNode);
       }
    };
    rAllNodesName(node);
    return arrs;
  },
  clearClassWhite: function() {
    $("#ztreeId").find('span').removeClass("white");
  },
  zTreeOnClick: function(event, treeId, treeNode) {
    // 获取当前子节点的name和父节点name
    var allNodesName = zSingle.getAllParentName(treeNode);
    zSingle.clearClassWhite();
    var status = treeNode.status;
    if (status === 0) {
      return false;
    }
    for (var i = 0, ilen = allNodesName.length; i < ilen; i++) {
      $("#" + allNodesName[i].tId + '_span').addClass('white');
    }
  },
  zTreeOnExpand: function(event, treeId, treeNode) {
    // 获取所有的节点数据, 是否显示 废弃 文案
    var nodes = zTree.getNodes();
    zSingle.isUseless(nodes);

    if (treeNode.open) {
      $("#" + treeNode.tId).addClass('li_open');
    } 
    // 如果它有子节点的话， 那么需要递归遍历当前根节点下的所有子节点，使它们也被废弃
    if ($("#" + treeNode.tId + '_span').hasClass("useless")) {
      zSingle.allChilds(treeNode);
    }
  },
  zTreeOnCollapse: function(event, treeId, treeNode) {
    if (!treeNode.open) {
      $("#" + treeNode.tId).removeClass('li_open');
    }
  },
  // 判断节点是否需要显示废弃状态--- 通过递归的方式遍历子节点
  isUseless: function(nodes) {
    var rAllNodesisStatus = function(node) {
      var status = node.status;
      if (status === 0) {
        var spanHtml = $("#" +node.tId + '_span').html();
        if (spanHtml && spanHtml.indexOf('废弃') === -1) {
          $("#" +node.tId + '_span').append('(废弃)');
          $("#" +node.tId + '_span').addClass('useless');
        }
      }
      var subList = node.subList;
      if (subList && subList.length) {
        for (var j = 0, jlen = subList.length; j < jlen; j++) {
          rAllNodesisStatus(subList[j]);
        }
      }
    };
    if (nodes && nodes.length) {
      for (var i = 0, ilen = nodes.length; i < ilen; i++) {
        rAllNodesisStatus(nodes[i]);
      }
    }
  }
}
// 实例化
var zSingle = new ZTreeSingle();

var zNodes = [
  { id:1, parentId:null, accName:"父节点 1",level:0,status:0,
    subList:[
      { 
        id:11, 
        parentId:1, 
        accName:"叶子节点 1-1", 
        subList: [
          { 
            id:111, 
            parentId:11, 
            accName:"叶子节点 1-1-1",
            status:0,
            subList: [
              { id:1111, parentId:111, accName:"叶子节点 1-1-2",status:0}
            ]
          }
        ]
      },
      { id:12, parentId:1, accName:"叶子节点 1-2"},
      { id:13, parentId:1, accName:"叶子节点 1-3"}
    ]
  },
  { id:2, parentId:null, accName:"父节点 2",status:1,level:0, 
    subList: [
      { id:21, parentId:2, accName:"叶子节点 2-1"},
      { id:22, parentId:2, accName:"叶子节点 2-2"},
      { id:23, parentId:2, accName:"叶子节点 2-3"}
    ]
  },  
  { id:3, parentId:null, accName:"父节点 3",status:1,level:0,
    subList: [
      { id:31, parentId:3, accName:"叶子节点 3-1"},
      { id:32, parentId:3, accName:"叶子节点 3-2"},
      { id:33, parentId:3, accName:"叶子节点 3-3"}
    ]
  } 
];
var setting = {
  view: {
    addHoverDom: zSingle.addHoverDom,
    removeHoverDom: zSingle.removeHoverDom,
    selectedMulti: false,
    addRemoveBtn: zSingle.addRemoveBtn
  },
  edit: {
    enable: true,
    showRemoveBtn: true,
    showRenameBtn: false
  },
  data: {
    simpleData: {
      enable: true,
      idKey: 'id',
      pIdKey: 'parentId'
    },
    key: {
      name: 'accName',
      children: 'subList'
    }
  },
  callback: {
    beforeRemove: zSingle.beforeRemove,
    onClick: zSingle.zTreeOnClick,
    onExpand: zSingle.zTreeOnExpand,
    onCollapse: zSingle.zTreeOnCollapse
  }
};
$(document).ready(function(){
  $.fn.zTree.init($("#ztreeId"), setting, zNodes);
  zTree = $.fn.zTree.getZTreeObj("ztreeId"); 
  var nodes = zTree.getNodesByFilter(function(node) {
    return node.level === 0
  });
  $(nodes).each(function(index, item){
    $("#" + item.tId).addClass('margintop14');
    $("#" + item.tId).find('a').addClass('aParent');
    $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
  })
  // 获取所有的节点数据, 是否显示 废弃 文案
  var allNodes = zTree.getNodes();
  zSingle.isUseless(allNodes);
});
