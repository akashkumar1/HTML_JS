var updated_url="";
        var flag;
        var cHrIssues,cDyIssues,cOIssues;
   
        //fetches the data from git api -- repo/issues
        function fetch(){
         
            flag=Array.apply(null, Array(10000)).map(Number.prototype.valueOf,0);
            document.getElementById("id2").innerHTML = "";
            document.getElementById("id3").innerHTML = "";
            document.getElementById("id4").innerHTML = "";
           
            
                
         var url=document.getElementById("inp1").value;
         var matcher=new RegExp("((https://github.com)|(http://github.com)|(www.github.com)|(github.com))(/(([a-z]+[0-9]+)|([a-z]*[0-9]+)|([a-z]+[0-9]*))+)+(/(([a-z]+[0-9]+)|([a-z]*[0-9]+)|([a-z]+[0-9]*))+)+","i");
          
          
          if(matcher.test(url) && (url.startsWith("https://github.com") || url.startsWith("http://github.com") || url.startsWith("github.com") || url.startsWith("www.github.com")))
          {
            var pos=url.indexOf("github.com/");
              var usr="",usr_rep="",f=0;
              for(var i=pos+11;i<url.length;i++)
              {
                    if(f==0 && url[i]!='/')
                    {
                        usr+=url[i];
                    }
                    else if(f==0 && url[i]=='/')
                    {
                        f=1;
                    }
                    else if(f==1 && url[i]!='/')
                    {
                        usr_rep+=url[i];
                    }
                    else if(f==1 && url[i]=='/')
                    {
                        f=2;
                    }
              } 

              updated_url="https://api.github.com/repos/"+usr+"/"+usr_rep+"/"+"issues";             //updated_url is url to users issues api
            document.getElementById("id2").innerHTML="Accessing... " +url;
            console.log("Accessing... " +updated_url);

            var xhttp = new XMLHttpRequest();
           xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {

                var res = JSON.parse(xhttp.responseText);

                var curDt= new Date();
                var time1=curDt.getTime();         //converting todays date into milliseconds

                

                cHrIssues=0;cDyIssues=0;cOIssues=0;
                for(var i=0;i<res.length;i++)
                {
                    if(res[i].state=="open")
                    {
                        cOIssues++;
                        var datei=new Date(res[i].created_at);      //converting issue date into milliseconds
                        var timei=datei.getTime();

                        if((time1-timei)<=86400000)
                        {
                            cHrIssues++;                      //increasing count of issues created in last 24hrs
                        }

                        if((time1-timei)>604800000)
                        {
                            cDyIssues++;                      //increasing count of issues opened more than 7 days ago
                        }
                    }
                    
                }

                console.info("fetch results: ", res);
                document.getElementById("id2").innerHTML = "Total number of issues: " + cOIssues;
                document.getElementById("id3").innerHTML = "Total number of issues in last 24 hours: " +cHrIssues;
                document.getElementById("id4").innerHTML = "Total number of issues that were opened for more than 7 days: " +cDyIssues;


                //clear all data present in accordion from previous fetch    
                document.getElementById("accordion1").innerHTML="";

                //creating buttons dynamically & adding them to accordion
                for(var i=1;i<=cOIssues;i++)
                {
                    var btnid="issues"+i;        

                   var content= "<center><button type="+'button class='+"btn btn-primary btn-block  data-toggle = collapse data-target = " +"#demo"+btnid+" onclick=showdata("+i+")"+">"+res[i-1].title+"</button><br>"+"<div id="+'demo'+btnid +" "+'class='+"collapse></div><br></center>";
                     $("#accordion1").append(content);
                 }

            }
            else
            {
                console.log("issue xmlhttp request status: " +xhttp.status);
                console.log("issue xmlhttp request state" +xhttp.readyState);
            }
          };

          xhttp.open("GET", updated_url, true);
          xhttp.send();

          }
          else
          {
            document.getElementById("id2").innerHTML="Invaild Repository";  
          }
          
        }

        
        //fetched the data from git api--issues/comments
        function  showdata(a)
        {

            
            if(flag[a] === 1)
            {
                console.info("flag=1");
                document.getElementById("demo"+"issues"+Number(a)).innerHTML=sessionStorage.getItem(Number(a));
            }
            else
            {
                console.info("flag=0");
                var issue_url=updated_url+"/"+a+"/comments"
                console.info("issueurl: " +issue_url);
                var xhttp = new XMLHttpRequest();
               xhttp.onreadystatechange = function() 
               {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {

                        var res = JSON.parse(xhttp.responseText);
                        var str="";
                        for(var i=0;i<res.length;i++)
                        {
                            str=str+"<br>"+"*"+res[i].body;
                        }

                        sessionStorage.setItem(Number(a), str);
                        flag[a]=1;
                         document.getElementById("demo"+"issues"+Number(a)).innerHTML=sessionStorage.getItem(Number(a));
                     }
                    else
                    {
                        console.log("comment xmlhttprequest status" +xhttp.status);
                        console.log("comment xmlhttprequest state" +xhttp.readyState);
                    }

                };
                xhttp.open("GET", issue_url, true);
                xhttp.send();
            }
        }               