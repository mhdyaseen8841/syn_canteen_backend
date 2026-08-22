import express from 'express';

const router = express.Router();

// Parse raw text body — ESSL/ZKTeco devices send plain text
router.use(express.text({ type: '*/*', limit: '10mb' }));

const DEVICE_SN = 'NCD8250700058'; // ESSL X2008 serial number

// ── GET /iclock/cdata.aspx  →  Handshake (device registers with server) ──────
// Must reply with this plain-text config block — "OK" alone won't work.
function sendHandshake(req, res, sn) {
    const body = [
        `GET OPTION FROM: ${sn}`,
        `ATTLOGStamp=9999`,
        `OPERLOGStamp=9999`,
        `ATTPHOTOStamp=None`,
        `ErrorDelay=30`,
        `Delay=10`,
        `TransTimes=00:00;14:00`,
        `TransInterval=1`,
        `TransFlag=1111000000`,
        `TimeZone=+5.5`,
        `Realtime=1`,
        `Encrypt=0`,
        `ServerVer=2.0.0`,
        `PushProtVer=2.0.1`,
        '',
    ].join('\r\n');

    res.set('Content-Type', 'text/plain');
    res.set('Connection', 'close');
    res.status(200).send(body);
}

// ── Main handler ──────────────────────────────────────────────────────────────
const handleAdmsRequest = (req, res) => {
    const method = req.method.toUpperCase();
    const { SN = '' } = req.query;

    if (method === 'GET') {
        return sendHandshake(req, res, SN || DEVICE_SN);
    }

    if (method === 'POST' && req.body) {
        console.log('[ADMS] Body:\n', req.body);
    }

    res.set('Content-Type', 'text/plain');
    res.set('Connection', 'close');
    res.status(200).send('OK');
};

router.all('/cdata.aspx',      handleAdmsRequest);
router.all('/getrequest.aspx', (req, res) => { res.set('Content-Type', 'text/plain'); res.set('Connection', 'close'); res.status(200).send('OK'); });
router.all('/devicecmd.aspx',  (req, res) => { res.set('Content-Type', 'text/plain'); res.set('Connection', 'close'); res.status(200).send('OK'); });

export default router;
