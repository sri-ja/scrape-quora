const url = process.argv[2];
const maxAnswers = process.argv[3] || 5;
if (!url || url.toLowerCase() === "help") return console.log(`Hewwo! I'm scwaping puppy\nYou can ask me to scwape any quowa pwofile's answows using the fowwoing syntax\nnode index.js [link to quora profile's answers] [max number of answers you want]`);
if (!url.includes("quora")) return console.log(`AWff this doesn't smeww wike a quowa wink.`);
if (!url.toLowerCase().endsWith("answers")) return console.log(`Awff you need to send me a url to someone's answows page.`);
const { Builder, By } = require("selenium-webdriver");
const fs = require("fs");

const scrape = async () => {
	console.log("hewwoo I am a scraping puppy\narf");
	const driver = await new Builder().forBrowser("chrome").build();
	await driver.get(url);
	let lastButton = null;
	const scroll = async () => {
		// const buttons = await driver.findElements(By.css(".q-click-wrapper .q-absolute"));
		const buttons = await driver.findElements(By.css(".q-click-wrapper .q-box.spacing_log_answer_content"));
		if (lastButton === buttons[buttons.length] - 1 || buttons.length > maxAnswers) {
			let quoraName = await driver.getTitle();
			quoraName = quoraName.slice(0, -8);

			await console.log(`I loaded ${quoraName}'s last ${buttons.length} answers.\narf!`);

			const answers = [];
			for (const button of buttons) {
				await driver.actions().scroll(0, 0, 0, 50, button).perform();

				await button.click();
				answers.push(await button.getText());
			}
			fs.writeFileSync(`${quoraName}.txt`, answers.slice(0, maxAnswers).join("\n\n\n"));
			console.log(`I expanded ${quoraName}'s last ${maxAnswers} answers, and wrote them to '${quoraName}.txt'.\narf arf!.`);
			process.exit(0);
		} else {
			lastButton = buttons.length - 1;
			await driver
				.actions()
				.scroll(0, 0, 0, 200, buttons[buttons.length - 1])
				.perform();
			await scroll();
		}
	};
	scroll();
};

scrape();
