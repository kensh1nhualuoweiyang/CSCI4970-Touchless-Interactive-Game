export default {
    name: "MainScene", //Scene name
    children: [ //Game objects in the scene
      {
        gameObject: {
          name: "MainCamera", components: [
            { name: "WorldCameraComponent" },
          ]
        }
      },
      {
        gameObject: {
          name: "ScreenCamera", components: [
            { name: "ScreenCameraComponent" }
          ], children: [
            {
              gameObject: {
                name: "ScreenText",
                components: [
                  {
                    name: "ScreenTextComponent",
                    args: ["Test", { alignment: "left", justification: "bottom" }]
                  }
                ]
              },
              x: 40, y: 40
            },
          ]
        }
      },
    ]
  }