$(function(){
    //Take Attendance click listener
    $("#btnTakeQuiz").click(function(){
        const question = $("#question").val();
        const optionA = $("#optionA").val();
        const optionB = $("#optionB").val();
        const optionC = $("#optionC").val();
        const optionD = $("#optionD").val(); 
        const correctAnswer = $("#correctAnswer").val(); 
        chrome.storage.sync.get(['id','token','meetId'],function(res){
            console.log(res);
                const authtoken = "JWT "+res.token;
                const meetlink = "https://meet.google.com/"+res.meetId;
                const userid = res.id;
                if(res.meetId!="none"){
                    fetch('http://localhost:8000/api/take-quiz', {
                        method: 'POST',
                        body: JSON.stringify({
                            meet_link: meetlink,
                            sender: userid,
                            duration: 120,
                            question: question,
                            option_a: optionA,
                            option_b: optionB,
                            option_c: optionC,
                            option_d: optionD,
                            answer: correctAnswer
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
});