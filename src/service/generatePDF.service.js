const { app, BrowserWindow, protocol } = require('electron');
const os = require('os');
const path = require('path');
const fs = require('fs');

let pdfWindow;


app.on('ready', () => {
    pdfWindow = new BrowserWindow({ 
        show: true,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true,
            browser: {
                sandbox: false,
                webgl: true,
                large: true,
            },
        }
    });
    pdfWindow.loadURL('about:blank');

    protocol.registerFileProtocol('app', (request, callback) => {
        const url = request.url.replace('app://', '');
        const filePath = path.join(__dirname, url);
        callback({ path: filePath });
    });
});

async function generatePDF(html, fileName) {
   
    if (!pdfWindow) {
        return res.status(500).send("PDF window is not ready.");
    }

    try {
     
        function fixedHead(sizePage) {
            const folderPath = __dirname;
            
            let head = `<head>
                <meta charset="utf-8">
                <meta name="author" content="Zscan Software Ltda.">
                <meta name="description" content="Zscan Capture System">
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                <meta name="theme-color" content="#F0F0F0">
                <!-- <link rel="manifest" href="https://localhost:4514/manifest.json"> -->
                <link rel="stylesheet" href="app://vendor/bootstrap/css/bootstrap.min.css">
                <link rel="stylesheet" href="app://vendor/bootstrap/css/font-awesome.min.css">
                <link rel="stylesheet" href="app://vendor/bootstrap-icons/bootstrap-icons.css">
                <link rel="stylesheet" href="app://stylesheets/style.css">
                <link rel="stylesheet" href="app://stylesheets/paper.css">
                <link rel="stylesheet" href="app://stylesheets/print.css" media="print">
                <!-- <link rel="stylesheet" href="./selectSearch.css"> -->
                <!-- <link rel="stylesheet" href="./flag.css"> -->
                <title></title>
                <link rel="stylesheet" type="text/css" id="mce-u0" href="app://vendor/tinymce/skins/ui/oxide/skin.min.css">
            </head>
            `;
            head += `<style>@page {size: ${sizePage};}</style>`;

            return head;
        }
      
        const htmlWithHeader = `
            <html>
            ${fixedHead('A4')}
            <body>
                ${html}
            </body>
            </html>
        `;

        const encodedHtml = encodeURIComponent(htmlWithHeader);
        const dataUrl = `data:text/html;charset=utf-8,${encodedHtml}`;

        await pdfWindow.loadFile(dataUrl);
        pdfWindow.show = true;
        pdfWindow.webContents.on('did-finish-load', async () => {
            try {
                const pdfPath = fileName;

                const pdfData = await pdfWindow.webContents.printToPDF({});
                await fs.promises.writeFile(pdfPath, pdfData);

                console.log("PDF successfully generated and saved at: ", pdfPath);
                return({ path: pdfPath.replace(/\\/g, '/') });
            } catch (error) {
                console.log(`Failed to generate or save PDF: `, error);
                return({ error: "faleid to generate pdf"});
            }
        });
    } catch (error) {
        console.log(`Failed to load HTML into window: `, error);
        res.status(500).send("Failed to load HTML into window.");
    }
}

module.exports = {
    generatePDF
}
