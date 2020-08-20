const puppeteer = require('puppeteer');
const prompts = require('prompts');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4182.0 Safari/537.36');
    try {
        const [userIdInput] = await Promise.all([
            page.waitForSelector('#logUidTxt'),
            page.goto('https://ibx.key.com/ibxolb/login/index.html#/login'),
        ]);
        await userIdInput.type(process.env.KEYBANK_USER_ID);
        const [pwdInput] = await Promise.all([
            page.waitForSelector('#logPwdTxt'),
            page.click('button[data-analytics*="login_authenticate"]'),
        ]);
        await pwdInput.type(process.env.KEYBANK_PASSWORD);
        const [questionsBtn] = await Promise.all([
            page.waitForXPath('//button[. = "Security Questions"]'),
            page.click('button[data-analytics*="login_submit"]'),
        ]);
        const [questionLbl] = await Promise.all([
            page.waitForSelector('span[data-test="sq_answer_lbl"]'),
            questionsBtn.click(),
        ]);
        const question = await questionLbl.evaluate(el => el.innerText);
        const { answer } = await prompts({
            type: 'password',
            name: 'answer',
            message: question,
        });
        await page.type('input[data-test="sq_answer_input"]', answer);
        await Promise.all([
            page.waitForSelector('.account-portal-container'),
            page.click('button[data-test="sq_submit_btn"]'),
        ]);
        await page.screenshot({path: 'dashboard.png'});
    }
    catch(ex) {
        console.log(ex);
        await page.screenshot({path: 'error.png'});
    }
    finally {
        await browser.close();
    }
})();
