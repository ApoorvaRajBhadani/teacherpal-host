$(function(){
    //Initialize Popup.html
    chrome.storage.sync.get(['id','username'],function(userinfo){
        if(userinfo.id && userinfo.id != "none"){
            //user is signed in
            $("#btnSignIn").css('display','none');
            $("#email").css('display','none');
            $("#pass").css('display','none');
            $("#userinfo").text("Logged in as "+userinfo.username);
        }else{
            //user is not signed in
            $("#btnSignOut").css('display','none');
            $("#btnTakeAttendance").css('display','none');
            $("#userinfo").css('display','none');
        }
    });

    //Sign in click listener
    $("#btnSignIn").click(function(){
        //console.log(token);
        var email = $("#email").val();
        var pass = $("#pass").val();
        $("#email").val("");
        $("#pass").val("");
        fetch('http://localhost:8000/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: pass,
            }),
            headers: {
                'Content-type': 'application/json',
            },
        })
        .then(function(response){
            console.log(response.status);
            return response.json();
        })
        .then(function(json){
            //console.log(json.id);
            if(json.id){
                console.log(json);
                console.log("login successful");
                const uid = json.id;
                chrome.storage.sync.set({'id':uid,'role':json.role,'username':json.username,'token': json.token},function(){

                    $("#btnSignOut").css('display','block');
                    $("#btnTakeAttendance").css('display','block');
                    $("#userinfo").css('display','block');
                    $("#userinfo").text("Logged in as "+json.username);
        
                    $("#btnSignIn").css('display','none');
                    $("#email").css('display','none');
                    $("#pass").css('display','none');
                });
            }else{
                console.log(json);
                console.log("login failed");
                // close();
            }
        });
    });

    //Take Attendance click listener
    $("#btnTakeAttendance").click(function(){
        chrome.storage.sync.get(['id','token','meetId'],function(res){
            console.log(res);
                var authtoken = "JWT "+res.token;
                var meetlink = "https://meet.google.com/"+res.meetId;
                if(res.meetId!="none"){
                    fetch('http://localhost:8000/api/take-attendance', {
                        method: 'POST',
                        body: JSON.stringify({
                            meet_link: meetlink,
                            sender: res.id,
                            duration: 120
                        }),
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': authtoken
                        },
                    })
                    .then(function(response){
                        console.log(response.status);
                        return response.json();
                    })
                    .then(function(json){
                        console.log(json);
                        if(json.response){
                            close();
                        }
                    });
                }
        });
    });

    //Sign Out click listener
    $("#btnSignOut").click(function(){
        chrome.storage.sync.set({'id':"none",'token':"none",'username':'none','role':'none'},function(){

            $("#btnSignOut").css('display','none');
            $("#btnTakeAttendance").css('display','none');
            $("#userinfo").css('display','none');

            $("#btnSignIn").css('display','block');
            $("#email").css('display','block');
            $("#pass").css('display','block');
        });
    });
});