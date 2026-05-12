var D=[
{id:'incentive_popup',name:'激励弹窗',cat:'弹窗',cls:'popup',
  imgs:['images/incentive_popup/1.png','images/incentive_popup/2.png','images/incentive_popup/3.png','images/incentive_popup/4.png','images/incentive_popup/5.png'],
  icon:'🎁',desc:'用户完成任务后弹出激励奖励弹窗，引导领取现金红包',
  enter:'用户完成指定任务（如浏览视频≥3条）后自动弹出，从屏幕底部上滑进场，带弹性动画',
  exit:'用户点击关闭按钮或领取奖励后，向下滑出消失；超时15秒自动收起',
  owner:{name:'张明远',role:'产品经理',team:'激励增长组'},
  dev:{name:'李思涵',role:'前端开发',team:'短视频前端组'},
  d:{week:{pv:320,uv:5.2,pc:4.8,cv:2.8},month:{pv:2800,uv:5.0,pc:4.5,cv:2.6},year:{pv:34000,uv:4.8,pc:4.3,cv:2.4},custom:{pv:2800,uv:5.0,pc:4.5,cv:2.6}}},
{id:'checkin_popup',name:'签到弹窗',cat:'弹窗',cls:'popup',
  imgs:['images/checkin_popup/1.jpg','images/checkin_popup/2.jpg','images/checkin_popup/3.jpg','images/checkin_popup/4.jpg','images/checkin_popup/5.jpg','images/checkin_popup/6.jpg'],
  icon:'📅',desc:'每日签到弹窗，连续签到可获得递增奖励',
  enter:'用户每日首次进入视频 Tab 时自动弹出，从中心缩放进场，带毛玻璃背景',
  exit:'用户完成签到或点击关闭后，缩放+淡出消失；已签到用户当日不再展示',
  owner:{name:'王晓琳',role:'产品经理',team:'用户运营组'},
  dev:{name:'赵宇航',role:'前端开发',team:'短视频前端组'},
  d:{week:{pv:280,uv:6.1,pc:5.5,cv:3.2},month:{pv:2400,uv:5.8,pc:5.2,cv:3.0},year:{pv:29000,uv:5.5,pc:5.0,cv:2.8},custom:{pv:2400,uv:5.8,pc:5.2,cv:3.0}}},
{id:'novel_popup',name:'小说导流弹窗',cat:'弹窗',cls:'popup',
  imgs:['images/novel_popup/1.png','images/novel_popup/2.png','images/novel_popup/3.png','images/novel_popup/4.png'],
  icon:'📖',desc:'小说业务导流弹窗，引导用户进入小说频道阅读',
  enter:'用户浏览视频≥5条后触发，从底部抽屉式上滑进场，展示小说封面和前3行内容',
  exit:'用户点击"去阅读"跳转小说频道，或点击关闭后下滑消失；每用户每天最多展示2次',
  owner:{name:'陈思远',role:'产品经理',team:'小说业务组'},
  dev:{name:'孙浩然',role:'前端开发',team:'内容前端组'},
  d:{week:{pv:150,uv:3.8,pc:3.2,cv:1.5},month:{pv:1300,uv:3.5,pc:3.0,cv:1.4},year:{pv:15600,uv:3.3,pc:2.8,cv:1.3},custom:{pv:1300,uv:3.5,pc:3.0,cv:1.4}}},
{id:'ad_comp',name:'广告组件',cat:'Feed 挂卡',cls:'feed',
  imgs:['images/ad_comp/1.png','images/ad_comp/2.png','images/ad_comp/3.png'],
  icon:'📢',desc:'Feed 流中的广告挂卡组件，展示商业化广告内容',
  enter:'Feed 流滑动至第4位时自动加载，随 Feed 卡片统一从底部渐入，带"广告"标识角标',
  exit:'用户上滑离开可视区域后回收；支持用户长按选择"不感兴趣"永久隐藏',
  owner:{name:'刘佳怡',role:'产品经理',team:'商业化产品组'},
  dev:{name:'周子轩',role:'前端开发',team:'商业化前端组'},
  d:{week:{pv:580,uv:2.1,pc:1.8,cv:0.9},month:{pv:5200,uv:2.0,pc:1.7,cv:0.8},year:{pv:62000,uv:1.9,pc:1.6,cv:0.8},custom:{pv:5200,uv:2.0,pc:1.7,cv:0.8}}},
{id:'mkt_comp',name:'营销活动组件',cat:'Feed 挂卡',cls:'feed',
  imgs:['images/mkt_comp/1.png','images/mkt_comp/2.png'],
  icon:'🎯',desc:'Feed 流中的营销活动挂卡，推广平台营销活动',
  enter:'Feed 流第6-8位随机插入，卡片从右侧滑入并带微弹动画，展示活动倒计时',
  exit:'活动结束后自动下线；用户点击进入活动页后该位置替换为下一个活动',
  owner:{name:'黄雨萱',role:'产品经理',team:'平台营销组'},
  dev:{name:'吴昊天',role:'前端开发',team:'营销前端组'},
  d:{week:{pv:420,uv:3.5,pc:3.0,cv:1.8},month:{pv:3800,uv:3.3,pc:2.8,cv:1.7},year:{pv:45600,uv:3.1,pc:2.6,cv:1.6},custom:{pv:3800,uv:3.3,pc:2.8,cv:1.7}}},
{id:'poi_deal',name:'POI/Deal 组件',cat:'Feed 挂卡',cls:'feed',
  imgs:['images/poi_deal/1.png','images/poi_deal/2.png','images/poi_deal/3.png','images/poi_deal/4.png'],
  icon:'📍',desc:'Feed 流中的 POI/Deal 挂卡，展示附近商家优惠',
  enter:'基于用户 LBS 定位，在 Feed 第3位插入，卡片带地图缩略图和距离标签，渐入进场',
  exit:'用户滑过后正常回收；商家优惠过期后自动替换为下一个附近商家',
  owner:{name:'林子墨',role:'产品经理',team:'到店业务组'},
  dev:{name:'杨思琪',role:'前端开发',team:'到店前端组'},
  d:{week:{pv:350,uv:4.2,pc:3.8,cv:2.2},month:{pv:3100,uv:4.0,pc:3.5,cv:2.0},year:{pv:37200,uv:3.8,pc:3.3,cv:1.9},custom:{pv:3100,uv:4.0,pc:3.5,cv:2.0}}},
{id:'biz_card',name:'商业化大卡',cat:'异形卡',cls:'special',
  imgs:['images/biz_card/1.png','images/biz_card/2.png','images/biz_card/3.png'],
  icon:'💎',desc:'异形卡样式的商业化资源位，大面积展示品牌广告',
  enter:'Feed 流第2位固定展示，大面积卡片从底部推入，支持视频自动播放和品牌定制背景色',
  exit:'用户快速上滑跳过时缩小淡出；曝光满3秒后计为有效曝光，支持用户反馈关闭',
  owner:{name:'郑凯文',role:'产品经理',team:'品牌广告组'},
  dev:{name:'马晨曦',role:'前端开发',team:'商业化前端组'},
  d:{week:{pv:480,uv:2.8,pc:2.3,cv:1.2},month:{pv:4300,uv:2.6,pc:2.1,cv:1.1},year:{pv:51600,uv:2.5,pc:2.0,cv:1.0},custom:{pv:4300,uv:2.6,pc:2.1,cv:1.1}}},
{id:'game_card',name:'内容-游戏',cat:'异形卡',cls:'special',
  imgs:['images/game_card/1.jpg'],
  icon:'🎮',desc:'异形卡样式的游戏内容资源位，推广游戏相关内容',
  enter:'Feed 流第10位后随机插入，异形卡带游戏画面动态预览，从左侧滑入并旋转5°后归位',
  exit:'用户点击"立即试玩"跳转游戏页；滑过后正常回收，每用户每天最多展示3次',
  owner:{name:'徐嘉豪',role:'产品经理',team:'游戏业务组'},
  dev:{name:'何雨桐',role:'前端开发',team:'内容前端组'},
  d:{week:{pv:260,uv:4.5,pc:4.0,cv:2.5},month:{pv:2200,uv:4.3,pc:3.8,cv:2.3},year:{pv:26400,uv:4.1,pc:3.6,cv:2.2},custom:{pv:2200,uv:4.3,pc:3.8,cv:2.3}}},
{id:'inc_card',name:'内容-激励',cat:'异形卡',cls:'special',
  imgs:['images/inc_card/1.jpg'],
  icon:'🏆',desc:'异形卡样式的激励内容资源位，通过奖励引导用户互动',
  enter:'Feed 流第5位插入，异形卡带金币动画和奖励金额展示，从底部弹入并带粒子特效',
  exit:'用户领取奖励后卡片收起并显示"已领取"状态；未互动则随 Feed 正常滚动离开',
  owner:{name:'吴思颖',role:'产品经理',team:'激励增长组'},
  dev:{name:'陈浩宇',role:'前端开发',team:'短视频前端组'},
  d:{week:{pv:380,uv:5.8,pc:5.2,cv:3.5},month:{pv:3400,uv:5.5,pc:4.9,cv:3.3},year:{pv:40800,uv:5.3,pc:4.7,cv:3.1},custom:{pv:3400,uv:5.5,pc:4.9,cv:3.3}}}
];

var P='month',tblFilter='all',detailFilter='all';
var tblSort={key:'pv',asc:false};
var CC={popup:'#e8590c',feed:'#2563eb',special:'#7c3aed'};
var MC={pv:'#0f0f0f',uv:'#2563eb',pc:'#7c3aed',cv:'#16a34a'};
var PL={week:'周',month:'月',year:'年',custom:'自定义'};

/* Utility: compute period-over-period change */
function getChange(key){
  var periods=['week','month','year'];
  var idx=periods.indexOf(P);
  if(idx<=0) return null;
  var prev=periods[idx-1];
  var curArr=D.map(function(r){return r.d[P][key];});
  var prevArr=D.map(function(r){return r.d[prev][key];});
  if(key==='pv'){
    var curSum=curArr.reduce(function(a,b){return a+b;},0);
    var prevSum=prevArr.reduce(function(a,b){return a+b;},0);
    if(prevSum===0) return null;
    return ((curSum-prevSum)/prevSum*100).toFixed(1);
  } else {
    var curAvg=curArr.reduce(function(a,b){return a+b;},0)/curArr.length;
    var prevAvg=prevArr.reduce(function(a,b){return a+b;},0)/prevArr.length;
    return (curAvg-prevAvg).toFixed(1);
  }
}

function fmt(v){return v>=100000000?(v/100000000).toFixed(1)+'亿':v>=10000?(v/10000).toFixed(1)+'万':v.toLocaleString();}
function sorted(key,asc){
  key=key||'pv';
  var arr=D.slice();
  arr.sort(function(a,b){
    var va=a.d[P][key],vb=b.d[P][key];
    return asc?(va-vb):(vb-va);
  });
  return arr;
}

function switchTab(tab){
  document.querySelectorAll('.seg-btn').forEach(function(b){b.classList.toggle('on',b.dataset.tab===tab);});
  document.querySelectorAll('.tab-content').forEach(function(c){c.classList.remove('active');});
  document.getElementById('tab-'+tab).classList.add('active');
  if(tab==='overview') setTimeout(function(){resizeAllCharts();},50);
  if(tab==='detail') renderDetail();
}

function resizeAllCharts(){
  pieChart&&pieChart.resize();barChart&&barChart.resize();bubChart&&bubChart.resize();
}

/* ===== Custom Date Panel ===== */
function toggleCustomPanel(){
  var panel=document.getElementById('tcPanel');
  panel.classList.toggle('show');
}
function closeCustomPanel(){
  document.getElementById('tcPanel').classList.remove('show');
}
function applyCustomRange(){
  var s=document.getElementById('tcStart').value;
  var e=document.getElementById('tcEnd').value;
  if(!s||!e){return;}
  closeCustomPanel();
  P='custom';
  /* update capsule buttons */
  document.querySelectorAll('.tc-btn').forEach(function(b){
    b.classList.remove('on','custom-active');
  });
  document.getElementById('tcCustomBtn').classList.add('custom-active');
  /* show date range */
  document.getElementById('tcDateDisplay').textContent=s.slice(5)+' ~ '+e.slice(5);
  refreshAll();
}

/* click outside to close panel */
document.addEventListener('click',function(e){
  var panel=document.getElementById('tcPanel');
  var btn=document.getElementById('tcCustomBtn');
  if(panel && panel.classList.contains('show') && !panel.contains(e.target) && e.target!==btn){
    closeCustomPanel();
  }
});

/* ===== Export CSV ===== */
function exportCSV(){
  var sd=sorted(tblSort.key,tblSort.asc);
  var filtered=tblFilter==='all'?sd:sd.filter(function(r){return r.cat===tblFilter;});
  var rows=[['排名','资源位','分类','曝光PV','UV点击率(%)','PV点击率(%)','CVR(%)']];
  filtered.forEach(function(r,i){
    var d=r.d[P];
    rows.push([i+1,r.name,r.cat,d.pv,d.uv,d.pc,d.cv]);
  });
  var csv=rows.map(function(row){return row.join(',');}).join('\n');
  var BOM='\uFEFF';
  var blob=new Blob([BOM+csv],{type:'text/csv;charset=utf-8'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='资源位数据_'+P+'.csv';
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
