
/* ニュース一覧 */
function SetNews()
{
    AddNewsPage("News Test1","/html/News/NewsPages/TestNews.html");
    AddNewsPage("News Test2","/html/News/NewsPages/TestNews.html");
    AddNewsPage("News Test3\nsomeText","/html/News/NewsPages/TestNews.html");
    AddNewsPage("News Test4","/html/News/NewsPages/TestNews.html");
    AddNewsPage("News Test5","/html/News/NewsPages/TestNews.html");
    AddNewsPage("News Test6","/html/News/NewsPages/TestNews.html");
    AddNewsPage("News Test7","/html/News/NewsPages/TestNews.html");
    AddNewsPage("News Test8","/html/News/NewsPages/TestNews.html");

    CreateNewsHeaderList();
}




newsList = [];

class NewsData
{
    constructor(header,link)
    {
        this.header = header;
        this.link = link;
    }
}

function AddNewsPage(header,link)
{
    newsList.push(new NewsData(header,link));
}

function CreateNewsHeaderList()
{
    let contentBox = document.getElementsByClassName("NewsHeaderList");
    
    for(let i = 0; i < contentBox.length; i++)
    {
        for(let j = 0; j < newsList.length; j++)
        {
            let aElement = document.createElement("a");
            aElement.href = newsList[j].link;
            aElement.setAttribute('aria-label',"go to news");

            let oneElement = document.createElement("p");
            oneElement.innerText = newsList[j].header;

            aElement.append(oneElement);
            contentBox[i].append(aElement);
        }
    }
}

function CreateNewsList()
{
    
}





SetNews();
