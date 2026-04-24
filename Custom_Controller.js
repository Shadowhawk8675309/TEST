(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This extension must run unsandboxed.');
    }

    function getPad() {
        const pads = navigator.getGamepads();
        return pads[0] || null;
    }

    const BUTTON_MAP = {
        "A": 0,
        "B": 1,
        "X": 3,
        "Y": 2,
        "L": 4,
        "R": 5,
        "ZL": 6,
        "ZR": 7,
        "Minus": 8,
        "Plus": 9,
        "Left Stick": 10,
        "Right Stick": 11,
        "Dpad Up": 12,
        "Dpad Down": 13,
        "Dpad Left": 14,
        "Dpad Right": 15,
        "Home": 16,
        "Capture": 17
    };

    class CustomControllerExtension {
        getInfo() {
            return {
                id: 'customcontrollerextension',
                name: 'Custom Controller Extension',
                color1: '#000000',
                color2: '#000000',
                blocks: [
                    {
                        opcode: 'stickAxis',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'joystick [STICK] [AXIS] axis',
                        arguments: {
                            STICK: { type: Scratch.ArgumentType.STRING, menu: 'stickMenu' },
                            AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu' }
                        }
                    },
                    {
                        opcode: 'buttonPressed',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'button [BTN] pressed',
                        arguments: {
                            BTN: { type: Scratch.ArgumentType.STRING, menu: 'buttonMenu' }
                        }
                    },
                    {
                        opcode: 'rawState',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'raw gamepad state (0)'
                    }
                ],
                menus: {
                    stickMenu: { items: ['L', 'R'] },
                    axisMenu: { items: ['X', 'Y'] },
                    buttonMenu: {
                        items: [
                            'A', 'B', 'X', 'Y',
                            'L', 'R', 'ZL', 'ZR',
                            'Left Stick', 'Right Stick',
                            'Plus', 'Minus',
                            'Dpad Up', 'Dpad Down', 'Dpad Left', 'Dpad Right',
                            'Home', 'Capture'
                        ]
                    }
                }
            };
        }

        stickAxis(args) {
            const pad = getPad();
            if (!pad) return 0;

            let index;
            if (args.STICK === 'L') {
                index = (args.AXIS === 'X') ? 0 : 1;
            } else {
                index = (args.AXIS === 'X') ? 2 : 3;
            }

            const value = pad.axes[index] || 0;
            return value;
        }

        buttonPressed(args) {
            const pad = getPad();
            if (!pad) return false;
            const index = BUTTON_MAP[args.BTN];
            return pad.buttons[index]?.pressed || false;
        }

        rawState() {
            const pad = getPad();
            if (!pad) return "{}";
            return JSON.stringify({
                buttons: pad.buttons.map(b => b.value),
                axes: pad.axes
            });
        }
    }

    Scratch.extensions.register(new CustomControllerExtension());
})(Scratch);
