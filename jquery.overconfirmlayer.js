/**
 * (c) 2015 Yoshida Yuki
 * @param $ jquery
 */
(function($) {
  var jqueryoverlayId = "";

  $.fn.overlay = function( arg ){

    /**
     * rgbaの透過度と、filterの透過度
     * 0.1:1A 0.2:33 0.3:4d 0.4:66 0.5:80 0.6:99 0.7:B3 0.8:CC 0.9:E6 1:FF
     * #80000000 = 80:透過度 000000:RGB
     */
    var defaults = {
        "id" : "jq_overlay",
        "fadeSpeed" : "fast",
        "isCloseBtn" : true,
        "backgroundColor" : "#000000", /* opacity で指定すると、レイヤー上の文字も透明になるため、rgbaで指定 */
        "opacity" : "0.5",
        "rgba" : "rgba( 0, 0, 0, 0.5 )",
        "css" : {
          "position" : "fixed",
          "width"    : "100%",
          "height"   : "100%",
          "left" : "0px",
          "top"  : "0px",
          "padding" : "0px",
          "margin"  : "0px",
          "display" : "none",
        },
        "closebtncss" : {
        }
    };

    if( typeof( arg ) == "undefined" ){
      arg = defaults;
    }

    var target = $( this );

    /* obj arg to obj before expand */
    arg.css = $.extend( defaults.css , arg.css );
    arg.closecss = $.extend( defaults.closecss , arg.closecss );
    var options = $.extend( defaults , arg );
    if( typeof( options.rgba ) != "" && options.rgba != "" ){
      options.css["background-color"] = options.rgba;
    }else{
      options.css["background-color"] = options.backgroundColor;
      options.css["opacity"] = options.opacity;
    }

    jqueryoverlayId = options.id;

    overlay = $( "#" + options.id );
    overlayClsBtn = $( "#clsLay_" + options.id );

    // overlay create
    if( overlay.length === 0 ){
      target.append( "<div id='" + options.id + "' style='display:none;' class='ovfirm_" + options.id + "_children'></div>" );
      overlay = $( "#" + options.id );
      // create closed button
      var clsbtnHtml = "";
      if( options.isCloseBtn === true ) clsbtnHtml = "<a id='clsLay_" + options.id + "' class='jqoverconfirmlay_close_button' >×</a>";
      overlay.append( clsbtnHtml );
      overlayClsBtn = $( "#clsLay_" + options.id );

      // overlay css
      overlay.css( options.css );

      overlayClsBtn.css( options.closebtncss );
      overlayClsBtn.on( "click" , function(){
        $( ".ovfirm_" + options.id + "_children" ).fadeOut( options.fadeSpeed );
      });
    }

    overlay.fadeIn( options.fadeSpeed );
    //$( ".ovfirm_" + options.id + "_children" ).fadeIn( options.fadeSpeed );
    $( ".ovfirm_" + options.id + "_children" ).css( "display", "block" );

    // メソッドチェーン対応(thisを返す)
    return( this );
  };

  /**
   * オーバーレイを閉じる
   */
  $.fn.overlayclose = function( arg ){

    var target = $( this );

    // 引数を設定する
    var defaults = {
      "id" : jqueryoverlayId,
      "fadeSpeed" : "fast"
    };
    if( typeof( arg ) == "undefined" ) arg = defaults;
    var options = $.extend( defaults , arg );
    $( ".ovfirm_" + options.id + "_children" ).fadeOut();

  };

  /**
   * コンフォームレイヤー
   */
  $.fn.overconfirmlay = function( arg ){
    var target = $( this );
    // 引数を設定する
    var defaults = {
      "overlayoptions" : {
        "id" : "" /* 自身のIDをprefixとするため、#オーバーレイのID で挿入 */
      },
      "id" : "confirmlayer",
      "innerhtml" : "よろしいですか？",
      "yesflg" : true,
      "yesVal" : "Yes",
      "noflg" : true,
      "noVal" : "No",
      "cancelflg" : false,
      "cancelVal" : "Cancel",
      "css" : {
        "min-width" : "300px",
        "background-color" : "white",
        "position" : "absolute",
        "text-align" : "left",
        "border-color": "skyblue",
        "border-style" : "solid",
        "border-width" : "1.5em 1px 1px 1px",
        "padding" : "1em",
        "box-sizing": "border-box"
      },
      "yesfunction" : function(){},
      "nofunction" : function(){},
      "cancelfunction" : function(){},
      "done" :function(){ $(this).overlayclose(); }
    };
    if( typeof( arg ) == "undefined" ){
      arg = defaults;
    }

    // 引数の結合
    arg.overlayoptions.css = $.extend( defaults.overlayoptions.css , arg.overlayoptions.css );
    arg.overlayoptions = $.extend( defaults.overlayoptions , arg.overlayoptions );
    arg.css = $.extend( defaults.css , arg.css );
    var options = $.extend( defaults , arg );
    if( options.overlayoptions.id === "" ) options.overlayoptions.id = options.id + "_ol";  // オーバーレイのID

    target.overlay( options.overlayoptions );
    confirmlayer = target.children( "#" + options.id );
    var confirmlayerFooter = confirmlayer.children(  "#" + options.id + "_footer" );
    if( confirmlayer.length === 0 ){
      target.append( "<div id='" + options.id + "' class='jqoverconfirmlay_confirmlay ovfirm_" + options.overlayoptions.id + "_children' >" + options.innerhtml + "</div>" );
      confirmlayer = target.children( "#" + options.id );
      confirmlayer.css( options.css );
      // ボタンcontainer
      confirmlayer.append( "<div id='" + options.id + "_footer'></div>" );
      confirmlayerFooter = confirmlayer.children(  "#" + options.id + "_footer" );
      confirmlayerFooter.append( "<ul></ul>" );
      confirmlayerFooter.children( "ul" ).css({
        "list-style" : "none",
        "float" : "right"
      });
      var confirmlayerFooterUl = confirmlayerFooter.children( "ul" );
      if( options.yesflg === true ){
        confirmlayerFooterUl.append( "<li><button id='btn_" + options.id + "_yes'>" + options.yesVal + "</button></li>" );
        $( "#btn_" + options.id + "_yes" ).on( "click", function(){
          options.yesfunction();
          options.done();
        });
      }
      if( options.noflg === true ){
        confirmlayerFooterUl.append( "<li><button id='btn_" + options.id +"_no'>" + options.noVal + "</button></li>" );
        $( "#btn_" + options.id + "_no" ).on( "click", function(){
          options.nofunction();
          options.done();
        });
      }
      if( options.cancelflg === true ){
        confirmlayerFooterUl.append( "<li><button id='btn_" + options.id +"_calcel'>" + options.cancelVal + "</button></li>" );
        $( "#btn_" + options.id + "_calcel" ).on( "click", function(){
          options.cancelfunction();
          options.done();
        });
      }
      confirmlayerFooter.find( "li" ).css({
        "float" : "left",
        "margin-left" : "1px",
        "margin-right" : "1px",
      });
    }
    //drag.setDragItem( options.id );
    // 垂直水平中央合わせ
    confirmlayer.css({
      "left" : Math.floor( ( $(window).width() - confirmlayer.width() ) / 2 ),
      "top" : Math.floor( ( $(window).height() - confirmlayer.height() ) / 2 - 50 )
    });
    //drag.maxZIndex++;

  };


  /**
   * waiting image 表示
   */
  $.fn.overwaitboxlay = function( arg ){
    var target = $( this );
    // 引数を設定する
    var defaults = {
      "id" : "jq_overconfirm_waitbox",
      "text" : "しばらくおまちください...",
      "imgsrc" : "/brk/imgdata/circling_white_blue.gif",
      "imgcss" : "",
      "overlayoptions" : {
        "background-color" : "yellow",
        "isCloseBtn" : false,
      },
      "confirmlaycss" : {
        "width" : "auto",
        "height" : "auto",
        "background-color" : "white",
        "position" : "absolute",
        "text-align" : "left",
        "border-color" : "",
        "border-style" : "none",
        "border-width" : "0",
        "padding" : "1em"
      }
    };
    if( typeof( arg ) == "undefined" ){
      arg = defaults;
    }
    // 引数の結合
    arg.overlayoptions = $.extend( defaults.overlayoptions , arg.overlayoptions );
    arg.confirmlaycss = $.extend( defaults.confirmlaycss , arg.confirmlaycss );
    var options = $.extend( defaults , arg );
    var innerhtml = "";
    innerhtml += "<p>";
    if( options.imgsrc != "" ) innerhtml += "<img src='" + options.imgsrc + "' style='vertical-align: middle;' />";
    innerhtml += options.text + "</p>";

    var overlayoptions = $.extend( options.overlayoptions , { "id" : options.id + "_ol" } );

    target.overconfirmlay({
      "innerhtml" : innerhtml,
      "id" : options.id + "_cfm",
      "overlayoptions" : overlayoptions,
      "css" : options.confirmlaycss,
      "yesflg" : false,
      "noflg" : false,
      "cancelflg" : false,
    });
  };

})(jQuery);