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
    //   p1 >
    //      name
    //      win
    //      loss
    //   p2 >
    //      name 
    //      win
    //      loss
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
    var playerName = "";

    // Store the player choices
    var p1Choice = "";
    var p2Choice = "";

    // Make turn start with player 1
    var turn = 1;
    var results;

    // Listening to submit button of new player
    $("#joinGameBtn").on("click", function (event) {
        event.preventDefault();
        // adding perameters that player 1 must be added before player 2
        if (($("#name-input").val().trim() !== "") && !(p1 && p2)) {
            localStorage.clear();
            // Adding p1
            if (p1 === null) {
                var playerName = $("#name-input").val().trim();
                localStorage.setItem("name", playerName);
                p1 = {
                    name: playerName,
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

                $("#playerInput").hide();
                $("#rpsBtn").show();

            } // adding player 2 if player 1 is filled
            else if ((p1 !== null) && (p2 === null)) {
                var playerName = $("#name-input").val().trim();
                localStorage.setItem("name", playerName);
                p2 = {
                    name: playerName,
                    win: 0,
                    loss: 0,
                    tie: 0,
                    choice: ""
                };

                // hide Player input so that no one else can join
                $("#playerInput").hide();
                $("#rpsBtn").show();

                database.ref().child("/players/p2").set(p2);
                database.ref("/players/p2").onDisconnect().remove();

            }

            // print a message to the chat when a user joins the game;
            var msg = playerName + " has joined!";
            var chatKey = database.ref().child("/chat/").push().key;
            // push the key and write the chat message to the database
            database.ref("/chat/" + chatKey).set(msg);

            $("#name-input").val("");
        }
        // if player 2 and player 1 is filled
        if (p1 !== null && p2 !== null) {
            $("#extraPlayer").modal("show");
        }
    });
    $("#playerInput").keypress(function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            event.preventDefault();
            // adding perameters that player 1 must be added before player 2
            if (($("#name-input").val().trim() !== "") && !(p1 && p2)) {
                localStorage.clear();
                // Adding p1
                if (p1 === null) {
                    var playerName = $("#name-input").val().trim();
                    localStorage.setItem("name", playerName);
                    p1 = {
                        name: playerName,
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

                    $("#playerInput").hide();
                    $("#rpsBtn").show();

                } // adding player 2 if player 1 is filled
                else if ((p1 !== null) && (p2 === null)) {
                    var playerName = $("#name-input").val().trim();
                    localStorage.setItem("name", playerName);
                    p2 = {
                        name: playerName,
                        win: 0,
                        loss: 0,
                        tie: 0,
                        choice: ""
                    };

                    // hide Player input so that no one else can join
                    $("#playerInput").hide();
                    $("#rpsBtn").show();

                    database.ref().child("/players/p2").set(p2);
                    database.ref("/players/p2").onDisconnect().remove();
                }

                // print a message to the chat when a user joins the game;
                var msg = playerName + " has joined!";
                var chatKey = database.ref().child("/chat/").push().key;
                // push the key and write the chat message to the database
                database.ref("/chat/" + chatKey).set(msg);

                $("#name-input").val("");
            }

            // if player 2 and player 1 is filled
            if (p1 !== null && p2 !== null) {
                $("#extraPlayer").modal("show");
            }}
        });


    // any database changes
    database.ref("/players/").on("value", function (snapshot) {

        // Check to see if player 1 exists in our database 
        if (snapshot.child("p1").exists()) {
            // player 1 variables
            p1 = snapshot.val().p1;
            p1name = p1.name;

            // display player 1 name and score data 
            $("#player1name").text(p1name);
            $("#player1win").text(p1.win);
            $("#player1lose").text(p1.loss);
            $("#player1tie").text(p1.tie);
        } else {
            p1 = null;
            p1name = "";
            // reset p1
            $("#player1name").text("Waiting for Player 1...");
            $("#player1win").text("0");
            $("#player1lose").text("0");
            database.ref("/outcome/").remove();
            $(".turn").text("Waiting for all players to join.");
        }

        // Check to see if player 2 exists in our database 
        if (snapshot.child("p2").exists()) {
            // player 2 variables
            p2 = snapshot.val().p2;
            p2name = p2.name;

            // display player 2 name and score data 
            $("#player2name").text(p2name);
            $("#player2win").text(p2.win);
            $("#player2lose").text(p2.loss);
            $("#player2tie").text(p2.tie);
        } else {
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
            $(".turn").text("Waiting for " + p1name + " to choose...");
            console.log("Both players are now present")
            // green border around player turn (rn is player 1)
            $("#player1").addClass("yourTurn");
        }
        // reset chat, turn, and results display
        if (!p1 && !p2) {
            database.ref("/chat/").remove();
            database.ref("/turn/").remove();
            database.ref("/outcome/").remove();
            $("#chatdisplay").empty();
            $("#player1").removeClass("yourTurn");
            $("#player2").removeClass("yourTurn");
            $(".turn").text("Waiting for all players to join.");
        }
    });

    // looking at who's turn it is
    database.ref("/turn/").on("value", function (snapshot) {
        if (p1 && p2) {
            // Check if it's p1's turn
            if (snapshot.val() === 1) {
                turn = 1;
                $("#player1").addClass("yourTurn");
                $("#player2").removeClass("yourTurn");
                $(".turn").html("Waiting on " + p1name + " to choose...");
                //otherwise, do the opposite for player 2 and make their
                // panel green and p2's panel not green 
            } else if (snapshot.val() === 2) {
                console.log("turn 2");
                turn = 2;
                $("#player1").removeClass("yourTurn");
                $("#player2").addClass("yourTurn");
                $(".turn").html("Waiting on " + p2name + " to choose...");
            }
        }
    });

    database.ref("/outcome/").on("value", function (snapshot) {
        results = snapshot.val();
        console.log(results)
        $(".results").text(results);
        if (snapshot.val() === "") {
            $(".results").text("Game Results");
        }
    })

    // Player 1 buttons
    $("#rock").on("click", function () {
        if (p1 && p2 && (localStorage.getItem("name") == p1.name) && (turn === 1)) {
            var choice = $(this).attr("id");
            console.log("player selected " + choice);
            p1Choice = choice;
            database.ref().child("/players/p1/choice").set(choice);

            turn = 2;
            database.ref().child("/turn").set(2);
        }
    });

    $("#paper").on("click", function () {
        if (p1 && p2 && (localStorage.getItem("name") === p1.name) && (turn === 1)) {
            var choice = $(this).attr("id");
            console.log("player selected " + choice);
            p1Choice = choice;
            database.ref().child("/players/p1/choice").set(choice);

            turn = 2;
            database.ref().child("/turn").set(2);
        }
    });

    $("#scissors").on("click", function () {
        if (p1 && p2 && (localStorage.getItem("name") === p1.name) && (turn === 1)) {
            var choice = $(this).attr("id");
            console.log("player selected " + choice);
            p1Choice = choice;
            database.ref().child("/players/p1/choice").set(choice);

            turn = 2;
            database.ref().child("/turn").set(2);
        }
    });

    // Player 2 buttons
    $("#rock").on("click", function () {
        event.preventDefault();
        if (p1 && p2 && (localStorage.getItem("name") === p2.name) && (turn === 2)) {
            var choice = $(this).attr("id");
            p2Choice = choice;
            database.ref().child("/players/p2/choice").set(choice);
            compareChoices();
        }
    });

    $("#paper").on("click", function () {
        event.preventDefault();
        if (p1 && p2 && (localStorage.getItem("name") === p2.name) && (turn === 2)) {
            var choice = $(this).attr("id");
            p2Choice = choice;
            database.ref().child("/players/p2/choice").set(choice);
            compareChoices();
        }
    });

    $("#scissors").on("click", function () {
        event.preventDefault();
        if (p1 && p2 && (localStorage.getItem("name") === p2.name) && (turn === 2)) {
            var choice = $(this).attr("id");
            p2Choice = choice;
            database.ref().child("/players/p2/choice").set(choice);
            compareChoices();
        }
    });

    //classic RPS game logic to pick a winner 
    function compareChoices() {
        if (p1.choice === "rock") {
            if (p2.choice === "rock") {
                // Tie
                database.ref().child("/outcome/").set("Tie game!");
                database.ref().child("/players/p1/tie").set(p1.tie + 1);
                database.ref().child("/players/p2/tie").set(p2.tie + 1);
            } else if (p2.choice === "paper") {
                // p2 wins
                database.ref().child("/outcome/").set(p2.name + " wins!");
                database.ref().child("/players/p1/loss").set(p1.loss + 1);
                database.ref().child("/players/p2/win").set(p2.win + 1);
            } else { // scissors
                // p1 wins
                database.ref().child("/outcome/").set(p1.name + " wins!");
                database.ref().child("/players/p1/win").set(p1.win + 1);
                database.ref().child("/players/p2/loss").set(p2.loss + 1);
            }
        } else if (p1.choice === "paper") {
            if (p2.choice === "rock") {
                // p1 wins
                database.ref().child("/outcome/").set(p1.name + " wins!");
                database.ref().child("/players/p1/win").set(p1.win + 1);
                database.ref().child("/players/p2/loss").set(p2.loss + 1);
            } else if (p2.choice === "paper") {
                // Tie
                database.ref().child("/outcome/").set("Tie game!");
                database.ref().child("/players/p1/tie").set(p1.tie + 1);
                database.ref().child("/players/p2/tie").set(p2.tie + 1);
            } else { // Scissors
                // p2 wins
                database.ref().child("/outcome/").set(p2.name + " wins!");
                database.ref().child("/players/p1/loss").set(p1.loss + 1);
                database.ref().child("/players/p2/win").set(p2.win + 1);
            }
        } else if (p1.choice === "scissors") {
            if (p2.choice === "rock") {
                // p2 wins
                database.ref().child("/outcome/").set(p2.name + " wins!");
                database.ref().child("/players/p1/loss").set(p1.loss + 1);
                database.ref().child("/players/p2/win").set(p2.win + 1);
            } else if (p2.choice === "paper") {
                // p1 wins
                database.ref().child("/outcome/").set(p1.name + " wins!");
                database.ref().child("/players/p1/win").set(p1.win + 1);
                database.ref().child("/players/p2/loss").set(p2.loss + 1);
            } else {
                // Tie
                database.ref().child("/outcome/").set("Tie game!");
                database.ref().child("/players/p1/tie").set(p1.tie + 1);
                database.ref().child("/players/p2/tie").set(p2.tie + 1);
            }
        }
        turn = 1;
        database.ref().child("/turn").set(1);
    }

    // any disconections
    database.ref("/players/").on("child_removed", function (snapshot) {
        var msg = snapshot.val().name + " has disconnected!";
        // use a unique key for the disconnection chat entry
        var chatKey = database.ref().child("/chat/").push().key;
        // save the disconnection chat entry to the database with the key
        database.ref("/chat/" + chatKey).set(msg);
    });

    // CHATBOX
    database.ref("/chat/").on("child_added", function (snapshot) {
        var chatMsg = snapshot.val();
        var chatEntry = $("<div>").text(chatMsg).addClass("instantMsg");
        // append the div stored in chatEntry with its new styling to the DOM
        $(".chat").append(chatEntry);
    });

    $("#submitChat").on("click", function (event) {
        event.preventDefault();
        // First, make sure that the player exists and the message textbox has text in it
        if ((localStorage.getItem("name") !== "") && ($("#chat-input").val() !== "")) {
            // Grab the message from the input box and subsequently reset the input box
            var message = $("#chat-input").val();
            var msg = localStorage.getItem("name") + ": " + message;
            $("#chat-input").val("");
            // Get a key for the new chat entry
            var chatKey = database.ref().child("/chat/").push().key;
            // Save the new chat entry
            database.ref("/chat/" + chatKey).set(msg);
        }
    });
});