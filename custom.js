var mycourses;
var mycourse;
let currentTeeIndex;
let numplayers = 1;
let player1Score = 0;
let player1InScore = 0;
let player1OutScore = 0;
let player2Score = 0;
let player2InScore = 0;
let player2OutScore = 0;
let player3Score = 0;
let player3InScore = 0;
let player3OutScore = 0;
let player4Score = 0;
let player4InScore = 0;
let player4Outscore = 0;
let totalsBox = false;
let lastScore = false;
let parTotal;

//functions below is calling the api
(function () {
    $.ajax({
        url: 'https://golf-courses-api.herokuapp.com/courses',
        type: 'GET',
        success: response => {
            mycourses = response.courses;
            loadDoc();
        }
    })
})();

function loadDoc() {
    for (let i = 0; i < mycourses.length; i++) {
        $('.courses').append(`<option value="${mycourses[i].id}"> ${mycourses[i].name}</option>`);
    }
}


// function is used to call the course id and other info for the golf card
function loadCourse(courseId) {
    $.ajax({
        url: `https://golf-courses-api.herokuapp.com/courses/${courseId}`,
        type: 'GET',
        success: response => {
            mycourse = response.data;
            holes();
            totalBox();

            $('.tees').html('');
            let teeArray = mycourse.holes[0].teeBoxes;
            for (let i = 0; i < teeArray.length; i++) {
                $('.tees').append(`<option value="${i}">${teeArray[i].teeType}</option>`)
            }
        }
    })
    $('.tees').css('display', 'inline');
}

function chooseTee(e) {
    currentTeeIndex = Number(e);
    addHoles();
}

//calling down things like the par, handicap, yards ,and other info from the api
function holes() {
    $('.apiinfo').html('');
    for (let i = 0; i < mycourse.holes.length; i++) {
        $('.apiinfo').append(`<div id="colinfo${i + 1}" class="colinfoumn"><div class="hole-label">Hole ${i + 1}<div></div>`);
    }
}

function addYards() {
    for (let i = 0; i < mycourse.holes.length; i++) {
        $(`#colinfo${i + 1}`).append(`<div class="yard-label">${mycourse.holes[i].teeBoxes[currentTeeIndex].yards} yrds</div>`);
    }
}

function addPar() {
    for (let i = 0; i < mycourse.holes.length; i++) {
        $(`#colinfo${i + 1}`).append(`<div class="par-label">Par is ${mycourse.holes[i].teeBoxes[currentTeeIndex].par}</div>`);
    }
}

function addHcp() {
    for (let i = 0; i < mycourse.holes.length; i++) {
        $(`#colinfo${i + 1}`).append(`<div class="hcp-label">Handicap ${mycourse.holes[i].teeBoxes[currentTeeIndex].hcp}</div>`);
    }
}


// when the divs are called the function display the holes and info
function addHoles() {
    for (let p = 1; p <= numplayers; p++) {
        for (let h = 0; h <= mycourse.holes.length; h++) {
            $(`#colinfo${h + 1}`).html('');
        }
    }
    for (let i = 0; i < mycourse.holes.length; i++) {
        $(`#colinfo${i + 1}`).append(`<div class="hole-label">Hole: ${i + 1}<div>`);
    }
    for (let p = 1; p <= numplayers; p++) {
        for (let h = 0; h <= mycourse.holes.length; h++) {
            $(`#colinfo${h + 1}`).append(`<label class="player-container">
            <span class="name${p}">Player ${p}</span><p class="namechange" onclick="editname(this)">Change Name</p><input onchange="totals(this)" type="text" id="p${p}h${h + 1}"/></label>`);
        }
    }
    for (let h = 0; h <= mycourse.holes.length; h++) {
        $(`#colinfo${h + 1}`).append(`<div class="info">Info: </div>`);
    }
    addYards();
    addPar();
    addHcp();
    $('.addPlayer').css('display', 'inline');
}

function editname(e) {
    let editedname = prompt('Change ur name. Lets keep it clean.');
    let nameLabel = $(e).parent().find("span");
    $(`.${nameLabel.attr("class")}`).html(editname);
}

function addPlayer() {
    if(numplayers < 4) {
        numplayers += 1;
        player1Score = 0;
        player2Score = 0;
        player3Score = 0;
        player4Score = 0;
        addHoles();
    }
}


//totals box is doin the math for the total scores and pars
function totalBox() {
    if(!totalsBox) {
        let totalBox = `<div class="totals">
        <div class="total-label">Total Score</div>
        <div class="total-par"></div>
        <div class="total-yards"></div>
        <div class="total-player1"></div>
        <div class="total-player2"></div>
        <div class="total-player3"></div>
        <div class="total-player4"></div>
    </div>`;
        $('.apiinfo').append(totalBox);
        totalsBox = true;
    } else {
        console.log('it works fam');
    }
}

function totalBoxUpdate() {
    let pars = [];
    for(let i = 1; i < $('.apiinfo').children().length; i++) {
        let par = $(`#colinfo${i}`).find('.par-label').html().charAt(7);
        pars.push(par);
    }
    parTotal = 0;
    for(let i = 0; i < pars.length; i++){
        parTotal += Number(pars[i]);
    }
    let yards = [];
    for(let i = 1; i < $('.apiinfo').children().length; i++) {
        let yardString = String($(`#colinfo${i}`).find('.yard-label').html());
        let yard = Number(yardString.split(' ')[0]);
        yards.push(yard);
    }
    let totalYards = 0;
    for(let i = 0; i < yards.length; i++) {
        totalYards += Number(yards[i]);
    }
    $('.total-yards').html(`Total Yards: ${totalYards}`);
    $('.total-par').html(`Total Par: ${parTotal}`);
    if(player1Score > 0) {
        $('.total-player1').html('');
        $('.total-player1').append(`Player 1 score: in: ${player1InScore} out: ${player1OutScore} total: ${player1Score}`);
    } else {
        $('.total-player1').html('');
    }
    if(player2Score > 0) {
        $('.total-player2').html('');
        $('.total-player2').append(`Player 2 score: in: ${player2InScore} out: ${player2OutScore} total: ${player2Score}`);
    } else {
        $('.total-player2').html('');
    }
    if(player3Score > 0) {
        $('.total-player3').html('');
        $('.total-player3').append(`Player 3 score: in: ${player3InScore} out: ${player3OutScore} total: ${player3Score}`);
    } else {
        $('.total-player3').html('');
    }
    if(player4Score > 0) {
        $('.total-player4').html('');
        $('.total-player4').append(`Player 4 score: in: ${player4InScore} out: ${player4Outscore} total: ${player4Score}`);
    } else {
        $('.total-player4').html('');
    }
}

function totals(e) {
    if($(e).attr('id').charAt(1) == '1') {
        if($(e).parent().parent().index() < mycourse.holes.length/2) {
            player1Score += Number($(e).val());
            player1InScore += Number($(e).val());
        } else {
            player1Score += Number($(e).val());
            player1OutScore += Number($(e).val());
        }
    } else if($(e).attr('id').charAt(1) == '2') {
        if($(e).parent().parent().index() < mycourse.holes.length/2) {
            player2Score += Number($(e).val());
            player2InScore += Number($(e).val());
        } else {
            player2Score += Number($(e).val());
            player2OutScore += Number($(e).val());
        }
    } else if ($(e).attr('id').charAt(1) == '3') {
        if($(e).parent().parent().index() < mycourse.holes.length/2) {
            player3Score += Number($(e).val());
            player3InScore += Number($(e).val());
        } else {
            player3Score += Number($(e).val());
            player3OutScore += Number($(e).val());
        }
    } else if ($(e).attr('id').charAt(1) == '4') {
        if($(e).parent().parent().index() < mycourse.holes.length/2) {
            player4Score += Number($(e).val());
            player4InScore += Number($(e).val());
        } else {
            player4Score += Number($(e).val());
            player4Outscore += Number($(e).val());
        }
    } else {
        console.log('an error has occured with scoring');
    }
    if($(e).parent().parent().index() == 17) {
        if(player1Score - parTotal > 0) {
            $(body).html("");
            let div = `<div class="final"><div>Your score is ${player1Score - parTotal} over par<div><div>feelsbadman</div></div>`;
            $(body).html(div);
        } else if(player1Score - parTotal < 0) {
            $(body).html("");
            let div = `<div class="final"><div>Your score is ${-(player1Score-parTotal)} under par</div><div>Naisu!</div></div>`;
            $(body).html(div);
        } else if(player1Score - parTotal == 0) {
            $(body).html("");
            let div = `<div class="final"><div>Par!</div><div>PogChamp</div></div>`;
            $(body).html(div);
        }
    }
    totalBoxUpdate();
}
