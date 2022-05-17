import { clickLoginButton, clickWithUserName, login } from "../../main/pages/loginPage";
const validDataSet = require('../data/validLoginUser.json');
const invalidDataSet = require('../data/invalidLoginData.json');


import errorMessage from "../constants/errorMessage";
import pageTitle from "../constants/pageTitle";
import domain from "../constants/domain";
import attributes from "../commonAttribute/attributes";


fixture `Login Tests`
    .page(domain().url);

validDataSet.forEach(data => {
    test(`Verify success login with username '${data.name}'`, async(browser) => {
        await browser.maximizeWindow();
        await login({
            browser,
            username: data.name,
            password:data.password
        })
        await browser.expect(attributes().eleTitle.innerText).eql(pageTitle().productPageTitle);
        });
    });

invalidDataSet.forEach(data => {
        test(`Verify error message with username '${data.name}'`, async (browser) => {
            
            await login({
                browser,
                username: data.name,
                password:data.password
            })
            await browser.expect(attributes().eleErrorMessage.innerText).eql(data.error);
            
        });
    });

test(`Verify error message without username and password`, async(browser) => {
       
        await clickLoginButton({browser})
        await browser.expect(attributes().eleErrorMessage.innerText).eql(errorMessage().errorWhenUserEmpty);
    
});

test(`Verify error message without password`, async(browser) => {
   
    await clickWithUserName({browser, username:'user'})
    await browser.expect(attributes().eleErrorMessage.innerText).eql(errorMessage().errorWhenPasswordEmpty);

});

