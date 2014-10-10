$( document ).ready( function() {
	
	var prompts = {
		'pinEntry': 'Please enter your PIN:',
		'default': 'Please make a choice...',
		'withdrawalEntry': 'How much to withdraw?',
		'balance': 'Your balance is currently: $',
		'takeCash': 'Please take your cash.',
		'depositEntry': 'How much to deposit?',
		'depositAccepted': 'Thank you for your business.',
		'another': 'Would you like to perform another transaction?',
		'niceDay': 'Have a nice day.',
		'insufficientFunds': 'Sorry, you do not have enough money in your account to cover this request.',
		'systemError': 'Sorry, an error occurred in our system.'
	}
	
	var buttonData = { 
		withdraw: {
			'label': 'Withdraw',
			'action': function(){ promptForWithdrawal(); }
		},
		deposit: {
			'label': 'Deposit',
			'action': function(){ promptForDeposit(); }
		},
		makeDeposit: {
			'label': 'Enter',
			'action': function(){ makeDeposit(); }
		},
		pin: {
			'label': 'Re-Enter PIN',
			'action': function(){ enterPin(); }
		},
		balance: {
			'label': 'Balance',
			'action': function(){ viewBalance(); }
		},
		cancel: {
			'label': 'Cancel',
			'action': function(){ cancel(); }
		},
		submitPin: {
			'label': 'Enter',
			'action': function(){ submitPin(); }
		},
		makeWithdrawal: {
			'label': 'Enter',
			'action': function(){ makeWithdrawal(); }
		},
		anotherTransaction: {
			'label': 'Yes',
			'action': function(){ cancel(); }
		},
		complete: {
			'label': 'No',
			'action': function(){ bye(); }
		}
	}
	
	function enterPin() {
		$( '#main-prompt' ).html( prompts[ 'pinEntry' ] ).append( '<input id="pinNumber" type="password">' );
		$( '#pinNumber' ).focus();
		var buttonLayout = {
			'l4': 'cancel',
			'r4': 'submitPin'
		}
		adjustButtons( buttonLayout );
	}
	
	function promptForWithdrawal() {
		$( '#main-prompt' ).html( prompts[ 'withdrawalEntry' ] ).append( '<input id="withdrawalAmount" type="text">' );
		$( '#withdrawalAmount' ).focus();
		var buttonLayout = {
			'l4': 'cancel',
			'r4': 'makeWithdrawal'
		}
		adjustButtons( buttonLayout );
	}
	
	function makeWithdrawal() {
		var balance = parseInt( localStorage.getItem( 'balance' ) );
		var withdrawalAmount = parseInt( $( '#withdrawalAmount' ).val() );
		$.ajax( {
			type: "POST",
			url: "balance-validator.php",
			data: {
				balance: balance,
				withdrawalAmount: withdrawalAmount
				},
			datatType: "json"
			})
			.done( function( msg ) {
				if ( msg.ok ) {					
					adjustBalance( withdrawalAmount * -1 );
					$( '#main-prompt' ).html( prompts[ 'takeCash' ] + ' ' + prompts[ 'another' ] );
				} else {
					$( '#main-prompt' ).html( prompts[ 'insufficientFunds' ] + ' ' + prompts[ 'another' ] );
				}			
			})
			.fail( function() {
				$( '#main-prompt' ).html( prompts[ 'systemError' ] + ' ' + prompts[ 'another' ] );				
			})
			.always( function() {
				promptForAdditionalTransaction();
			});
	}
	
	function promptForDeposit() {
		$( '#main-prompt' ).html( prompts[ 'depositEntry' ] ).append( '<input id="depositAmount" type="text">' );
		$( '#depositAmount' ).focus();
		var buttonLayout = {
			'l4': 'cancel',
			'r4': 'makeDeposit'
		}
		adjustButtons( buttonLayout );
	}
	
	function makeDeposit() {
		adjustBalance( parseInt( $( '#depositAmount' ).val() ) );
		$( '#main-prompt' ).html( prompts[ 'depositAccepted' ] + ' ' + prompts[ 'another' ] );
		promptForAdditionalTransaction();
	}
	
	function viewBalance() {
		$( '#main-prompt' ).html( prompts[ 'balance' ] + localStorage.getItem( 'balance' ) + ' ' + prompts[ 'another' ] );
		promptForAdditionalTransaction();
	}
	
	function cancel() {
		resetInterface();
	}
	
	function submitPin() {
		var pin = $( '#pinNumber' ).val();
		displaySingleCard();
		resetInterface();
	}
	
	function resetInterface() {
		$( '#main-prompt' ).html( prompts[ 'default' ] );
		var buttonLayout = {
				'l3': 'withdraw',
				'l4': 'deposit',
				'r3': 'balance',
				'r4': 'pin'
			}
		adjustButtons( buttonLayout );
	}
	
	function promptForAdditionalTransaction() {
		var buttonLayout = {
			'l4': 'complete',
			'r4': 'anotherTransaction'
		}
		adjustButtons( buttonLayout );
	}
	
	function bye() {
		$( '#main-prompt' ).html( prompts[ 'niceDay' ] );
		var buttonLayout = {};
		adjustButtons( buttonLayout );
		resetCards();
		localStorage.setItem( 'balance', 1000 );
		setTimeout( function(){ resetInterface(); }, 1500 );		
	}	
	
	function adjustButtons( buttonLayout ) {
		//clear all existing button labels and unbind click events
		$( '.button-group li' ).html( '' ).off( 'click' );
		//add new button labels and bind in the correct function for click events
		$.each( buttonLayout, function( index, value ) {
			$( '#' + index ).on( 'click', buttonData[ value ].action ).html( '<label>' + buttonData[ value ].label + '</label>' ); 
		})
	}
	
	function adjustBalance( adjustmentAmount ) {
		localStorage.setItem( 'balance', parseInt( localStorage.getItem( 'balance' ) ) + adjustmentAmount );
	}
	
	function displaySingleCard() {
		$( '#cards' ).addClass( 'grey' );
		$( '#card-sprite' ).css( 'width', '27px' ).show();	
	}
	
	function resetCards() {
		$( '#cards' ).removeClass( 'grey' );
		$( '#card-sprite' ).hide();
	}
	
	resetInterface();
	localStorage.setItem( 'balance', 1000 ); //start with 1000
})