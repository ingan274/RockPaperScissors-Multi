$(document).ready(function () {
    // -----ID selectors-----

    // Submit Name
    // #name-input - text box for name entry 
    // #joinGameBtn - submit button for name entry

    // User Name Display
    // #player1name - player 1 name
    // #player2name - player 2 name

    // Player 1 score
    // #player1win - player 1 win
    // #player1lose - player 1 lose

    // Player 2 score
    // #player2win - player 2 win
    // #player2lose - player 2 lose 

    // #chatTitle - Container with chat and userInput Form
    // #chat - div where chat is displayed 
    // #chatInput - div containing textbox and submit button for name entry
    // #chat-input- text box for chat entry 
    // #submitChat - submit button for chat text

    // -----DATABASE STRUCTURE-----
    // players >
    // p1 >
    // name
    // win
    // loss
    // p2 >
    // name 
    // win
    // loss
    // logic notes: 
    // if outcome is 1 = "player 1 wins"
    // if outcome is 2 = "player 2 wins"
    // if outcome is 0 = "the result is a tie"

    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBf1kVJGEzZHt98IuF_UQZdjXMsytXKdt8",
        authDomain: "isabel-n-rock-paper-scissors.firebaseapp.com",
        databaseURL: "https://isabel-n-rock-paper-scissors.firebaseio.com",
        projectId: "isabel-n-rock-paper-scissors",
        storageBucket: "",
        messagingSenderId: "668311817458",
        appId: "1:668311817458:web:005007ab19aa32f7"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Alias database and sub-levels.
    var database = firebase.database();

    // player var objects
    var p1 = null;
    var p2 = null;

    // Store the player names
    var p1name = "";
    var p2name = "";

    // Store the name of the player in the user's browser
    var yourPlayerName = "";

    // Store the player choices
    var p1Choice = "";
    var p2Choice = "";

    // Make turn start with player 1
    var turn = 1;

    // Listening to submit button of new player
    $("#joinGameBtn").on("click", function (event) {
        event.preventDefault();
        // adding perameters that player 1 must be added before player 2
        if (($("#name-input").val().trim() !== "") && !(p1 && p2)) {
            // Adding p1
            if (p1 === null) {
                player1Name = $("#name-input").val().trim();
                p1 = {
                    name: player1Name,
                    win: 0,
                    loss: 0,
                    tie: 0,
                    choice: ""
                };
                // creating under child 1
                database.ref().child("/players/p1").set(p1);
                // setting turn to player 1
                database.ref().child("/turn").set(1);
                // Lookiing is player disconnect
                database.ref("/players/p1").onDisconnect().remove();

            }
            // adding player 2 if player 1 is filled
            else if ((p1 !== null) && (p2 === null)) {
                player2Name = $("#name-input").val().trim();
                p2 = {
                    name: player2Name,
                    win: 0,
                    loss: 0,
                    tie: 0,
                    choice: ""
                };

                // hide Player input so that no one else can join
                $("#playerInput").hide();

                database.ref().child("/players/p2").set(p2);
                database.ref("/players/p2").onDisconnect().remove();
            }

            // print a message to the chat when a user joins the game;
            var msg = yourPlayerName + " has joined!";
            console.log(msg);
            var chatKey = database.ref().child("/chat/").push().key;
            // push the key and write the chat message to the database
            database.ref("/chat/" + chatKey).set(msg);

            $("#name-input").val("");
        }
    });

    // any database changes
    database.ref("/players/").on("value", function(snapshot) {

        // Check to see if player 1 exists in our database 
    	if (snapshot.child("p1").exists()) {
    		// player 1 variables
    		p1 = snapshot.val().p1;
    		p1name = p1.name;

    		// display player 1 name and score data 
            $("#player1name").text(p1name);
            $("#player1win").text(p1.win);
            $("#player1lose").text(p1.lose);
        } else {
    		console.log("Player 1 does NOT exist in the database");
    		p1 = null;
    		p1name = "";
    		// reset p1
            $("#player1name").text("Waiting for Player 1...");
            $("#player1win").text("0");
            $("#player1lose").text("0");
    		database.ref("/outcome/").remove();
    		$("#results").text("Waiting for all players to join.");
        }

         // Check to see if player 2 exists in our database 
        if (snapshot.child("p2").exists()) {
    		// player 2 variables
    		p2 = snapshot.val().p2;
    		p2name = p2.name;

    		// display player 2 name and score data 
            $("#player2name").text(p2name);
            $("#player2win").text(p2.win);
            $("#player2lose").text(p2.lose);
        }  else {
    		console.log("Player 2 does NOT exist in the database");
    		p2 = null;
    		p2name = "";

    		// Reset p2
            $("#player2name").text("Waiting for Player 2...");
            $("#player2win").text("0");
            $("#player2lose").text("0");
            database.ref("/outcome/").remove();
        }

        // If both players are now present, it's p1's turn
    	if (p1 && p2) {
            $("#results").text("Game Time");
            console.log("Both players are now present")

            // green border around player turn (rn is player 1)
            $("#player1").addClass("yourTurn");
    		// Update the center display
    		$("#results").text("Waiting for " + p1name + " to choose...");
        }
        	// reset chat, turn, and results display
    	if (!p1 && !p2) {
    		database.ref("/chat/").remove();
    		database.ref("/turn/").remove();
    		database.ref("/outcome/").remove();
    		$("#chatdisplay").empty();
    		$("#p1display").removeClass("yourTurn");
    		$("#p2display").removeClass("yourTurn");
    		$("#results").text("Waiting for all players to join.");
    	}
    });
    // any disconections
    database.ref("/players/").on("child_removed", function(snapshot) {
    	var msg = snapshot.val().name + " has disconnected!";
    	// use a unique key for the disconnection chat entry
    	var chatKey = database.ref().child("/chat/").push().key;
    	// save the disconnection chat entry to the database with the key
    	database.ref("/chat/" + chatKey).set(msg);
    });

    
});