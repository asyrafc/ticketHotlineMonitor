const rp = require('request-promise');
const cheerio = require('cheerio');
const player = require('node-wav-player');

async function monitor() {
    let ticketAvailable = false;
	while(true) {
		await rp('https://ticket.tickethotline.com.my/')
			.then(async (data) => {
				const str = cheerio('[id=bodyHolder_ctl00_pnlBuy]', data).text();
				if(str.includes('BUY TICKETS')) {
					console.log('Tiket dah ada la kot.');
					ticketAvailable = true;
					//console.log(`https://ticket.tickethotline.com.my/${cheerio('[id=bodyHolder_ctl00_pnlBuy] > a', data).attr.href}`);
				}
				if(str.includes('Our online tickets have reached its limit')) {
					console.log('Ticket belum ada lagi.');
				}
				if(str.includes('SOLD OUT')) {
					console.log('Ticket dah habis.');
				}
				if(data.includes('The service is unavailable.')) {
					console.log('High amount of traffic.');
				}
				if(!data) {
					console.log('Probably website down.');
				}
				else {
					console.log(`Mesej: ${str}`);
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