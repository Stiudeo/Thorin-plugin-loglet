# Thorin.js plugin for loglet.io

Loglet.io node.js client for encrypted log streaming and storage.
For more information, visit https://loglet.io

Getting Started
---------------

#### Installation:

    npm install thorin-plugin-loglet --save

#### Usage:

    thorin.addPlugin(require('thorin-plugin-loglet'), {
        key: 'YOUR_APP_KEY',
        secret: 'YOUR_APP_SECRET'
    });
    
#### Note:
If the key and secret will not be given specifically through options, it will look for the environment variables: LOGLET_KEY and LOGLET_SECRET