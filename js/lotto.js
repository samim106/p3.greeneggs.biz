$(document).ready(function(){
	var arNum = new Array();		// green egg's lotto drawing
	var nMegaNum = 0;				// green egg's mega number
	var arUserNum = new Array();	// user choices
	var nUserMegaNum = 0;			// user mega number
	var arHistory = new Array();	// keeps track of all of the previous draws

	// Get the winning numbers 
	spin();

	// ---------------------------------------
	// print superLotto numbers
	// ---------------------------------------
	{
		var	$sNumbers = "<table><tr>";

		for (var i=1;i<48;i++) {
			if ((i!=1) && (i%6 == 1)) {
				$sNumbers += "</tr><tr>";
			}
			$sNumbers += "<td><label><input type='checkbox' class='num' name='num' value='"+i+"'>"+i+"</label></td>";
		}

		$sNumbers += "</tr></table>";
		$sNumbers += "<input type='button' id='refresh-nums' value='Clear Choices'>";
		$('#numbers').append($sNumbers);
	}

	// ---------------------------------------
	// print mega numbers
	// ---------------------------------------
	{
		var	$sMegaNumbers = "<table><tr>";
		
		for (var i=1;i<28;i++) {
			if ((i!=1) && (i%6 == 1)) {
				$sMegaNumbers += "</tr><tr>";
			}
			$sMegaNumbers += "<td><input type='radio' class='meganum' name='meganum'>";
			$sMegaNumbers += "<label for='m'" + i + ">" + i + "</label></td>";
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
	}

	// ---------------------------------------
	// Get the mega number
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
	// Limit superLotto numbers to 5
	// ---------------------------------------
	$("input[type=checkbox][name=num]").click(function() {
		var limit = $("input[type=checkbox][name=num]:checked").length >= 5;
		$("input[type=checkbox][name=num]").not(":checked").attr("disabled",limit);

		arUserNum = [];
		$('#numbers :checked').each(function() {
			arUserNum.push($(this).val());
		});
	});

	// ---------------------------------------
	//	confirm 5 numbers and 1 mega are picked
	// ---------------------------------------
	function validateChoices() {
		// check superLotto numbers
		for (var i=0;i<5;i++) {
			if ((arUserNum[i] == 0) || (typeof(arUserNum[i]) == 'undefined')) {
				return false;
			}
		}
		
		// check mega number
		if ((nUserMegaNum == 0) || (typeof(nUserMegaNum) == 'undefined')) {
			//console.log('validateChoices(): false mega');
			return false;
		}
		
		return true;
	}

	// ---------------------------------------
	// clear number choices
	// ---------------------------------------
	$('#refresh-nums').click(function() {
		clearChoices();
	});

	// ---------------------------------------
	//	clear ALL number choices
	// ---------------------------------------
	function clearChoices() {
		// Clear the lotto numbers
		$('#numbers').find(':checked').each(function() {
			$(this).removeAttr('checked');
		});
		
		// Enable all of the boxes
		$("input[type=checkbox][name=num]").removeAttr("disabled");
		
		// Clear the mega number choice
		$("input[type=radio][name=meganum]").removeAttr("checked");

		// Clear out the stored choices
		for (var i=0;i<5;i++) {
			arUserNum[i] = 0;
		}
		// Clear out the user's mega number
		nUserMegaNum = 0;
	}


	// ---------------------------------------
	// Purchase user ticket
	// ---------------------------------------
	$('#purchase-tkt').click(function() {
		// clear any other messages
		$('#matching').empty();
		$('#balls-bg').empty();
		$('#balls-mega-bg').empty();

		// confirm that all of the number choices are made 
		if (!validateChoices()) {
			$('#userNums').html("<p class='err'>Please select 5 numbers & 1 mega number</p>");
			return;
		}
		
		// display the user choices
		$('#userNums').html("<p>Your numbers: " + arUserNum + " + " + nUserMegaNum + "</p>");
	});

	// ---------------------------------------
	// Spin the wheel!
	// ---------------------------------------
	$('#spin').click(function() {
		if (nMegaNum == 0) {
			spin();
		}
		if (!validateChoices()) {
			$('#userNums').html("<p class='err'>Strange, you haven't purchased a ticket, but you can keep spinning if you want to!</p>");
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
		
		// do any numbers match?
		checkNumbers();
		
		// Reset the numbers
		nMegaNum = 0;
		
		
		// Clear out the previous user choices if not checked
		if (!$('#keep-nums').is(':checked')) {
			clearChoices();
		}
	});


	// ---------------------------------------
	// Check for matching numbers
	// ---------------------------------------
	function checkNumbers() {
		var nMatching = 0;
		var bMega = false;
		var msg = "Sorry, the mega number doesn't match";
		
		// check the megaNumber
		if (nMegaNum == nUserMegaNum) {
			msg = "You hit the mega number!";
			bMega = true;
		}
		
		// check the superLotto numbers
		for (var i=0;i<arNum.length;i++) {
			for (var j=0;j<arUserNum.length;j++) {
				if (arNum[i] == arUserNum[j]) {
					nMatching++;
				}
			}
		}

		// CELEBRATE! you matched all numbers!
		if ((bMega) && (nMatching == 5)) {
			$('#matching').html("<p class='winner'>YAY! YOU HIT THE JACKPOT!!</p>");
		}
		else {
			$('#matching').html("<p>Green Eggs Lotto: " + nMatching + " matching!!<br>"+ msg + "</p>");
		}
	}					

	
	// ---------------------------------------
	// Cheat
	// ---------------------------------------
	$('#cheat').click(function() {
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
	});
});