// Socket.io events

// incoming events:

name: 'put' 
data: { coordinates: { x: INT, y: INT},
        state: STRING 1/2/3/4,
        success: BOOLEAN
      }

name: 'removed'
data: { coordinates: { x: INT, y: INT},
        state: STRING 1/2/3/4,
        success: BOOLEAN
      }

name: 'moved'
data: { from: { x: INT, y: INT},
        to:  { x: INT, y: INT},
        state: STRING 1/2/3/4
      }

name: 'rotated'
data: [{ from: { x: INT, y: INT},
        to:  { x: INT, y: INT},
         state: STRING 1/2/3/4
      },
      { from: { x: INT, y: INT},
        to:  { x: INT, y: INT}
        state: STRING 1/2/3/4      
      },
      { from: { x: INT, y: INT},
        to:  { x: INT, y: INT}
        state: STRING 1/2/3/4
      }...
      ]

// outgoing events

name: 'insert'
data: {coordinates: {x: INT, y: INT},
       state: STRING 1/2/3/4
      }