var arNum = new Array();		// green egg's lotto drawing
var nMegaNum = 0;				// green egg's mega number
var arUserNum = new Array();	// user choices
var nUserMegaNum = 0;			// user mega number
var arHistory = new Array();	// keeps track of all of the previous draws

spin();

// ---------------------------------------
// print superLotto numbers
// ---------------------------------------
{
	var	$sNumbers = "<table border=1><tr>";

	for (var i=1;i<48;i++) {
		if ((i!=1) && (i%6 == 1)) {
			$sNumbers += "</tr><tr>";
		}
		$sNumbers += "<td><label><input type='checkbox' class='num' name='num' value='"+i+"'>"+i+"</label></td>";
	}

	$sNumbers += "<td>&nbsp;</td></tr></table>";
	$sNumbers += "<input type='button' id='refresh-nums' value='Clear Choices'>";
	$('#numbers').append($sNumbers);
}

// ---------------------------------------
// print mega numbers
// ---------------------------------------
{
	var	$sMegaNumbers = "<table border=1><tr>";
	
	for (var i=1;i<28;i++) {
		if ((i!=1) && (i%6 == 1)) {
			$sMegaNumbers += "</tr><tr>";
		}
		$sMegaNumbers += "<td><input type='radio' class='meganum' name='meganum'>";
		$sMegaNumbers += "<label for='m'" + i + ">" + i + "</label></td>";
	}
	for (var i=0;i<3;i++) {
		$sMegaNumbers += "<td>&nbsp;</td>";
	}

	$sMegaNumbers += "</tr></table>";
	$('#megaNumbers').append($sMegaNumbers);
}


// ---------------------------------------
// Create the lotto numbers
// ---------------------------------------
function spin()
{
	var nMin = 1;
	var nMax = 47;
	var bCheck = true;

	while (bCheck) {
		nMegaNum = Math.floor(Math.random() * (nMax - nMin + 1)) + nMin;
		for (var i=0; i<5; i++) {
			arNum[i] = Math.floor(Math.random() * (nMax - nMin + 1)) + nMin;
		}

		// confirm no duplicates for 0 - 4
		if ((arNum[0] != arNum[1]) && (arNum[0] != arNum[2]) &&
			(arNum[0] != arNum[3]) && (arNum[0] != arNum[4]) &&
			(arNum[1] != arNum[2]) && (arNum[1] != arNum[3]) &&
			(arNum[1] != arNum[4]) && (arNum[2] != arNum[3]) &&
			(arNum[2] != arNum[4]) && (arNum[3] != arNum[4])) {
			bCheck = false;
		}
	}
	
	// sort the numbers
	arNum.sort(function(a,b){ return a-b;});
	
	console.log("SPIN: " + arNum[0] + " " + arNum[1] + " " + arNum[2] + " " + arNum[3] + " " + arNum[4] + " + " + nMegaNum);
}

// ---------------------------------------
// Pick the mega number
// ---------------------------------------
$('.meganum').click(function() {
	var radio_button = $(this);

	// What is the label next to (i.e. after) that radio 
	var label = radio_button.next();

	// Now that we know the label, grab the text inside of it (That's our message!)
	var message = label.html();

	nUserMegaNum = message;
});

// ---------------------------------------
// superLotto limit to 5 numbers
// ---------------------------------------
$("input[type=checkbox][name=num]").click(function() {
	var limit = $("input[type=checkbox][name=num]:checked").length >= 5;
	$("input[type=checkbox][name=num]").not(":checked").attr("disabled",limit);

	arUserNum = [];
	$('#numbers :checked').each(function() {
		arUserNum.push($(this).val());
	});
	console.log("super click: " + arUserNum);
});

// ---------------------------------------
// clear number choices
// ---------------------------------------
$('#refresh-nums').click(function() {
	// Clear the lotto numbers
	$('#numbers').find(':checked').each(function() {
		$(this).removeAttr('checked');
	});
	
	// Enable all of the boxes
	$("input[type=checkbox][name=num]").removeAttr("disabled");
	
	// Clear the mega number choice
	$("input[type=radio][name=meganum]").removeAttr("checked");
	
	// clear the choice array -- don't know if i need this !@#
	clearChoices();
});

// ---------------------------------------
//	clear ALL number choices
// ---------------------------------------
function clearChoices() {
	for (var i=0;i<5;i++) {
		arUserNum[i] = 0;
	}
}

// ---------------------------------------
//	confirm 5 numbers and 1 mega are picked
// ---------------------------------------
function validateChoices() {
	// check superLotto numbers
	for (var i=0;i<5;i++) {
		console.log("validateChoices(): " + i + " - " + arUserNum[i]);
		if ((arUserNum[i] == 0) || (typeof(arUserNum[i]) == 'undefined')) {
			console.log('validateChoices(): false lotto');
			return false;
		}
	}
	
	// check mega number
	if ((nUserMegaNum == 0) || (typeof(nUserMegaNum) == 'undefined')) {
		console.log('validateChoices(): false mega');
		return false;
	}
	
	console.log('validateChoices(): true');
	return true;
}

// ---------------------------------------
// Purchase your ticket
// ---------------------------------------
$('#purchase-tkt').click(function() {
	// confirm that all of the number choices are made 
	if (!validateChoices()) {
		$('#ball-nums').text("Please select 5 numbers & 1 mega number");
		return;
	}
	else {
		$('#ball-nums').empty();
	}
	
	// display the user choices
	$('#userNums').text("Your choices: " + arUserNum + " + " + nUserMegaNum);

});

// ---------------------------------------
// Spin the wheel!
// ---------------------------------------
$('#spin').click(function() {
	if (nMegaNum == 0) {
		spin();
	}
		
	// display the numbers
	var msg = "<ul id='balls-list'><li>" + arNum[0]
				+ "</li><li>" + arNum[1] 
				+ "</li><li>" + arNum[2] 
				+ "</li><li>" + arNum[3] 
				+ "</li><li>" + arNum[4] 
				+ "</li></ul>";
	$('#balls-bg').html(msg);
	
	// display the mega number
	$('#balls-mega-bg').html(nMegaNum);
	
	console.log("SPIN: " + arNum[0] + " " + arNum[1] + " " + arNum[2] + " " + arNum[3] + " " + arNum[4] + " + " + nMegaNum);
	//$('#ball-nums').text("SPIN: " + arNum[0] + ", " + arNum[1] + ", " + arNum[2] + ", " + arNum[3] + ", " + arNum[4] + " + " + nMegaNum);
	
	// add the choices to history
	historyAdd();
	historyDisplay();
	
	// do any numbers match?
	checkNumbers();
	
	// for the cheating function
	nMegaNum = 0;
});

	
// ---------------------------------------
// see if any numbers match
// ---------------------------------------
function checkNumbers() {
	var nMatching = 0;
	var msg = "Sorry, the mega number doesn't match";
	
	// check the megaNumber
	if (nMegaNum == nUserMegaNum) {
		msg = "You hit the mega number!";
	}
	
	// check the superLotto numbers
	for (var i=1;i<arNum.length;i++) {
		for (var j=1;j<arUserNum.length;j++) {
			if (arNum[i] == arUserNum[j]) {
				nMatching++;
			}
		}
	}

	$('#matching').empty();
	$('#matching').append(msg + " <br>Super Lotto: " + nMatching + " are matching!!\n");
}


// ---------------------------------------
// History - add
// ---------------------------------------
function historyAdd() {
	var len = arHistory.length;
	arHistory[len] = new Array();
	for (var i=0; i<5; i++) {
		arHistory[len][i] = arNum[i];
	}
	arHistory[len][5] = nMegaNum;
}

// ---------------------------------------
// History - display
// ---------------------------------------
function historyDisplay() {
	var msg = "";
	for (var i=0; i<arHistory.length; i++) {
		msg = arHistory[i][0] + ", " + 
			arHistory[i][1] + ", " + 
			arHistory[i][2] + ", " + 
			arHistory[i][3] + ", " + 
			arHistory[i][4] + " + " + 
			arHistory[i][5] + "<br>";
	}
	
	// clear the field
	$('#history').empty;
	// add in the history
	$('#history').append(msg);
}





