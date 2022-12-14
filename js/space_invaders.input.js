"use strict";

var space_invaders = (typeof space_invaders !== "undefined") ? space_invaders : {};

space_invaders.input = (function () {

    // -------------------------------------
    // onKeyDown(space) -> fireQueue.push({});
    // handleInput() -> pop 1 and fire

    // onKeyDown(LEFT) -> MOVE_LEFT = TRUE;
    // onKeyUp(LEFT) -> MOVE_LEFT = FALSE;
    // onKeyDown(RIGHT) -> MOVE_RIGHT = TRUE;
    // onKeyUp(RIGHT) -> MOVE_RIGHT = FALSE;

    // handleInput() -> If MOVE_LEFT -> handleCommand(CMD_SHIP_LEFT)
    // handleInput() -> If MOVE_RIGHT -> handleCommand(CMD_SHIP_RIGHT)

    var CMD_FIRE = "fire";
    var CMD_SHIP_LEFT = "ship-left";
    var CMD_SHIP_RIGHT = "ship-right";

    function InputCommand(ship) {
        this.handleCommand = function (command) {
            switch (command) {
            case CMD_FIRE:
                //document.getElementById('music').play();
                ship.fire();
                break;
            case CMD_SHIP_LEFT:
                //document.getElementById('music').play();
                ship.moveLeft();
                break;
            case CMD_SHIP_RIGHT:
                //document.getElementById('music').play();
                ship.moveRight();
                break;
            default:
                throw new Error("Command not recognized: " + command);
            }
        }
    }

    function KeyInputBuffer(inputCommand) {
        if (!inputCommand) {
            throw new Error("KeyInputBuffer(inputCommand): missing inputCommand!");
        }
        var rightDown = false;
        var leftDown = false;
        var fireQueue = [];

        this.pressRightDown = function (state) {
            rightDown = state;
        };
        this.pressLeftDown = function (state) {
            leftDown = state;
        };
        this.pressSpaceBar = function () {
            fireQueue.push({});
        };
        this.handleInput = function () {
            if (rightDown) {
                inputCommand.handleCommand(CMD_SHIP_RIGHT);
            } else if (leftDown) {
                inputCommand.handleCommand(CMD_SHIP_LEFT);
            }
            if (fireQueue.length > 0) {
                fireQueue.pop();
                inputCommand.handleCommand(CMD_FIRE);
            }
        };
    }

    function setupInputHandlers(inputCommand) {
        var KEY_SPACE = 32;
        var KEY_LEFT_ARROW = 37;
        var KEY_RIGHT_ARROW = 39;

        var kbd = new KeyInputBuffer(inputCommand);

        var onKeyDown = function (event) {
            switch (event.keyCode) {
            case KEY_SPACE:
                kbd.pressSpaceBar();
                break;
            case KEY_LEFT_ARROW:
                kbd.pressLeftDown(true);
                break;
            case KEY_RIGHT_ARROW:
                kbd.pressRightDown(true);
                break;
            }
        };
        var onKeyUp = function (event) {
            switch (event.keyCode) {
            case KEY_LEFT_ARROW:
                kbd.pressLeftDown(false);
                break;
            case KEY_RIGHT_ARROW:
                kbd.pressRightDown(false);
                break;
            }
        };
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);

        var fire = document.getElementById('fire');
        fire.onmousedown = fire.ontouchstart = function() {
            kbd.pressSpaceBar();
        };

        var right = document.getElementById('right');
        right.onmousedown = right.ontouchstart = function() {
            kbd.pressRightDown(true);
        };
        right.onmouseup = right.ontouchend = function() {
            kbd.pressRightDown(false);
        };

        var left = document.getElementById('left');
        left.onmousedown = left.ontouchstart = function() {
            kbd.pressLeftDown(true);
        };
        left.onmouseup = left.ontouchend = function() {
            kbd.pressLeftDown(false);
        };
        return kbd;
    }

    return {
        InputCommand: InputCommand,
        setupInputHandlers: setupInputHandlers
    }
})();
