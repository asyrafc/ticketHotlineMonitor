const rp = require('request-promise');
const cheerio = require('cheerio');
const player = require('node-wav-player');

async function monitor() {
    let ticketAvailable = false;
	while(true) {
		await rp('https://ticket.tickethotline.com.my/')
			.then(async (data) => {
				const str = cheerio('[id=bodyHolder_ctl00_pnlBuy]', data).text();
				if(!str.includes('Our online tickets have reached its limit') && !str.includes('SOLD OUT')) {
					console.log('Tiket dah ada la kot.');
					ticketAvailable = true;
					//console.log(`https://ticket.tickethotline.com.my/${cheerio('[id=bodyHolder_ctl00_pnlBuy] > a', data).attr.href}`);
				}
				if(str.includes('Our online tickets have reached its limit')) {
					console.log('Ticket belum ada lagi.');
				}
				if(data.includes('The service is unavailable.')) {
					console.log('Tidak pasti, mungkin laman sesawang x hidup.');
				}
			})
			.catch(err => err);
		
		if(ticketAvailable === true) {
			await player.play({ path: './alarm.wav', sync: true })
				.then(() => console.log('Alarm dah bunyi.'))
				.catch(error => console.error(error));
		}
	}
};

monitor();