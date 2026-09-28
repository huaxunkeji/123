let panTools;

async function init() {
    panTools = await require("panTools");
}

async function home() {
    return [
        {type_id:"1", type_name:"🔥最新"},
        {type_id:"2", type_name:"🎬电影"},
        {type_id:"3", type_name:"📺剧集"},
        {type_id:"4", type_name:"🎞动漫"},
        {type_id:"5", type_name:"📖短剧"}
    ]
}

async function category(tid, pg) {
    let list = [];
    const base = "http://www.wogg.lol";
    let url;
    switch (tid) {
        case "1":
            url = `${base}/index.php/vod/show/by/time/page/${pg}.html`;
            break;
        case "2":
            url = `${base}/index.php/vod/show/by/cate/movie/page/${pg}.html`;
            break;
        case "3":
            url = `${base}/index.php/vod/show/by/cate/tv/page/${pg}.html`;
            break;
        case "4":
            url = `${base}/index.php/vod/show/by/cate/anime/page/${pg}.html`;
            break;
        case "5":
            url = `${base}/index.php/vod/show/by/cate/drama/page/${pg}.html`;
            break;
        default:
            url = `${base}/index.php/vod/show/page/${pg}.html`;
    }
    const resp = await fetch(url, {
        headers: {
            "User‑Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
            "Referer": base
        }
    });
    const html = await resp.text();

    //todo：解析网页，拿到详情页链接，进入详情提取阿里/夸克网盘分享链接vid
    /*
        1、列表页拿到vod详情地址
        2、fetch详情页，正则提取 pan.quark.cn 或者 aliyundrive.com 分享链接
        3、list.push({vid:"网盘链接", title:"名字", pic:"封面"})
    */
    return {
        list: list,
        page: pg,
        pagecount: 99
    }
}

async function detail(vid) {
    let res;
    if(vid.startsWith("https://pan.quark.cn")){
        res = await panTools.quark(vid);
    }else if(vid.startsWith("https://www.aliyundrive.com/s/")){
        res = await panTools.ali(vid);
    }else{
        throw new Error("不支持的网盘链接");
    }
    return {
        title: res.title,
        sub: res.sub,
        headers:{
            "Referer": vid,
            "User‑Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
        }
    }
}

async function play(url) {
    return url;
}

async function search(wd, pg) {
    let list = [];
    const base = "http://www.wogg.lol";
    //todo:搜索地址：`${base}/index.php/vod/search/wd/${wd}/page/${pg}.html`
    //fetch搜索结果页面，解析提取网盘分享链接vid
    return {
        list: list,
        page: pg
    }
}

async function isVideo() {
    return true;
}

module.exports = {init,home,category,detail,play,search,isVideo}
