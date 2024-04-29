const WebSocket = require('ws');
const {generatePDF} = require('../service/generatePDF.service')
const createWebSocketServer = () => {
    const server = new WebSocket.Server({ port: 4520 });
    let sockets = [];

    server.on('connection', function(socket) {
        sockets.push(socket);

        socket.on('message', async function(msg) {
            try {
                const message = JSON.parse(msg);
                if (message.type === 'fetchPDF') {
                    // console.log('Recebida solicitação fetchPDF:', message);
                    await generatePDF(message.html, message.pdf_name);
                    const pdfPath = '/caminho/do/arquivo.pdf';

                    socket.send(JSON.stringify({ path: pdfPath }));
                }
            } catch (error) {
                console.error('Erro ao processar a mensagem:', error);
            }
        });

        socket.on('close', function() {
            sockets = sockets.filter(s => s !== socket);
        });
    });

    return server;
};

module.exports = createWebSocketServer;
