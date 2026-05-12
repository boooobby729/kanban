/* ===== Insight Bar ===== */
function renderOV(){
  var sd=sorted('pv',false);
  var insights=[];

  /* 1. 曝光最高 */
  var topPV=sd[0];
  insights.push({icon:'crown',color:MC.pv,text:'曝光最高',name:topPV.name,val:fmt(topPV.d[P].pv),cat:topPV.cat,cls:topPV.cls});

  /* 2. CVR 最高 */
  var topCVR=sorted('cv',false)[0];
  insights.push({icon:'bolt',color:MC.cv,text:'CVR 最高',name:topCVR.name,val:topCVR.d[P].cv+'%',cat:topCVR.cat,cls:topCVR.cls});

  /* 3. UV点击率最高 */
  var topUV=sorted('uv',false)[0];
  insights.push({icon:'click',color:MC.uv,text:'点击率最高',name:topUV.name,val:topUV.d[P].uv+'%',cat:topUV.cat,cls:topUV.cls});

  /* 4. 需关注：CVR 最低 */
  var lowCVR=sorted('cv',true)[0];
  insights.push({icon:'alert',color:'#dc2626',text:'CVR 最低',name:lowCVR.name,val:lowCVR.d[P].cv+'%',cat:lowCVR.cat,cls:lowCVR.cls});

  /* 5. 环比变化最大（如果有环比数据） */
  var periods=['week','month','year'];
  var idx=periods.indexOf(P);
  if(idx>0){
    var prev=periods[idx-1];
    var maxDrop=null,maxDropR=null;
    D.forEach(function(r){
      var cur=r.d[P].cv,pre=r.d[prev].cv;
      if(pre>0){
        var chg=((cur-pre)/pre*100);
        if(maxDrop===null||chg<maxDrop){maxDrop=chg;maxDropR=r;}
      }
    });
    if(maxDropR&&maxDrop<0){
      insights.push({icon:'down',color:'#dc2626',text:'CVR 环比降幅最大',name:maxDropR.name,val:maxDrop.toFixed(1)+'%',cat:maxDropR.cat,cls:maxDropR.cls});
    }
  }

  var iconMap={
    crown:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20l-2-12-5 5-3-7-3 7-5-5z"/></svg>',
    bolt:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    click:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 15l-2 5L9 9l11 4-5 2z"/><path d="M22 22l-5-10"/></svg>',
    alert:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    down:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>'
  };

  var h='';
  insights.forEach(function(ins){
    h+='<div class="ins-tag" style="--ins-color:'+ins.color+'">';
    h+='<span class="ins-icon" style="color:'+ins.color+'">'+iconMap[ins.icon]+'</span>';
    h+='<span class="ins-label">'+ins.text+'</span>';
    h+='<span class="ins-name">'+ins.name+'</span>';
    h+='<span class="ins-val" style="color:'+ins.color+'">'+ins.val+'</span>';
    h+='<span class="ins-cat '+ins.cls+'">'+ins.cat+'</span>';
    h+='</div>';
  });

  document.getElementById('ovGrid').innerHTML=h;
}

/* ===== Chart Linkage ===== */
var _linkCat=null; /* currently highlighted category name, null = none */
var _linkItem=null; /* currently highlighted single item name, null = none */

/* --- Category-level highlight (used by pie chart) --- */
function highlightCategory(catName){
  if(_linkCat===catName&&!_linkItem) return;
  _linkCat=catName;_linkItem=null;
  _applyHighlight();
}

/* --- Item-level highlight (used by bubble & bar charts) --- */
function highlightItem(itemName){
  if(_linkItem===itemName) return;
  _linkItem=itemName;_linkCat=null;
  _applyHighlight();
}

function clearHighlight(){
  _linkCat=null;_linkItem=null;
  _applyHighlight();
}

function _applyHighlight(){
  var catName=_linkCat;
  var itemName=_linkItem;

  /* --- pie chart: highlight matching sector --- */
  if(pieChart){
    var cats=['弹窗','Feed 挂卡','异形卡'];
    var matchCat=catName;
    if(itemName){
      for(var k=0;k<D.length;k++){if(D[k].name===itemName){matchCat=D[k].cat;break;}}
    }
    cats.forEach(function(cat,i){
      if(!matchCat&&!itemName){ pieChart.dispatchAction({type:'downplay',seriesIndex:0,dataIndex:i}); }
      else if(cat===matchCat){ pieChart.dispatchAction({type:'highlight',seriesIndex:0,dataIndex:i}); }
      else { pieChart.dispatchAction({type:'downplay',seriesIndex:0,dataIndex:i}); }
    });
  }

  /* --- bar chart: dim non-matching bars --- */
  if(barChart){
    var sd=sorted('pv',false);
    barChart.setOption({animationDurationUpdate:350,animationEasingUpdate:'cubicInOut',series:[{data:sd.map(function(r){
      var match;
      if(itemName) match=(r.name===itemName);
      else if(catName) match=(r.cat===catName);
      else match=true;
      return {value:r.d[P].pv,itemStyle:{color:CC[r.cls],borderRadius:[4,4,0,0],opacity:match?1:0.15}};
    })}]});
  }

  /* --- bubble chart: dim non-matching dots --- */
  if(bubChart){
    var maxPV=Math.max.apply(null,D.map(function(r){return r.d[P].pv;}));
    bubChart.setOption({animationDurationUpdate:350,animationEasingUpdate:'cubicInOut',series:[{},{},{
      data:D.map(function(r){
        var d=r.d[P];
        var match;
        if(itemName) match=(r.name===itemName);
        else if(catName) match=(r.cat===catName);
        else match=true;
        return {value:[d.uv,d.cv,d.pv],name:r.name,itemStyle:{opacity:match?0.85:0.08,borderColor:'#fff',borderWidth:1.5}};
      }),
      label:{show:true,formatter:function(p){var n=p.name;return n.length>4?n.slice(0,3)+'…':n;},position:'right',color:'#999',fontSize:10,distance:4}
    }]});
  }

  /* --- table rows: highlight matching --- */
  var rows=document.querySelectorAll('.tbl-row');
  rows.forEach(function(row){
    var nameEl=row.querySelector('.tbl-name');
    var tag=row.querySelector('.tbl-tag');
    if(!tag||!nameEl) return;
    var rowCat=tag.textContent;
    var rowName=nameEl.textContent;
    var match;
    if(itemName) match=(rowName===itemName);
    else if(catName) match=(rowCat===catName);
    else match=true; /* clear */
    if(!catName&&!itemName){
      row.style.opacity='';row.style.background='';row.style.transform='';
    } else if(match){
      row.style.opacity='1';row.style.background='rgba(232,89,12,.04)';row.style.transform='scale(1)';
    } else {
      row.style.opacity='0.25';row.style.background='';row.style.transform='scale(0.99)';
    }
  });
}

/* ===== Pie Chart (Category Overview) ===== */
var pieChart;
function renderPie(){
  if(!pieChart) pieChart=echarts.init(document.getElementById('pieC'));
  var cats=['弹窗','Feed 挂卡','异形卡'];
  var clsMap={'弹窗':'popup','Feed 挂卡':'feed','异形卡':'special'};
  var catData=cats.map(function(cat){
    var items=D.filter(function(r){return r.cat===cat;});
    var totalPV=items.reduce(function(s,r){return s+r.d[P].pv;},0);
    return {name:cat,value:totalPV,items:items,cls:clsMap[cat]};
  });
  var totalAll=catData.reduce(function(s,c){return s+c.value;},0);
  pieChart.setOption({
    tooltip:{
      trigger:'item',
      backgroundColor:'#fff',borderColor:'#e5e5e5',
      textStyle:{color:'#111',fontSize:12},
      confine:false,
      appendToBody:true,
      position:function(point,params,dom,rect,size){
        /* appendToBody: point is already page-absolute */
        var tW=size.contentSize[0], tH=size.contentSize[1];
        var vW=document.documentElement.clientWidth, vH=document.documentElement.clientHeight;
        var x=point[0]+12, y=point[1]+12;
        if(x+tW>vW-8) x=point[0]-tW-12;
        if(y+tH>vH+window.scrollY-8) y=point[1]-tH-12;
        if(x<8) x=8;
        if(y<window.scrollY+8) y=window.scrollY+8;
        return [x,y];
      },
      extraCssText:'box-shadow:0 8px 28px rgba(0,0,0,.12);border-radius:12px;padding:20px 22px;max-width:320px;pointer-events:none',
      formatter:function(p){
        var d=catData[p.dataIndex];
        var pct=totalAll>0?(d.value/totalAll*100).toFixed(1):'0';
        /* header */
        var h='<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid #f0f0f0">';
        h+='<div style="display:flex;align-items:center;gap:8px"><div style="width:10px;height:10px;border-radius:3px;background:'+CC[d.cls]+'"></div><span style="font-size:14px;font-weight:700">'+d.name+'</span></div>';
        h+='<div style="text-align:right"><div style="font-size:15px;font-weight:700;color:'+CC[d.cls]+'">'+fmt(d.value)+'</div><div style="font-size:10px;color:#999;margin-top:1px">占比 '+pct+'%</div></div>';
        h+='</div>';
        /* column labels */
        h+='<div style="display:flex;justify-content:space-between;padding:0 0 6px;font-size:10px;color:#bbb;letter-spacing:.02em"><span>资源位</span><div style="display:flex;gap:16px"><span>曝光PV</span><span>UV点击率</span><span>CVR</span></div></div>';
        /* items */
        d.items.sort(function(a,b){return b.d[P].pv-a.d[P].pv;}).forEach(function(r,i){
          var rd=r.d[P];
          var bg=i%2===0?'transparent':'#fafafa';
          h+='<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;font-size:12px;background:'+bg+';border-radius:4px">';
          h+='<span style="display:flex;align-items:center;gap:6px;min-width:0"><span style="font-size:13px">'+r.icon+'</span><span style="font-weight:500;white-space:nowrap">'+r.name+'</span></span>';
          h+='<span style="display:flex;gap:16px;flex-shrink:0;font-variant-numeric:tabular-nums">';
          h+='<span style="color:#0f0f0f;font-weight:600;min-width:48px;text-align:right">'+fmt(rd.pv)+'</span>';
          h+='<span style="color:'+MC.uv+';min-width:40px;text-align:right">'+rd.uv+'%</span>';
          h+='<span style="color:'+MC.cv+';min-width:36px;text-align:right">'+rd.cv+'%</span>';
          h+='</span></div>';
        });
        return h;
      }
    },
    series:[{
      type:'pie',
      radius:['42%','72%'],
      center:['50%','55%'],
      avoidLabelOverlap:true,
      itemStyle:{borderRadius:6,borderColor:'#fff',borderWidth:3},
      label:{show:true,formatter:function(p){return p.name+'\n'+p.percent.toFixed(1)+'%';},fontSize:10,color:'#666',lineHeight:14,overflow:'truncate',width:60},
      labelLine:{length:8,length2:6,lineStyle:{color:'#ddd'}},
      emphasis:{
        itemStyle:{shadowBlur:12,shadowColor:'rgba(0,0,0,.1)'},
        label:{fontSize:12,fontWeight:600,color:'#111'}
      },
      animationType:'scale',animationEasing:'cubicOut',animationDuration:600,
      data:catData.map(function(c){return {value:c.value,name:c.name,itemStyle:{color:CC[c.cls]}};})
    }]
  },true);

  /* linkage: pie hover → highlight other charts + table */
  pieChart.off('mouseover');pieChart.off('mouseout');
  pieChart.on('mouseover',function(p){ highlightCategory(catData[p.dataIndex].name); });
  pieChart.on('mouseout',function(){ clearHighlight(); });
}

/* ===== Bar Chart ===== */
var barChart,bubChart;
function renderBar(){
  if(!barChart) barChart=echarts.init(document.getElementById('barC'));
  var sd=sorted('pv',false);
  barChart.setOption({
    tooltip:{trigger:'axis',backgroundColor:'#fff',borderColor:'#e5e5e5',textStyle:{color:'#111',fontSize:12},extraCssText:'box-shadow:0 4px 12px rgba(0,0,0,.08);border-radius:8px;padding:12px 14px',axisPointer:{type:'shadow',shadowStyle:{color:'rgba(0,0,0,.02)'}},
      formatter:function(p){var i=sd[p[0].dataIndex],d=i.d[P];return '<b>'+i.name+'</b><br/>曝光 '+fmt(d.pv)+' PV<br/><span style="color:'+MC.uv+'">UV点击率 '+d.uv+'%</span><br/><span style="color:'+MC.cv+'">CVR '+d.cv+'%</span>';}},
    grid:{left:8,right:12,top:8,bottom:32,containLabel:true},
    xAxis:{type:'category',data:sd.map(function(r){return r.name;}),axisLabel:{color:'#999',fontSize:10,interval:0,formatter:function(v){return v.length>5?v.slice(0,4)+'…':v;}},axisLine:{lineStyle:{color:'#e5e5e5'}},axisTick:{show:false}},
    yAxis:{type:'value',axisLabel:{color:'#999',fontSize:10,formatter:function(v){return fmt(v);}},splitLine:{lineStyle:{color:'#f0f0f0',type:'dashed'}},axisLine:{show:false},axisTick:{show:false}},
    series:[{type:'bar',barWidth:'56%',animationDuration:600,animationEasing:'cubicOut',data:sd.map(function(r){return {value:r.d[P].pv,itemStyle:{color:CC[r.cls],borderRadius:[4,4,0,0],opacity:0.85}};}),emphasis:{itemStyle:{opacity:1}}}]
  },true);

  /* linkage: bar hover → highlight single item */
  barChart.off('mouseover');barChart.off('mouseout');
  barChart.on('mouseover',function(p){ if(p.dataIndex!=null) highlightItem(sd[p.dataIndex].name); });
  barChart.on('mouseout',function(){ clearHighlight(); });
}

/* ===== Bubble Chart ===== */
function renderBub(){
  if(!bubChart) bubChart=echarts.init(document.getElementById('bubC'));
  var maxPV=Math.max.apply(null,D.map(function(r){return r.d[P].pv;}));
  var avgUV=D.reduce(function(s,r){return s+r.d[P].uv;},0)/D.length;
  var avgCV=D.reduce(function(s,r){return s+r.d[P].cv;},0)/D.length;
  bubChart.setOption({
    tooltip:{backgroundColor:'#fff',borderColor:'#e5e5e5',textStyle:{color:'#111',fontSize:12},extraCssText:'box-shadow:0 4px 12px rgba(0,0,0,.08);border-radius:8px;padding:12px 14px',
      formatter:function(p){var r=D[p.dataIndex];if(!r)return'';var d=r.d[P];return '<b>'+r.name+'</b><br/><span style="color:'+MC.uv+'">UV点击率 '+d.uv+'%</span><br/><span style="color:'+MC.cv+'">CVR '+d.cv+'%</span><br/>曝光 '+fmt(d.pv)+' PV';}},
    grid:{left:44,right:24,top:16,bottom:44},
    xAxis:{name:'UV 点击率',nameLocation:'center',nameGap:28,nameTextStyle:{color:'#999',fontSize:11},axisLabel:{color:'#999',fontSize:10,formatter:'{value}%'},splitLine:{lineStyle:{color:'#f0f0f0',type:'dashed'}},axisLine:{lineStyle:{color:'#e5e5e5'}}},
    yAxis:{name:'CVR',nameLocation:'center',nameGap:30,nameTextStyle:{color:'#999',fontSize:11},axisLabel:{color:'#999',fontSize:10,formatter:'{value}%'},splitLine:{lineStyle:{color:'#f0f0f0',type:'dashed'}},axisLine:{lineStyle:{color:'#e5e5e5'}}},
    series:[
      {type:'line',markLine:{silent:true,symbol:'none',lineStyle:{color:'#e5e5e5',type:'dashed',width:1},data:[{xAxis:avgUV}],label:{show:true,position:'start',formatter:'avg',color:'#bbb',fontSize:9}}},
      {type:'line',markLine:{silent:true,symbol:'none',lineStyle:{color:'#e5e5e5',type:'dashed',width:1},data:[{yAxis:avgCV}],label:{show:true,position:'start',formatter:'avg',color:'#bbb',fontSize:9}}},
      {type:'scatter',symbolSize:function(d){return 18+(d[2]/maxPV)*40;},
        data:D.map(function(r){var d=r.d[P];return {value:[d.uv,d.cv,d.pv],name:r.name};}),
        itemStyle:{opacity:0.8,borderColor:'#fff',borderWidth:1.5},color:D.map(function(r){return CC[r.cls];}),
        label:{show:true,formatter:function(p){var n=p.name;return n.length>4?n.slice(0,3)+'…':n;},position:'right',color:'#999',fontSize:10,distance:4},
        emphasis:{itemStyle:{opacity:1,shadowBlur:8,shadowColor:'rgba(0,0,0,.12)'},label:{color:'#111',fontWeight:600,formatter:function(p){return p.name;}}},animationDuration:600}
    ]
  },true);

  /* linkage: bubble hover → highlight single item */
  bubChart.off('mouseover');bubChart.off('mouseout');
  bubChart.on('mouseover',function(p){ if(p.seriesIndex===2&&p.dataIndex!=null) highlightItem(D[p.dataIndex].name); });
  bubChart.on('mouseout',function(){ clearHighlight(); });
}

/* ===== Chart Area ===== */
function renderChartArea(){
  var wrap=document.getElementById('chartArea');
  wrap.innerHTML=
    '<div class="ch-sec-3">'+
      '<div class="ch-pan"><div class="ch-hd"><div class="ch-tt">分类曝光占比</div></div><div class="ch-box" id="pieC"></div></div>'+
      '<div class="ch-pan"><div class="ch-hd"><div class="ch-tt">各资源位曝光量对比</div><div class="ch-legend"><div class="ch-legend-item"><div class="ch-legend-dot" style="background:var(--orange)"></div>弹窗</div><div class="ch-legend-item"><div class="ch-legend-dot" style="background:var(--blue)"></div>Feed 挂卡</div><div class="ch-legend-item"><div class="ch-legend-dot" style="background:var(--purple)"></div>异形卡</div></div></div><div class="ch-box" id="barC"></div></div>'+
      '<div class="ch-pan"><div class="ch-hd"><div class="ch-tt">点击率 x 转化率</div><div class="ch-legend"><div class="ch-legend-item" style="font-size:10px;color:var(--text3)">气泡 = 曝光量</div></div></div><div class="ch-box" id="bubC"></div></div>'+
    '</div>';
  pieChart=null;barChart=null;bubChart=null;
  renderPie();renderBar();renderBub();
}

/* ===== Table with Sort & Filter ===== */
function renderTblFilters(){
  var cats=['all','弹窗','Feed 挂卡','异形卡'];
  var h='';
  cats.forEach(function(c){
    h+='<button class="sec-fbtn'+(tblFilter===c?' on':'')+'" onclick="setTblFilter(\''+c+'\')">'+( c==='all'?'全部':c)+'</button>';
  });
  document.getElementById('tblFilters').innerHTML=h;
}

function renderTable(){
  renderTblFilters();
  var sd=sorted(tblSort.key,tblSort.asc);
  var filtered=tblFilter==='all'?sd:sd.filter(function(r){return r.cat===tblFilter;});
  document.getElementById('secCount').textContent='按'+getSortLabel()+' · '+PL[P]+'数据 · '+filtered.length+' 个资源位';

  /* averages for trend tags */
  var avgM={
    pv:D.reduce(function(s,r){return s+r.d[P].pv;},0)/D.length,
    uv:D.reduce(function(s,r){return s+r.d[P].uv;},0)/D.length,
    pc:D.reduce(function(s,r){return s+r.d[P].pc;},0)/D.length,
    cv:D.reduce(function(s,r){return s+r.d[P].cv;},0)/D.length
  };
  function trendT(val,avg){
    var diff=val-avg;var pct=avg>0?((diff/avg)*100).toFixed(0):0;
    if(Math.abs(pct)<5) return '<span class="pp-trend neutral">均值</span>';
    if(diff>0) return '<span class="pp-trend up">↑'+Math.abs(pct)+'%</span>';
    return '<span class="pp-trend dn">↓'+Math.abs(pct)+'%</span>';
  }

  function sortIcon(key){
    var active=tblSort.key===key;
    var cls=active?'sort-icon active':'sort-icon';
    var arrow=active?(tblSort.asc?'↑':'↓'):'↕';
    return '<span class="'+cls+'" onclick="toggleSort(\''+key+'\')" title="点击排序">'+arrow+'</span>';
  }

  var infoSvg='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

  /* compute efficiency scores: weighted composite of uv/pc/cv normalised to max in dataset */
  var maxUV=0,maxPC=0,maxCV2=0;
  filtered.forEach(function(r){var dd=r.d[P];if(dd.uv>maxUV)maxUV=dd.uv;if(dd.pc>maxPC)maxPC=dd.pc;if(dd.cv>maxCV2)maxCV2=dd.cv;});
  function effScore(dd){
    var nUV=maxUV?dd.uv/maxUV:0, nPC=maxPC?dd.pc/maxPC:0, nCV=maxCV2?dd.cv/maxCV2:0;
    return Math.round((nUV*0.3+nPC*0.3+nCV*0.4)*100);
  }
  function effColor(s){return s>=70?'#15803d':s>=40?'#d97706':'#dc2626';}
  function effLabel(s){return s>=70?'优秀':s>=40?'良好':'待优化';}

  var h='<div class="tbl-hd"><div>#</div><div>资源位</div><div>类型</div><div>曝光 PV '+sortIcon('pv')+'</div><div style="color:'+MC.uv+'">UV 点击率 '+sortIcon('uv')+'</div><div style="color:'+MC.pc+'">PV 点击率 '+sortIcon('pc')+'</div><div style="color:'+MC.cv+'">CVR '+sortIcon('cv')+'</div><div>综合效率</div><div></div></div>';
  filtered.forEach(function(r,i){
    var d=r.d[P],rank=i+1;
    var firstImg=(r.imgs&&r.imgs.length)?r.imgs[0]:null;
    var imgH=firstImg?'<img src="'+firstImg+'">':'<div class="tbl-thumb-ph">'+r.icon+'</div>';
    var score=effScore(d);
    var sColor=effColor(score);
    var sLabel=effLabel(score);
    /* SVG ring: r=14.5, C=2*PI*14.5≈91.1 */
    var C=91.1, dashOff=(C*(1-score/100)).toFixed(1);

    /* popover card content */
    var imgs=r.imgs||[];
    var imgsH='';
    if(imgs.length>0){
      imgs.forEach(function(src){
        imgsH+='<div class="pp-thumb"><img src="'+src+'" loading="lazy"></div>';
      });
    } else {
      imgsH='<div class="pp-thumb-ph">'+r.icon+'</div>';
    }

    var copySvg='<svg class="pp-copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
    var pp='<div class="pp-card" onmouseenter="ppEnterCard(this)" onmouseleave="ppLeaveCard(this)">';
    pp+='<div class="pp-header"><div class="pp-info"><span class="pp-name">'+r.name+'</span><span class="pp-badge '+r.cls+'">'+r.cat+'</span></div></div>';
    pp+='<div class="pp-desc">'+r.desc+'</div>';
    /* enter/exit scene */
    if(r.enter||r.exit){
      pp+='<div class="pp-scene">';
      if(r.enter) pp+='<div class="pp-scene-row"><span class="pp-scene-label">进场</span><span class="pp-scene-text">'+r.enter+'</span></div>';
      if(r.exit) pp+='<div class="pp-scene-row"><span class="pp-scene-label">出场</span><span class="pp-scene-text">'+r.exit+'</span></div>';
      pp+='</div>';
    }
    /* contacts */
    if(r.owner||r.dev){
      pp+='<div class="pp-contacts">';
      if(r.owner) pp+='<div class="pp-contact"><div class="pp-contact-info"><span class="pp-contact-name">'+r.owner.name+'<span class="pp-copy-btn" onclick="event.stopPropagation();copyName(this,\''+r.owner.name+'\')">' +copySvg+'</span></span><span class="pp-contact-role">'+r.owner.role+' · '+r.owner.team+'</span></div></div>';
      if(r.dev) pp+='<div class="pp-contact"><div class="pp-contact-info"><span class="pp-contact-name">'+r.dev.name+'<span class="pp-copy-btn" onclick="event.stopPropagation();copyName(this,\''+r.dev.name+'\')">' +copySvg+'</span></span><span class="pp-contact-role">'+r.dev.role+' · '+r.dev.team+'</span></div></div>';
      pp+='</div>';
    }
    /* metrics row removed — data already shown in table row */
    pp+='<div class="pp-imgs-label">案例截图 <span class="pp-imgs-count">'+imgs.length+' 张</span></div>';
    pp+='<div class="pp-imgs">'+imgsH+'</div>';
    pp+='</div>';

    h+='<div class="tbl-row ai" style="animation-delay:'+i*0.04+'s">';
    h+='<div class="tbl-rank'+(rank<=3?' top':'')+'">'+rank+'</div>';
    h+='<div class="tbl-name-cell"><div class="tbl-thumb">'+imgH+'</div><div><div class="tbl-name">'+r.name+'</div><div class="tbl-cat">'+r.cat+'</div></div></div>';
    h+='<div><span class="tbl-tag '+r.cls+'">'+r.cat+'</span></div>';
    h+='<div><div class="tbl-val">'+fmt(d.pv)+'</div></div>';
    h+='<div><div class="tbl-pct c-uv">'+d.uv+'%</div></div>';
    h+='<div><div class="tbl-pct c-pc">'+d.pc+'%</div></div>';
    h+='<div><div class="tbl-pct c-cv">'+d.cv+'%</div></div>';
    h+='<div class="tbl-eff"><div class="tbl-eff-ring"><svg width="36" height="36" viewBox="0 0 36 36"><circle class="ring-bg" cx="18" cy="18" r="14.5"/><circle class="ring-fg" cx="18" cy="18" r="14.5" stroke="'+sColor+'" stroke-dasharray="'+C+'" stroke-dashoffset="'+dashOff+'"/></svg><div class="tbl-eff-score" style="color:'+sColor+'">'+score+'</div></div><div class="tbl-eff-label"><b style="color:'+sColor+'">'+sLabel+'</b></div></div>';
    h+='<div class="tbl-detail-cell"><div class="tbl-detail-trigger" onmouseenter="ppEnterTrigger(this)" onmouseleave="ppLeaveTrigger(this)">'+infoSvg+pp+'</div></div>';
    h+='</div>';
  });
  document.getElementById('tbl').innerHTML=h;
}

function getSortLabel(){
  var labels={pv:'曝光量',uv:'UV点击率',pc:'PV点击率',cv:'CVR'};
  return labels[tblSort.key]+(tblSort.asc?'升序':'降序');
}

function toggleSort(key){
  if(tblSort.key===key){
    tblSort.asc=!tblSort.asc;
  } else {
    tblSort.key=key;
    tblSort.asc=false;
  }
  renderTable();
}

function setTblFilter(f){tblFilter=f;renderTable();}

/* ===== Detail Tab ===== */
function renderDetail(){
  var cats=['all','弹窗','Feed 挂卡','异形卡'];
  var fh='';
  cats.forEach(function(c){
    fh+='<button class="filter-btn'+(detailFilter===c?' on':'')+'" onclick="setDetailFilter(\''+c+'\')">'+( c==='all'?'全部 ('+D.length+')':c)+'</button>';
  });
  document.getElementById('detailFilter').innerHTML=fh;

  var sd=sorted(tblSort.key,tblSort.asc);
  var h='';
  var animIdx=0;

  /* compute averages for baseline comparison */
  var avgMetrics={
    pv:D.reduce(function(s,r){return s+r.d[P].pv;},0)/D.length,
    uv:D.reduce(function(s,r){return s+r.d[P].uv;},0)/D.length,
    pc:D.reduce(function(s,r){return s+r.d[P].pc;},0)/D.length,
    cv:D.reduce(function(s,r){return s+r.d[P].cv;},0)/D.length
  };

  function trendTag(val,avg){
    var diff=val-avg;
    var pct=avg>0?((diff/avg)*100).toFixed(0):0;
    if(Math.abs(pct)<5) return '<span class="d-trend neutral">均值</span>';
    if(diff>0) return '<span class="d-trend up">↑'+Math.abs(pct)+'%</span>';
    return '<span class="d-trend dn">↓'+Math.abs(pct)+'%</span>';
  }

  /* efficiency helpers (reuse from table) */
  var maxUV2=0,maxPC2=0,maxCV3=0;
  sd.forEach(function(r){var dd=r.d[P];if(dd.uv>maxUV2)maxUV2=dd.uv;if(dd.pc>maxPC2)maxPC2=dd.pc;if(dd.cv>maxCV3)maxCV3=dd.cv;});
  function dEffScore(dd){
    var nUV=maxUV2?dd.uv/maxUV2:0, nPC=maxPC2?dd.pc/maxPC2:0, nCV=maxCV3?dd.cv/maxCV3:0;
    return Math.round((nUV*0.3+nPC*0.3+nCV*0.4)*100);
  }
  function dEffColor(s){return s>=70?'#15803d':s>=40?'#d97706':'#dc2626';}
  function dEffLabel(s){return s>=70?'优秀':s>=40?'良好':'待优化';}

  var copySvgD='<svg class="pp-copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';

  function buildCard(r){
    var d=r.d[P];
    var globalRank=sorted('pv',false).indexOf(r)+1;
    var dScore=dEffScore(d), dColor=dEffColor(dScore), dLabel=dEffLabel(dScore);
    var dC=91.1, dDashOff=(dC*(1-dScore/100)).toFixed(1);

    /* thumbnails */
    var imgs=r.imgs||[];
    var imgsH='';
    if(imgs.length>0){
      var imgsAttr=JSON.stringify(imgs).replace(/&/g,'&amp;').replace(/"/g,'&quot;');
      imgs.forEach(function(src,idx){
        imgsH+='<div class="d-thumb" data-imgs="'+imgsAttr+'" data-idx="'+idx+'" onclick="openLightbox(JSON.parse(this.dataset.imgs),+this.dataset.idx)">'+
          '<img src="'+src+'" loading="lazy">'+
          (imgs.length>1?'<div class="d-thumb-label">'+(idx+1)+'</div>':'')+
        '</div>';
      });
    } else {
      imgsH='<div class="d-thumb-ph"><div class="d-thumb-ph-icon">'+r.icon+'</div><div class="d-thumb-ph-text">暂无截图</div></div>';
    }

    var screenshotSection=
      '<div class="d-row-screenshots">'+
        '<div class="d-row-imgs-label">案例截图 <span class="d-imgs-count">'+imgs.length+' 张</span></div>'+
        '<div class="d-row-imgs">'+imgsH+'</div>'+
      '</div>';

    /* enter/exit + contacts section */
    var sceneH='';
    if(r.enter||r.exit){
      sceneH='<div class="d-row-scene">';
      if(r.enter) sceneH+='<div class="d-row-scene-item"><span class="d-row-scene-label">进场</span><span class="d-row-scene-text">'+r.enter+'</span></div>';
      if(r.exit) sceneH+='<div class="d-row-scene-item"><span class="d-row-scene-label">出场</span><span class="d-row-scene-text">'+r.exit+'</span></div>';
      sceneH+='</div>';
    }
    var contactH='';
    if(r.owner||r.dev){
      contactH='<div class="d-row-contacts">';
      if(r.owner) contactH+='<div class="d-row-contact"><div class="d-row-contact-info"><span class="d-row-contact-name">'+r.owner.name+'<span class="pp-copy-btn" onclick="event.stopPropagation();copyName(this,\''+r.owner.name+'\')">' +copySvgD+'</span></span><span class="d-row-contact-role">'+r.owner.role+' · '+r.owner.team+'</span></div></div>';
      if(r.dev) contactH+='<div class="d-row-contact"><div class="d-row-contact-info"><span class="d-row-contact-name">'+r.dev.name+'<span class="pp-copy-btn" onclick="event.stopPropagation();copyName(this,\''+r.dev.name+'\')">' +copySvgD+'</span></span><span class="d-row-contact-role">'+r.dev.role+' · '+r.dev.team+'</span></div></div>';
      contactH+='</div>';
    }

    var card='<div class="d-row ai" style="animation-delay:'+animIdx*0.04+'s">'+
      '<div class="d-row-content">'+
        '<div class="d-row-top">'+
          '<div class="d-row-info">'+
            '<div class="d-row-title-line">'+
              '<span class="d-row-name">'+r.name+'</span>'+
              '<span class="d-row-badge '+r.cls+'">'+r.cat+'</span>'+
            '</div>'+
          '</div>'+
          '<div class="d-row-desc">'+r.desc+'</div>'+
        '</div>'+
        sceneH+
        contactH+
        '<div class="d-row-data">'+
          '<div class="d-row-metrics">'+
            '<div class="d-row-metric"><div class="d-row-metric-val" style="color:'+MC.pv+'">'+fmt(d.pv)+'</div><div class="d-row-metric-label">曝光 PV '+trendTag(d.pv,avgMetrics.pv)+'</div></div>'+
            '<div class="d-row-metric"><div class="d-row-metric-val" style="color:'+MC.uv+'">'+d.uv+'%</div><div class="d-row-metric-label">UV 点击率 '+trendTag(d.uv,avgMetrics.uv)+'</div></div>'+
            '<div class="d-row-metric"><div class="d-row-metric-val" style="color:'+MC.pc+'">'+d.pc+'%</div><div class="d-row-metric-label">PV 点击率 '+trendTag(d.pc,avgMetrics.pc)+'</div></div>'+
            '<div class="d-row-metric"><div class="d-row-metric-val" style="color:'+MC.cv+'">'+d.cv+'%</div><div class="d-row-metric-label">CVR '+trendTag(d.cv,avgMetrics.cv)+'</div></div>'+
          '</div>'+
          '<div class="d-row-eff"><div class="d-row-eff-ring"><svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="var(--surface)" stroke-width="4"/><circle cx="22" cy="22" r="18" fill="none" stroke="'+dColor+'" stroke-width="4" stroke-linecap="round" stroke-dasharray="'+Math.round(2*Math.PI*18)+'" stroke-dashoffset="'+((2*Math.PI*18)*(1-dScore/100)).toFixed(1)+'"/></svg><div class="d-row-eff-score" style="color:'+dColor+'">'+dScore+'</div></div><div class="d-row-eff-label">综合效率<br><b style="color:'+dColor+'">'+dLabel+'</b></div></div>'+
        '</div>'+
        screenshotSection+
      '</div>'+
    '</div>';
    animIdx++;
    return card;
  }

  if(detailFilter==='all'){
    /* grouped by category with section headers */
    var groups=['弹窗','Feed 挂卡','异形卡'];
    groups.forEach(function(cat){
      var items=sd.filter(function(r){return r.cat===cat;});
      if(!items.length) return;
      h+='<div class="d-section-hd">'+
          '<span class="d-section-title">'+cat+'</span>'+
          '<span class="d-section-count">'+items.length+' 个资源位</span>'+
        '</div>';
      items.forEach(function(r){ h+=buildCard(r); });
    });
  } else {
    /* single category — flat list, no headers */
    var filtered=sd.filter(function(r){return r.cat===detailFilter;});
    filtered.forEach(function(r){ h+=buildCard(r); });
  }

  document.getElementById('detailList').innerHTML=h;
}

function setDetailFilter(f){detailFilter=f;renderDetail();}

/* ===== Popover Hover (instant show, delayed hide) ===== */
var _ppHideTimer=null;
var _ppCurrent=null;

function ppPositionCard(trigger,card){
  /* default CSS: bottom:0 (card bottom-aligned with trigger) */
  card.style.bottom='0';card.style.top='';
  var cr=card.getBoundingClientRect();
  /* if card overflows above viewport, flip to top-aligned */
  if(cr.top<8){
    card.style.bottom='auto';
    card.style.top='0';
  }
}

function _ppGetRow(el){
  while(el&&!el.classList.contains('tbl-row')) el=el.parentElement;
  return el;
}
function _ppDismiss(card){
  card.classList.remove('pp-visible');
  var row=_ppGetRow(card);
  if(row) row.style.zIndex='';
  _ppCurrent=null;
}

function ppEnterTrigger(trigger){
  var card=trigger.querySelector('.pp-card');
  if(!card) return;
  clearTimeout(_ppHideTimer);
  if(_ppCurrent&&_ppCurrent!==card) _ppDismiss(_ppCurrent);
  var row=_ppGetRow(trigger);
  if(row) row.style.zIndex='100';
  card.classList.add('pp-visible');
  ppPositionCard(trigger,card);
  _ppCurrent=card;
}

function ppLeaveTrigger(trigger){
  _ppHideTimer=setTimeout(function(){
    var card=trigger.querySelector('.pp-card');
    if(card) _ppDismiss(card);
  },800);
}

function ppEnterCard(card){
  clearTimeout(_ppHideTimer);
}

function ppLeaveCard(card){
  _ppHideTimer=setTimeout(function(){
    _ppDismiss(card);
  },300);
}

/* ===== Copy Name + Toast ===== */
function copyName(el,name){
  navigator.clipboard.writeText(name).then(function(){
    showToast('已复制「'+name+'」');
  }).catch(function(){
    /* fallback */
    var ta=document.createElement('textarea');
    ta.value=name;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('已复制「'+name+'」');
  });
}
var _toastTimer=null;
function showToast(msg){
  var t=document.getElementById('ppToast');
  t.textContent=msg;
  t.classList.add('show');
  if(_toastTimer) clearTimeout(_toastTimer);
  _toastTimer=setTimeout(function(){t.classList.remove('show');},1800);
}

/* ===== Lightbox Gallery ===== */
var _lbImgs=[],_lbIdx=0;
function openLightbox(imgs,idx){
  _lbImgs=imgs;_lbIdx=idx||0;
  document.getElementById('lightbox').classList.add('show');
  document.body.style.overflow='hidden';
  _lbShow();
}
function _lbShow(){
  document.getElementById('lbImg').src=_lbImgs[_lbIdx];
  var counter=document.getElementById('lbCounter');
  if(counter) counter.textContent=(_lbIdx+1)+' / '+_lbImgs.length;
  var prev=document.getElementById('lbPrev');
  var next=document.getElementById('lbNext');
  if(prev) prev.style.display=_lbImgs.length>1?'flex':'none';
  if(next) next.style.display=_lbImgs.length>1?'flex':'none';
  if(counter) counter.style.display=_lbImgs.length>1?'block':'none';
}
function lbGo(dir){
  _lbIdx=(_lbIdx+dir+_lbImgs.length)%_lbImgs.length;
  _lbShow();
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('show');
  document.body.style.overflow='';
}
function lbClickBg(e){
  if(e.target===e.currentTarget) closeLightbox();
}

/* ===== Time Switch ===== */
function sw(p){
  P=p;
  /* update capsule buttons */
  document.querySelectorAll('.tc-btn').forEach(function(b){
    b.classList.remove('on','custom-active');
    if(b.dataset.p===p) b.classList.add('on');
  });
  /* clear custom date display when switching to preset */
  if(p!=='custom'){
    document.getElementById('tcDateDisplay').textContent='';
    closeCustomPanel();
  }
  refreshAll();
}

function refreshAll(){
  renderOV();renderChartArea();renderTable();
  if(document.getElementById('tab-detail').classList.contains('active')) renderDetail();
}

/* ===== Keyboard Shortcuts ===== */
document.addEventListener('keydown',function(e){
  if(e.target.tagName==='INPUT') return;
  /* lightbox navigation */
  var lb=document.getElementById('lightbox');
  if(lb&&lb.classList.contains('show')){
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowLeft') lbGo(-1);
    if(e.key==='ArrowRight') lbGo(1);
    return;
  }
  if(e.key==='1') switchTab('overview');
  if(e.key==='2') switchTab('detail');
  if(e.key==='e'&&(e.metaKey||e.ctrlKey)){e.preventDefault();exportCSV();}
});

/* ===== Init ===== */
renderOV();renderChartArea();renderTable();
window.addEventListener('resize',function(){resizeAllCharts();});
