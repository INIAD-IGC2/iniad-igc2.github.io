



/* メニューの設定 */
function SetPage()
{
    AddHamburgerMenuButton("/index.html", "Home", "Go to main page");
    AddHamburgerMenuButton("/html/AboutIGC2.html", "About", "About I G C 2");
    let worksDropdown = new DropdownConstructor("worksdropdown", "works");
    worksDropdown.AddContent("/html/works/Works2018.html", "2018", "Works of 2018");
    worksDropdown.AddContent("/html/works/Works2019.html", "2019", "Works of 2019");
    worksDropdown.AddContent("/html/works/Works2020.html", "2020", "Works of 2020");
    worksDropdown.AddContent("/html/works/Works2021.html", "2021", "Works of 2021");
    worksDropdown.AddContent("/html/works/Works2022.html", "2022", "Works of 2022");
    worksDropdown.AddContent("/html/works/Works2023.html", "2023", "Works of 2023");
    worksDropdown.ConstructDropdown();
    AddHamburgerMenuButton("/games.html", "Games", "games");
    AddHamburgerMenuButton("/html/ContactIGC2.html", "Contact", "Contact I G C 2");
}

/*  */
function SetNews()
{

}


//汎用パーツロード処理
function LoadCommonData()
{
    //ロード済みのとき
    //CopyCommonDataの中にも同じようなものがあるので注意
    if(sessionStorage.getItem(constructedKey))
    {
        SetHeaderMain(sessionStorage.getItem(constructedHeaderKey));
        SetHamburgerContent(sessionStorage.getItem(constructedHamburgerMenuKey));
        SetClickImageChangers(sessionStorage.getItem(gotCICOutherHTMLKey),sessionStorage.getItem(youtubeiframeOutherHTMLKey));
        Loaded();
    }
    else//ロードされてないとき
    {
        GetOtherPage("/html/Common/Common.html",CommonDataLoaded);
    }

    CreateFooter();
}



function CreateFooter()
{
    let sitec = "IGC² 2024";

    let footer = document.getElementById("Footer");
    let footertext = document.createElement("p");
    footertext.innerText = sitec;
    footer.append(footertext);
}

/* ＝＝ページロード系＝＝ */
/*
sessionStorageを用いてページを跨いでデータを保持する
-文字列のみ、5MBまで、重要な情報を持たせない
ヘッダーやハンバーガーメニューの中身等のデータを保持させておく
-他ページへ変遷後、余計なロードを防ぎ、最初から生成する為に

sessionStorage.setItem('value', value);
.getItem(key);//value取得、存在するかの確認にも
.removeItem(key);
.clear(); //すべてのデータを削除
*/
let CommonDocument;
let HMResult = "";
const constructedKey = "IGC2SiteConstructedKey";
const constructedHeaderKey = "constructedHeaderKey";
const constructedHamburgerMenuKey = "constructedHamburgerMenuKey";
/*LoadCommonData();*/


//ロード完了
function Loaded()
{
    let loading = document.getElementById("loading");
    if(loading.classList.contains("loaded") == false)
    {
        loading.classList.add("loaded");
    }
}
//汎用パーツロード後処理
function CommonDataLoaded(commondata)
{
    CommonDocument = commondata;
    //print(CommonDocument);
    CopyCommonData();
}
//ロードしたデータからコピー
function CopyCommonData()
{
    //Headerコピー
    let from = CommonDocument.getElementById("HeaderMain");
    SetHeaderMain(from.innerHTML);
    //Headerセーブ
    sessionStorage.setItem(constructedHeaderKey, from.innerHTML);
    
    //ハンバーガーメニューの中身設定
    SetPage();
    SetHamburgerContent(HMResult);
    //ハンバーガーメニューの中身セーブ
    sessionStorage.setItem(constructedHamburgerMenuKey, HMResult);

    //クリックで画像切り替える奴構成
    let CICOuter = CommonDocument.getElementsByClassName("ClickImageChanger")[0].outerHTML;
    let youtubeiframeOuter = CommonDocument.getElementsByClassName("youtubeiframe")[0].outerHTML;
    SetClickImageChangers(CICOuter,youtubeiframeOuter);
    sessionStorage.setItem(gotCICOutherHTMLKey, CICOuter);
    sessionStorage.setItem(youtubeiframeOutherHTMLKey, youtubeiframeOuter);

    sessionStorage.setItem(constructedKey, "constructed");

    Loaded();
}
function SetHeaderMain(cont)
{
    document.getElementById("HeaderMain").innerHTML = cont;
}
function SetHamburgerContent(cont)
{
    document.getElementById("HamburgerContent").innerHTML = cont;
}
//他ページの内容をロード
function GetOtherPage(url,loadedfunc)
{
    let xhr = new XMLHttpRequest();

    xhr.responseType="document";//XMLとして扱いたいので一応記述
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let document = xhr.responseXML;//重要
            loadedfunc(document);
        }
    };
    xhr.send();
    //console.log("Load Common");
}


/* ＝＝ハンバーガーメニューの中身構築する関数類＝＝ */
//ボタン
function AddHamburgerMenuButton(url, text, urlExplanation)
{
    let str = CommonDocument.getElementById("HamburgerContentButtonOriginal").innerHTML;
    str = Format(str, url, text, urlExplanation);
    HMResult += str;
}
//ドロップダウン
class DropdownConstructor
{
    constructor(id, dropdownName)
    {
        this.ID = id;
        this.urls = [];
        this.texts = [];
        this.explanations = [];
        this.name = dropdownName;
    }
    
    AddContent(url, text, urlExplanation) 
    {
        this.urls.push(url);
        this.texts.push(text);
        this.explanations.push(urlExplanation);
    }
    ConstructDropdown()
    {
        let res = "";
        let content = CommonDocument.getElementById("HamburgerContentDropDownContentOriginal").innerHTML;
        let dropdown = CommonDocument.getElementById("HamburgerContentDropDownOriginal").innerHTML;
        for(let i = 0; i < this.urls.length; i++)
        {
            res += Format(content, this.urls[i], this.texts[i]);
        }
        HMResult += Format(dropdown, this.ID, this.name, res);
    }
}


/* ＝＝クリックしたら画像が切り替わる奴＝＝ */
/* imgのsrcを変える方法では画像の変更時に余計なサーバーとの通信が発生する */
/* 結構遅延がデカく、ネットワークが弱い時にアレなので最初に全ての画像を生成しておく方法に修正 */
let ClickImageIDCount = 0;
let ClickImageChangers = [];
let CreateCICQueue = [];
let CreateCICPos = [];

const gotCICOutherHTMLKey = "gotCICOutherHTMLKey";
const youtubeiframeOutherHTMLKey = "gotyoutubeiframeOutherHTMLKey";

//CICを生成queueに追加 URL, ALT,...
function AddClickImageChanger(...value)
{
    CreateCICQueue.push(value);
}

//生成
function SetClickImageChangers(CICOuterHTML,youtubeiframeOuterHTML)
{
    CreateCICPos = document.getElementsByClassName("CIC");

    //print("CICQ:"+CreateCICQueue.length+" CICQ[0]:"+CreateCICQueue[0].length);

    for(let i = 0; i < CreateCICQueue.length; i++)
    {
        CreateCICPos[i].innerHTML = CICOuterHTML;
        CreateCIC(i, CreateCICPos[i], CreateCICQueue[i], youtubeiframeOuterHTML);
    }

    CreateCICQueue = [];
    CreateCICPos = [];
}

//
const imgReg = /^\/img.+/;
const videoReg = /^https:\/\/www\..+/;
//const httpsReg = /^https:\/\/.+/;
const youtubeReg = /^https:\/\/www\.youtube\.com\/embed\/.+/;
const niconicoReg = /^https:\/\/embed\.nicovideo\.jp\/.+/;
const twitterReg = /^https:\/\/twitter\.com\/.+/;
//https://twitter.com/

/*
Twitter
後々<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>が必要
<blockquote class="twitter-tweet" data-media-max-width="2048">
<a href="https://twitter.com/KoSstudios/status/1623963321681743872?ref_src=twsrc%5Etfw">February 10, 2023</a>
</blockquote>
*/

function CreateCIC(index, element, value, youtubeiframe)
{
    //print(element.outerHTML);
    //print("value l:"+value.length);

    let screensparent = element.getElementsByClassName("video")[0];
    //let screensparent = element.querySelector(".video");
    let buttonssparent = element.getElementsByClassName("scrollView")[0];
    let screens = [];
    let buttons = [];
    let videolinks = [];
    let videoIndexs = [];
    let buttonNum = 0;

    let videoImgMode = false;

    for(let i = 0; i < value.length; i)
    {
        let isimg = imgReg.test(value[i]);
        //let isvideo = videoReg.test(value[i]);
        let isYoutube = youtubeReg.test(value[i]);
        let isNiconico = niconicoReg.test(value[i]);
        let isTwitter = twitterReg.test(value[i]);
        let isvideo = isYoutube || isNiconico;

        if(isimg)
        {
            if(i + 1 >= value.length) { break; }
            let screen = document.createElement("img");
            screen.classList.add("ImageAndVideoChangeScreen");
            screen.src = value[i];
            screen.alt = value[i+1];
            screensparent.append(screen);
            screens.push(screen);
            //print(screensparent);
            //print(screens);
            
            let button = document.createElement("img");
            button.classList.add("ImageChangeButton");
            button.src = value[i];
            button.alt = value[i+1];
            button.setAttribute('onclick', Format("PushImageChangerButton({0},{1})",index,i));
            buttons.push(button);
            //print(buttons);

            if(videoImgMode)
            {
                let buttonbinder = document.createElement("span");
                buttonbinder.style = "position: relative;";
                let videoicon = document.createElement("img");
                videoicon.src = "/img/UI/Video.webp";
                videoicon.alt = "video icon";
                videoicon.classList.add("ImageChangeVideoIcon");
                buttonbinder.append(button);
                buttonbinder.append(videoicon);
    
                buttonssparent.append(buttonbinder);

                videoImgMode = false;
            }else
            {
                buttonssparent.append(button);
            }

            buttonNum++;
            i+=2;
            continue;
        }
        else if(isvideo)
        {
            //動画用のiframeを生成し、所定の場所に突っ込む
            let youtubeElement = document.createElement("iframe");
            youtubeElement.frameBorder = 0;
            youtubeElement.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
            youtubeElement.classList.add("youtubeiframe");
            youtubeElement.setAttribute("allowfullscreen","");
            screensparent.append(youtubeElement);

            videolinks.push(value[i]);
            videoIndexs.push(buttonNum);

            videoImgMode = true;
            i++
            continue;
        }
        else if(isTwitter)
        {
            //Twitterはtwitterの仕組みに依存しているため、それを利用
            //その都合上、後で必ずtwitterのjsを読み込まなければならない
            /*
            <blockquote class="twitter-tweet" data-media-max-width="2048">
                <a href="https://twitter.com/KoSstudios/status/1623963321681743872?ref_src=twsrc%5Etfw">February 10, 2023</a>
            </blockquote>
            */
            let twitterparent = document.createElement("div");
            twitterparent.classList.add("youtubeiframe");
            twitterparent.classList.add("ImageAndVideoChangeScreen");
            let twitterElement = document.createElement("blockquote");
            twitterElement.classList.add("twitter-tweet");
            twitterElement.setAttribute("data-media-max-width","2048");
            let twitterlinkElement = document.createElement("a");
            twitterlinkElement.href = value[i];
            twitterlinkElement.innerText = "X (Twitter) Video link";
            twitterElement.append(twitterlinkElement);
            twitterparent.append(twitterElement);
            screensparent.append(twitterparent);

            videolinks.push(value[i]);
            videoIndexs.push(buttonNum);

            videoImgMode = true;
            i++
            continue;            
        }

        i++;
        continue;

    }

    //youtubeのiframeへのリンクを挿入
    let youtubeiframes = screensparent.getElementsByClassName("youtubeiframe");
    if(youtubeiframes.length == videolinks.length)
    {   
        for(let i = 0; i < videolinks.length; i++)
        {
            youtubeiframes[i].src = videolinks[i];
        }
    }

    //print(screens.length + " " + buttons.length + " " + youtubeiframes.length + " " + videoIndexs.length);
    let CIC = new ClickImageChanger(screens,buttons,youtubeiframes,videoIndexs);
    CIC.PushButton(0);
    ClickImageChangers.push(CIC);
}

function PushImageChangerButton(CICID,ButtonID)
{
    ClickImageChangers[CICID].PushButton(ButtonID);
}

class ClickImageChanger
{
    constructor(screenElements,buttonElements,videoElements,videoIndexs)
    {
        this.screenElements = screenElements;
        this.buttonElements = buttonElements;
        this.videoElements = videoElements;
        this.videoIndexs = videoIndexs;
        this.id = ClickImageIDCount;
        ClickImageIDCount++;

        this.screenElement;

        for(let i = 0; i < this.buttonElements.length; i++)
        {
            let func = Format("PushImageChangerButton({0},{1})",this.id,i);
            this.buttonElements[i].setAttribute('onclick', func);
        }
    }

    PushButton(buttonID)
    {
        let videonum = -1;

        //print(buttonID);
        //print("videoIndexsL:" + this.videoIndexs.length + " videoElementsL:"+this.videoElements.length);

        //上部Youtubeの表示
        for(let j = 0; j < this.videoIndexs.length; j++)
        {
            let num = this.videoIndexs[j];
            let vclass = this.videoElements[j].classList;
            if(num == buttonID)
            {
                videonum = num;
                if(vclass.contains("Unvisible"))
                {
                    vclass.remove("Unvisible");
                }
            }
            else
            {
                if(!vclass.contains("Unvisible"))
                {
                    vclass.add("Unvisible");
                }
            }
        }

        //上部写真の表示
        for(let i = 0; i < this.screenElements.length; i++)
        {
            let screenclasslist = this.screenElements[i].classList;
            if(i == videonum)
            {
                if(!screenclasslist.contains("Unvisible"))
                {
                    screenclasslist.add("Unvisible");
                }
                continue;
            }
            //print(i.toString() + " " + buttonID.toString());
            if(i == buttonID)
            {
                if(screenclasslist.contains("Unvisible"))
                {
                    screenclasslist.remove("Unvisible");
                }
            }else
            {
                if(!screenclasslist.contains("Unvisible"))
                {
                    screenclasslist.add("Unvisible");
                }
            }
        }

        //ボタン押した表示
        for(let i = 0; i < this.buttonElements.length; i++)
        {
            let cllst = this.buttonElements[i].classList;
            if(i == buttonID)
            {  
                if(!cllst.contains("Selected"))
                {
                    cllst.add("Selected");
                }
            }
            else
            {  
                if(cllst.contains("Selected"))
                {
                    cllst.remove("Selected");
                }
            }
        }

    }
}



/* ＝＝汎用＝＝ */
//C#とかのFormat処理擬き
function Format(str, ...value)//処理コストが気になる
{
    for(let i = 0; i < value.length; i++)
    {
        let f = new RegExp("\\{" + i.toString() + "\\}",'g');
        str = str.replace(f, value[i]);
    }
    return str;
}
//console出力短縮
function print(str)
{
    console.log(str);
}
//トグル形式のボタンを押したとき
function ClickToggleButton(ID)
{
    let element = document.getElementById(ID);
    if(element.classList.contains("Open"))//<=これのコストってどんなもん?
    {
        element.classList.remove("Open");
        element.classList.add("Close");
    }else{
        element.classList.add("Open");
        element.classList.remove("Close");
    }
}
//他のページに飛びたいとき
function GotoPage(url)
{
    //open(url);
    window.location.href = url;
}
//新しいタブで開く(未テスト)
function GotoPageOtherTab(url)
{
    window.open(url);
}
